'use client'
import { LocationIdsEnum, ThemeEnum } from '@/../../content'
import { useRecoilState } from 'recoil'
import { locationAtom } from '@/atoms/locationAtom'
import { eventVotesbyUserAtom, eventsAtom } from '@/atoms/eventsAtom'
import { useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/useSupabase'
import toast from '@/lib/toast'
import { useUser } from '@/hooks/useUser'
import { EventByVotesType, EventType } from '@/types/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { themes } from '@/../../content'
import SwipeableViews from 'react-swipeable-views-react-18-fix'
import Header from '@/app/components/layout/Header'
import { updateEventsVotes } from '@/app/songs/songsUtils'
import Loading from '../loading'
import EventPage from '../components/EventPage'
import Image from 'next/image'
import { defaultEventImage } from '@/../../content'
import { toBeautifulDateTime } from '@/utils/utils'

export default function Home() {
  const [index, setIndex] = useState(0)
  const [events, setEvents] = useRecoilState<any>(eventsAtom)
  const [eventById, setEventById] = useState<EventType | undefined>()
  const [eventByVotes, setEventByVotes] = useState<EventByVotesType | undefined>()
  const [location] = useRecoilState<LocationIdsEnum>(locationAtom)
  const [isLoading, setIsLoading] = useState(true)
  const supabaseClient = useSupabase()
  const [userVotes, setUserVotes] = useRecoilState(eventVotesbyUserAtom)
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = Number(searchParams.get('id'))

  const prevSlide = () => {
    console.log('Changing slide -1', index)
    if (index > 0) setIndex(index - 1)
  }

  const nextSlide = () => {
    console.log('Changing slide +1', index)
    if (index < 1) setIndex(index + 1)
  }

  const onChangeIndex = (newIndex: number) => {
    if (newIndex > index) nextSlide()
    else prevSlide()
  }

  const getEvent = async () => {
    try {
      const thisEvent = await supabaseClient.getEventById(eventId)
      if (!thisEvent) throw new Error('Event not found')
      setEventById(thisEvent)
    } catch (e) {
      console.log('Error fetching event', e, 'eventId:', searchParams.get('id'))
      toast.error('Event not found', { id: 'event-not-found' })
      router.push('/events')
    }
  }

  const getVotedEvents = async () => {
    const votedEvents = await supabaseClient.getVotedEvents(location)
    setEvents({ ...events, [location]: votedEvents })
    const thisEvent = votedEvents.filter((e: EventByVotesType) => e.id == eventId)
    setEventByVotes(thisEvent[0])
    console.log('By votes', thisEvent)
  }

  const getUserVotes = async () => {
    const userVotes = await supabaseClient.getVotedEventsByUser(user?.id)
    const votes_list = userVotes.map((v: any) => v.event_id)
    setUserVotes(votes_list)
  }

  const handleVote = async (upVoteOnly:boolean = false) => {
    console.log('Vote event', eventId, user?.id)
    if (!user) {
      toast.error('You must login to vote', {
        id: 'failed-upvote-song-supabase',
      })
      return
    }
    const voteIndex = userVotes.find((v: any) => v == eventId)
    if (voteIndex) {
      if(upVoteOnly) return
      supabaseClient
        .deleteVoteEvent(eventId, user.id)
        .then((data: any) => {
          const newVotes = userVotes.filter((v: any) => v != eventId)
          const newEvents = updateEventsVotes(events, location, eventId, -1)
          setEventByVotes({
            ...eventByVotes,
            total_votes: Math.max(eventByVotes?.total_votes - 1, 0),
          })
          setEvents(newEvents)
          setUserVotes(newVotes)
        })
        .catch((e: any) => {
          console.error('Failed to delete vote for event', e)
        })
    } else {
      console.log('Setting new vote')
      supabaseClient
        .voteEvent(eventId, user.id)
        .then((data: any) => {
          const newVotes = [...userVotes, eventId]
          const newEvents = updateEventsVotes(events, location, eventId, 1)
          console.log('Setting loval votes', newVotes)
          setEventByVotes({ ...eventByVotes, total_votes: eventByVotes?.total_votes + 1 })
          setEvents(newEvents)
          setUserVotes(newVotes)
        })
        .catch((e: any) => {
          console.error('Failed to vote for event', e)
        })
    }
  }

  useEffect(() => {
    try {
      !isLoading && setIsLoading(true)

      // First ensure the event exists
      getEvent()

      // Then, get votes (more complex query)
      if (!events[location] || !events[location].length) {
        getVotedEvents()
      }
      if (Object.keys(userVotes).length < 1) {
        if (user) {
          getUserVotes()
        }
      }
    } catch (error) {
      console.log('Error fetching events', error)
      toast.error('Failed to fetch event votes', { id: 'failed-fetch-events' })
    } finally {
      setIsLoading(false)
    }
  }, [user, location]) //eslint-disable-line

  if (isLoading || !eventById) return <Loading />

  return (
    <div
      className={`
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
        scrollbar-hide
        ${themes[eventById?.theme as ThemeEnum]?.pageBackground || themes['default'].pageBackground}
      `}>
      <Header showUserBadge={false} spotifyRequired={false} className='bg-none' pageTitle={``} />
      <SwipeableViews
        enableMouseEvents
        animateTransitions
        resistance
        slideStyle={{
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        containerStyle={{ height: window.innerHeight }}
        index={index}
        axis='y'
        onChangeIndex={onChangeIndex}>
        <div className='h-screen w-full'>
          <EventPage
            eventById={eventById}
            eventByVotes={eventByVotes}
            handleVote={handleVote}
            prevSlide={prevSlide}
            nextSlide={nextSlide}
            userVotes={userVotes}
          />
        </div>
        <div className='h-screen w-full text-lg'>
          <div className='flex flex-col items-center gap-5'>
            <h1 className='text-2xl font-semibold'>{eventById.label}</h1>
            <div
              className='aspect-square max-w-[220px] max-h-[220px] w-5/6 object-cover overflow-hidden'
              style={{ position: 'relative' }}>
              <Image
                fill={true}
                objectFit='cover'
                alt='event-image'
                src={eventById?.image_path || defaultEventImage}
              />
            </div>
            <div className='flex flex-col gap-2 items-center w-5/6 mt-2'>
            <div className='flex flex-row items-start gap-2 w-full max-w-[350px] text-left'>
              <p className='font-bold w-1/4'>Starts:</p>
              <p className='w-3/4' >{toBeautifulDateTime(eventById.start_time)}</p>
            </div>
            <div className='flex flex-row items-start gap-2 w-full max-w-[350px] text-left'>
              <p className='font-bold w-1/4'>Ends:</p>
              <p className='w-3/4' >{toBeautifulDateTime(eventById.end_time)}</p>
            </div>
            <div className='flex flex-row items-start gap-2 w-full max-w-[350px] text-left'>
              <p className='font-bold w-1/4'>Location:</p>
              <p className='w-3/4' >{eventById.venue}</p>
            </div>
            {eventById.cover && <div className='flex flex-row items-start gap-2 w-full max-w-[350px] text-left'>
              <p className='font-bold w-1/4'>Cover:</p>
              <p className='w-3/4' >${eventById.cover}</p>
            </div>}
            <div>{eventById.classes_included}</div>
            </div>
          </div>
        </div>
      </SwipeableViews>
    </div>
  )
}

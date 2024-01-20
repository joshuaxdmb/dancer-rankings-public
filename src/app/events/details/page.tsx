'use client'
import { LocationIdsEnum } from '@/lib/content'
import { useRecoilState } from 'recoil'
import { locationAtom } from '@/atoms/locationAtom'
import { eventVotesbyUserAtom, eventsAtom } from '@/atoms/eventsAtom'
import { useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/useSupabase'
import toast from '@/lib/toast'
import { useUser } from '@/hooks/useUser'
import { EventByVotesType, EventType } from '@/types/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { availableThemes } from '@/lib/themes'
import SwipeableViews from 'react-swipeable-views-react-18-fix'
import Header from '@/app/components/layout/Header'
import { updateEventsVotes } from '@/app/songs/songsUtils'
import Loading from '../loading'
import EventPage from '../components/EventPage'
import EventDetailsPage from '../components/EventDetailsPage'

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
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | undefined>()
  const [isPlaying, setIsPlaying] = useState(false)

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1)
  }

  const nextSlide = () => {
    if (index < 1) setIndex(index + 1)
  }

  const onChangeIndex = (newIndex: number) => {
    if (newIndex > index) nextSlide()
    else prevSlide()
  }

  const setupAudio = (theme_song_url: string) => {
    if (!theme_song_url) return;
    // Check if an audio instance already exists
    if (audioInstance) {
      // If it exists, just change the source
      audioInstance.src = theme_song_url;
    } else {
      // If it doesn't exist, create a new instance
      const audio = new Audio(theme_song_url);
      audio.volume = 0.02;
      setAudioInstance(audio);
    }
  };

  const toggleAudio = () => {
    console.log('Toggle audio')
    if (audioInstance?.paused) {
      console.log('Playing audio')
      audioInstance.play()
      setIsPlaying(true)
    } else {
      console.log('Pausing audio')
      audioInstance?.pause()
      setIsPlaying(false)
    }
  }

  const getEvent = async () => {
    try {
      const thisEvent = await supabaseClient.getEventById(eventId)
      if (!thisEvent) throw new Error('Event not found')
      setEventById(thisEvent)
      setupAudio(thisEvent?.theme_song_url)
      console.log('Displaying event', thisEvent)
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

  const handleVote = async (upVoteOnly: boolean = false) => {
    console.log('Vote event', eventId, user?.id)
    if (!user) {
      toast.error('You must login to vote', {
        id: 'failed-upvote-song-supabase',
      })
      return
    }
    const voteIndex = userVotes.find((v: any) => v == eventId)
    if (voteIndex) {
      if (upVoteOnly) return
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
    // Define the event handler
    const playAudio = () => {
      if (audioInstance?.paused) {
        document.removeEventListener('click', playAudio)
        document.removeEventListener('keydown', playAudio)
        window.removeEventListener('scroll', playAudio);
        toggleAudio()
      }
    }

    // Add event listeners for user interactions
    document.addEventListener('click', playAudio)
    document.addEventListener('keydown', playAudio)
    window.addEventListener('scroll', playAudio, { passive: true });

    // Cleanup function to remove event listeners
    return () => {
      audioInstance?.pause()
      audioInstance?.remove()
      document.removeEventListener('click', playAudio);
      document.removeEventListener('keydown', playAudio);
      window.removeEventListener('scroll', playAudio);
    }
  }, [audioInstance])

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
        overflow-y-hidden
        scrollbar-hide
        ${
          availableThemes[eventById?.theme as keyof typeof availableThemes]?.pageBackground ||
          availableThemes['default'].pageBackground
        }
      `}>
      <Header
        showUserBadge={false}
        spotifyRequired={false}
        className='bg-none absolute right-0'
        pageTitle={``}
      />
      <SwipeableViews
        enableMouseEvents
        animateTransitions
        resistance
        slideStyle={{
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          scrollbarWidth: 'none',
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
            toggleAudio={toggleAudio}
            isPlaying={isPlaying}
          />
        </div>
        <EventDetailsPage eventById={eventById} />
      </SwipeableViews>
    </div>
  )
}

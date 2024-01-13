import { PlaylistEnum } from '../../../content'
import React, { useEffect, useState } from 'react'
import { EventByVotesType } from '@/types/types'
import { useUser } from '@/hooks/useUser'
import toast from '@/lib/toast'
import { useRecoilState } from 'recoil'
import { locationAtom } from '@/atoms/locationAtom'
import { updateEventsVotes } from '@/app/songs/songsUtils'
import { BeatLoader } from 'react-spinners'
import { eventVotesbyUserAtom, eventsAtom } from '@/atoms/eventsAtom'
import EventItem from '../events/components/EventItem'
import { useSupabase } from '@/hooks/useSupabase'

type Props = {
  playlistFilter?: PlaylistEnum
}

const EventsCenter = ({}: Props) => {
  const { user } = useUser()
  const [location] = useRecoilState(locationAtom)
  const [events, setEvents] = useRecoilState<any>(eventsAtom)
  const [userVotes, setUserVotes] = useRecoilState(eventVotesbyUserAtom)
  const supabaseClient = useSupabase()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    !isLoading && setIsLoading(true)
    if (!events[location] || !events[location].length) {
      supabaseClient
        .getVotedEvents(location)
        .then((data: any) => {
          console.log(data, 'events fetched')
          setEvents({ ...events, [location]: data })
        })
        .catch((e: any) => {
          console.log('Error fetching events', e)
          toast.error('Failed to fetch events', { id: 'failed-fetch-events' })
          setIsLoading(false)
        })
    }
    if (Object.keys(userVotes).length < 1) {
      if (user) {
        supabaseClient
          .getVotedEventsByUser(user?.id)
          .then((data: any) => {
            const votes_list = data.map((v: any) => v.event_id)
            setUserVotes(votes_list)
          })
          .catch((e: any) => {
            console.error('Error fetching votes', e)
            toast.error('Failed to fetch votes', { id: 'failed-fetch-votes' })
            setIsLoading(false)
          })
      }
    }
    setIsLoading(false)
  }, [user, location]) //eslint-disable-line

  const handleVote = async (eventId: string) => {
    if (!user) {
      toast.error('You must login to vote', {
        id: 'failed-upvote-song-supabase',
      })
      return
    }

    const voteIndex = userVotes.find((v: any) => v === eventId)
    if (voteIndex) {
      supabaseClient
        .deleteVoteEvent(eventId, user.id)
        .then((data: any) => {
          const newVotes = userVotes.filter((v: any) => v !== eventId)
          const newEvents = updateEventsVotes(events, location, eventId, -1)
          setEvents(newEvents)
          setUserVotes(newVotes)
        })
        .catch((e: any) => {
          console.error('Failed to delete vote for event', e)
        })
    } else {
      supabaseClient
        .voteEvent(eventId, user.id)
        .then((data: any) => {
          const newVotes = [...userVotes, eventId]
          const newEvents = updateEventsVotes(events, location, eventId, 1)
          setEvents(newEvents)
          setUserVotes(newVotes)
        })
        .catch((e: any) => {
          console.error('Failed to vote for event', e)
        })
    }
  }

  return (
    <div className='h-full mb-20'>
      <section>
        {isLoading ? (
          <div className='w-full flex items-center justify-center flex-col h-screen'>
            <div className='loader-container'>
              <BeatLoader color='#FFFFFF' size={20} />
            </div>
            <h1 className='text-lg mt-4'>Getting you the latest 🔥 events</h1>
          </div>
        ) : events[location]?.length ? (
          <div>
            {events[location]?.map((event: EventByVotesType, index: number) => (
              <EventItem
                key={index}
                event={event}
                onVote={handleVote}
                userVote={userVotes?.includes(event.id)}
              />
            ))}
          </div>
        ) : (
          <div className='text-xl text-center text-gray-300 flex items-center justify-center mb-10 h-screen'>
            <h1>{`No events found? Something must be wrong`}</h1>
          </div>
        )}
      </section>
    </div>
  )
}

export default EventsCenter

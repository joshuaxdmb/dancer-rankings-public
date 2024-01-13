'use client'
import { LocationIdsEnum, LocationLabels, PlaylistEnum, ThemeEnum } from '@/../../content'
import { useRecoilState } from 'recoil'
import { locationAtom } from '@/atoms/locationAtom'
import { eventVotesbyUserAtom, eventsAtom } from '@/atoms/eventsAtom'
import { useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/useSupabase'
import toast from '@/lib/toast'
import { useUser } from '@/hooks/useUser'
import { EventByVotesType, EventType } from '@/types/types'
import { Capacitor } from '@capacitor/core'
import { App, URLOpenListenerEvent } from '@capacitor/app'
import { useRouter } from 'next/navigation'
import { themes } from '@/../../content'

export default function Home() {
  const isNative = Capacitor.isNativePlatform()
  const [events, setEvents] = useRecoilState<any>(eventsAtom)
  const [eventById, setEventById] = useState<EventType | undefined>()
  const [eventByVotes, setEventByVotes] = useState<EventByVotesType | undefined>()
  const [location] = useRecoilState<LocationIdsEnum>(locationAtom)
  const [isLoading, setIsLoading] = useState(true)
  const supabaseClient = useSupabase()
  const [userVotes, setUserVotes] = useRecoilState(eventVotesbyUserAtom)
  const { user } = useUser()
  const router = useRouter()

  const handleUrl = async (url: URL) => {
    const eventId = url.searchParams.get('id')
    if (eventId) {
      const thisEvent = await supabaseClient.getEventById(eventId)
      setEventById(thisEvent)
    } else {
      toast.error('Event not found', { id: 'event-not-found' })
      router.push('/events')
    }
  }

  useEffect(() => {
    if (!isNative) return
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const url = new URL(event.url)
      console.log('Got url', url)
      handleUrl(url)
    })

    return () => {
      App.removeAllListeners()
    }
  }, [])

  useEffect(() => {
    if (isNative) return
    const url = window.location.href
    console.log('Got URL', url)
    handleUrl(new URL(url))
  }, [])

  const getVotedEvents = async () => {
    const votedEvents = await supabaseClient.getVotedEvents(location)
    setEvents({ ...events, [location]: votedEvents })
    const thisEvent = votedEvents.filter((e: any) => e.id === eventById?.id)
    setEventByVotes(thisEvent[0])
  }

  const getUserVotes = async () => {
    const userVotes = await supabaseClient.getVotedEventsByUser(user?.id)
    const votes_list = userVotes.map((v: any) => v.event_id)
    setUserVotes(votes_list)
  }

  useEffect(() => {
    try {
      !isLoading && setIsLoading(true)
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

  return (
    <div
      className={`
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
        ${themes[eventById?.theme as ThemeEnum]?.pageBackground || themes['default'].pageBackground}
      `}>
        Event by Id
        {JSON.stringify(eventById)}
        Event by Votes
        {JSON.stringify(eventByVotes)}
      </div>
  )
}

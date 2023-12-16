'use client'
import React, { useEffect } from 'react'
import { App, URLOpenListenerEvent } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { getUrl } from '@/lib/helpers'
import toast from '@/lib/toast'
import { spotifySessionAtom } from '@/atoms/spotifyAtom'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { partyPlaylistAtom } from '@/atoms/partyPlaylistAtom'
import { useRecoilState } from 'recoil'
import { useSupabase } from '@/hooks/useSupabase'

const AppUrlListener: React.FC<any> = () => {
  const isNative = Capacitor.isNativePlatform()
  const [spotifySession, setSpotifySession] = usePersistentRecoilState(spotifySessionAtom)
  const [partyPlaylistId, setPartyPlaylistId] = useRecoilState(partyPlaylistAtom)
  const supabase = useSupabase()

  const handleJoinParty = async (partyId?: string) => {
    const partyIdToJoin = partyId
    const partyExists = await supabase.checkPartyExists(partyIdToJoin)
    if (!partyExists) {
      toast.error('No parties found. You can create one!', {
        id: 'party-does-not-exist',
        icon: '⚠️',
      })
    } else {
      console.log('Setting party id:', partyIdToJoin)
      setPartyPlaylistId(partyIdToJoin)
    }
  }

  const fetchSpotifySession = async (authCode: any) => {
    toast.success('Almost done...', { id: 'spotify-login' })
    if (spotifySession?.token && spotifySession?.token?.expires_at > Date.now()) {
      console.log('Session token still valid')
      return
    }
    try {
      console.log('Testing API', getUrl() + 'api/hello2/route3')
      const res1 = await fetch(getUrl() + 'api/hello2/route3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      console.log('here')
      console.log('Test result:', res1)
      console.log('Fetching spotify session', getUrl() + 'api/spotify/session')
      const res = await fetch(getUrl() + 'api/spotify/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authCode, isNative }),
      })
      console.log('Got some spotify session response', res)
      const session = await res.json()
      console.log('Spotify session response', session)
      if (session.error) throw new Error(session.error)
      setSpotifySession(session)
      window.history.pushState({}, '', '/')
    } catch (e) {
      console.log('Failed to get spotify session', e)
    }
  }

  const handleSupabaseCallbackNative = async (code: string) => {
    try {
      await supabase.exchangeCodeForSession(code)
    } catch (e) {
      console.log('Error exchanging code for session', e)
    }
  }

  const handleUrl = (url:URL) =>{
    const authCode = url.searchParams.get('code')
    const provider = url.searchParams.get('provider')
    const partyId = url.searchParams.get('id')
    handleSupabaseCallbackNative(authCode)
    fetchSpotifySession(authCode)
    switch (provider) {
      case 'spotify':
        authCode && fetchSpotifySession(authCode)
        break
      default:
        authCode && handleSupabaseCallbackNative(authCode)
    }
    if (partyId) {
      //console.log('Setting party id 1000:', partyId)
      //setPartyPlaylistId(partyId)
      handleJoinParty(partyId)
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

  return null
}
export default AppUrlListener

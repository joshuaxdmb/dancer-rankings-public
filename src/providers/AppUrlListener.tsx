'use client'
import React, { use, useEffect, useState } from 'react'
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
      console.log('Testing API',getUrl() + 'api/hello2/route')
      const res1 = await fetch(getUrl() + 'api/hello2/route', {
        method: 'GET',
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

const handleSupabaseCallback = async (code:string) => {
  try{
    await supabase.exchangeCodeForSession(code)
  } catch (e){
    console.log('Error exchanging code for session', e)
  }
}

  //Handle Spotify callback on mobile
  useEffect(() => {
    if (isNative) {
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        const url = new URL(event.url)
        console.log('Got url', url)
        const authCode = url.searchParams.get('code')
        handleSupabaseCallback(authCode)
        // const url = new URL(event.url)
        // const authCode = url.searchParams.get('code')
        // const partyId = url.searchParams.get('id')
        // console.log('Got party id', partyId)
        // console.log('Got code', authCode)
        // if (authCode) {
        //   fetchSpotifySession(authCode)
        // }
        // if (partyId) {
        //   console.log('Setting party id 1000:', partyId)
        //   setPartyPlaylistId(partyId)
        //   handleJoinParty(partyId)
        // }
      })

      return () => {
        App.removeAllListeners()
     }
    } else {
      const handleAuthCode = async () => {
        const url = window.location.href
        console.log('URL', url)
        const newUrl = new URL(url)
        const hasCode = url.includes('?code=')
        if (hasCode) {
          const authCode = newUrl.searchParams.get('code')
          console.log('Got spotify code', authCode)
          if (authCode) {
            fetchSpotifySession(authCode)
          }
        }

        const partyId = newUrl.searchParams.get('id')
        console.log('partyid', partyId)
        if (partyId) {
          console.log('Setting party id 1000:', partyId)
          setPartyPlaylistId(partyId)
          handleJoinParty(partyId)
        }
      }
      if (!isNative) {
        //handleAuthCode()
      }
    }
  }, [])

  return null
}

export default AppUrlListener

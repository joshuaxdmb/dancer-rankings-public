"use client"
import React, { useEffect } from 'react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { getUrl } from '@/lib/helpers'
import toast from '@/lib/toast'
import { spotifySessionAtom } from '@/atoms/spotifyAtom'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'

const AppUrlListener: React.FC<any> = () => {
    const isNative = Capacitor.isNativePlatform()
    const [spotifySession, setSpotifySession] = usePersistentRecoilState(spotifySessionAtom)

    const fetchSpotifySession = async (authCode: any) => {
        toast.success('Almost done...', { id: 'spotify-login' })
        if (spotifySession?.token && spotifySession?.token?.expires_at > Date.now()) {
          return
        }
        try {
          const res = await fetch(getUrl() + 'api/spotify/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: authCode, isNative }),
          })
          const session = await res.json()
          console.log('Spotify session response', session)
          if (session.error) throw new Error(session.error)
          setSpotifySession(session)
          window.history.pushState({}, '', '/')
        } catch (e) {
          console.log('Failed to get spotify session', e)
        }
      }

    //Handle Spotify callback on mobile
  useEffect(() => {
    if (isNative) {
      App.addListener('appUrlOpen', (event : URLOpenListenerEvent) => {
        const url = new URL(event.url)
          const authCode = url.searchParams.get('code')
          if (authCode) {
            fetchSpotifySession(authCode)
        }
      })

      return () => {
        App.removeAllListeners()
      }
    } else {
      const handleAuthCode = async () => {
        const url = window.location.href
        const hasCode = url.includes('?code=')
        if (hasCode) {
          const newUrl = new URL(url)
          const authCode = newUrl.searchParams.get('code')
          console.log('Got spotify code', authCode)
          if (authCode) {
            fetchSpotifySession(authCode)
          }
        }
      }
      if (!isNative) {
        handleAuthCode()
      }
    }
  },[])
  
    return null;
  };
  
  export default AppUrlListener;
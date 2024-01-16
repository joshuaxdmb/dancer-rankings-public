'use client'
import React, { useEffect } from 'react'
import { App, URLOpenListenerEvent } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { useSupabase } from '@/hooks/useSupabase'
import { useSpotify } from '@/hooks/useSpotify'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { signInMethodAtom } from '@/atoms/signInMethodAtom'
import { SignInMethodsEnum } from '../../content'

const AppUrlListener: React.FC<any> = () => {
  const isNative = Capacitor.isNativePlatform()
  const supabase = useSupabase()
  const { fetchSpotifySession, linkSpotify } = useSpotify()
  const [signInMethod, setSignInMethod, getPersistentSignInMethod, setPersistentSignInMethod] = usePersistentRecoilState(signInMethodAtom)

  const handleSupabaseCallbackNative = async (code: string) => {
    try {
      await supabase.exchangeCodeForSession(code)
    } catch (e) {
      console.log('Error exchanging code for session', e)
    }
  }

  const clearAuthCodeFromUrl = () => {
    try{
      const url = new URL(window.location.href);
      url.searchParams.delete('code'); // Remove the authCode parameter
      window.history.replaceState({}, document.title, url.toString());
    } catch {
      // Supress
    }
  }
  

  const handleUrl = async (url: URL) => {
    const authCode = url.searchParams.get('code')
    const signInMethod = await getPersistentSignInMethod()
    if (authCode) {
      switch (signInMethod) {
        case SignInMethodsEnum.spotifySession:
          console.log('Handling sign-in: spotify-session')
          fetchSpotifySession(authCode)
          break
        case SignInMethodsEnum.google:
          console.log('Handling sign-in: google')
          handleSupabaseCallbackNative(authCode)
          break
        case SignInMethodsEnum.spotify:
          console.log('Handling sign-in: spotify')
          await handleSupabaseCallbackNative(authCode)
          await setPersistentSignInMethod(SignInMethodsEnum.spotifySession)
          linkSpotify()
          break
        default:
          console.log('Handling sign-in: default')
          handleSupabaseCallbackNative(authCode)
      }
      clearAuthCodeFromUrl()
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

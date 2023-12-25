import React, { createContext, useContext, useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import toast from '@/lib/toast'
import { useRecoilState } from 'recoil'
import { isPlayingAtom } from '@/atoms/playingSongAtom'
import { spotifySessionAtom } from '@/atoms/spotifyAtom'
import { usePersistentRecoilState } from './usePersistentState'
import { SpotifySession } from '@/types/types'
import { getUrl } from '@/lib/helpers'
import { Capacitor } from '@capacitor/core'
import { SPOTIFY_LOGIN_URL_CAPACITOR, SPOTIFY_LOGIN_URL_WEB } from '@/lib/spotify'
import SpotifyApi from '@/classes/SpotifyApi'

type SpotifyContextType = {
  togglePlay?: () => void
  spotifyApi: SpotifyApi
  spotifyDeviceId: string
  userDetails?: SpotifyApi.CurrentUsersProfileResponse
  fetchSpotifySession?: (authCode: any) => void
  refreshSpotifySession?: (session?: SpotifySession) => void
  getSpotifyCode?: () => void
  unlinkSpotify?: () => void
  resetSpotifyPlayer?: () => void
}

const SpotifyContext = createContext<SpotifyContextType | null>(null)

interface Props {
  [propName: string]: any
}

export const SpotifyProviderContext = (props: Props) => {
  const [spotifySession, setSpotifySession] = usePersistentRecoilState(spotifySessionAtom)
  const [player, setPlayer] = useState<any | null>(null)
  const isNative = Capacitor.isNativePlatform()
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom)
  const [isPlayerActive, setIsPlayerActive] = useState(false)
  const [spotifyDeviceId, setSpotifyDeviceId] = useState<string>('')
  const [spotifyApi] = useState<SpotifyApi>(
    new SpotifyApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    })
  )
  const [userDetails, setUserDetails] = useState<
    SpotifyApi.CurrentUsersProfileResponse | undefined
  >(undefined)

  const initializeSpotifyPlayer = (sessionToken: any) => {
    const existingScript = document.querySelector(
      'script[src="https://sdk.scdn.co/spotify-player.js"]'
    )
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = sessionToken || spotifySession?.token.access_token
      if (!token) {
        console.log('No token found for Spotify Player')
        return
      }

      const spotifyPlayer = new Spotify.Player({
        enableMediaSession: true, // NEW
        name: 'Dancer Rankings App',
        getOAuthToken: (cb) => {
          cb(token)
        },
        volume: 0.7,
      })

      spotifyPlayer.setName('Dancer Rankings App')

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Device is ready to play on ', device_id)
        setSpotifyDeviceId(device_id)
      })

      spotifyPlayer.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('Spotify Player:', message)
      })

      spotifyPlayer.addListener('player_state_changed', (state) => {
        if (!state) {
          console.log('No state found')
          return
        }

        //if(state.track_window?.current_track?.id) setCurrentTrack(state.track_window.current_track.id as string);
        setIsPlaying(!state.paused)
        spotifyPlayer.getCurrentState().then((state) => {
          !state ? setIsPlayerActive(false) : setIsPlayerActive(true)
        })
      })

      spotifyPlayer.addListener('authentication_error', ({ message }: { message: string }) => {
        console.error('Spotify Player:', message)
      })

      spotifyPlayer.addListener('account_error', ({ message }: { message: string }) => {
        console.error('Spotify Player:', message)
      })

      spotifyPlayer.on('playback_error', ({ message }: { message: string }) => {
        console.error('Spotify Player', message)
      })

      spotifyPlayer
        .connect()
        .then((success) => {
          if (success) {
            console.log('Connected to Spotify Player!')
          }
        })
        .catch((e) => {
          console.log('Error connecting to Spotify Player', e)
        })

      setPlayer(spotifyPlayer)
    }
  }

  const initializeApi = async (access_token: any) => {
    try {
      spotifyApi.setAccessToken(access_token)
      const userDetails = await spotifyApi.getMe()
      setUserDetails(userDetails.body)
      if (!userDetails?.body?.id) {
        toast.error('Failed to Link Spotify', { id: 'spotify-login' })
        throw new Error()
      }
      toast.success('Linked Spotify', { id: 'spotify-login' })
    } catch (e) {
      console.error('Failed to fetch Spotify user details', e)
    }
  }

  const getSpotifyCode = async () => {
    if (isNative) {
      window.location.href = SPOTIFY_LOGIN_URL_CAPACITOR
    } else {
      window.location.href = SPOTIFY_LOGIN_URL_WEB
    }
  }

  const unlinkSpotify = async () => {
    setUserDetails(undefined)
    setSpotifySession(undefined)
  }

  const fetchSpotifySession = async (authCode: any) => {
    toast.success('Almost done...', { id: 'spotify-login' })
    if (spotifySession?.token && spotifySession?.token?.expires_at > Date.now()) {
      console.log('Session token still valid')
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

  const refreshSpotifySession = async (session?: SpotifySession) => {
    session = session || spotifySession
    try {
      const res = await fetch(getUrl() + 'api/spotify/refresh-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: session.token }),
      })
      const sessionResponse = await res.json()
      if (sessionResponse.error) throw new Error(sessionResponse.error)
      const newSession = {
        ...session,
        token: {
          ...session.token,
          ...sessionResponse.token,
        },
      }
      setSpotifySession(newSession)
      console.log('Refreshed spotify token. New session:', newSession)
    } catch (e) {
      console.error('Failed to refresh spotify session', e)
      setSpotifySession(undefined)
    }
  }

  const resetSpotifyPlayer = () => {
    try {
      console.log('Resetting Spotify Player')
      setPlayer(null)
      setSpotifyDeviceId('')
      spotifySession?.token?.access_token &&
        initializeSpotifyPlayer(spotifySession.token.access_token)
    } catch (e) {
      console.error('Failed to reset Spotify Player: ', e)
    }
  }

  useEffect(() => {
    if (!spotifySession?.token) {
      return
    } else {
      // Refresh if it expires in less than 10 minutes, or already expired + some buffer time
      const currentTime = Date.now()
      const timeBuffer = 600 * 1000 // 10 minutes
      if (spotifySession?.token?.expires_at < currentTime + timeBuffer) {
        console.log('Current session token has expired: ', spotifySession)
        console.log(
          'Token expiration: ',
          spotifySession?.token?.expires_at,
          ' Current time: ',
          currentTime
        )
        refreshSpotifySession()
      }
      if (!player) initializeSpotifyPlayer(spotifySession.token.access_token)

      if (!spotifyApi.getAccessToken() || !userDetails)
        initializeApi(spotifySession.token.access_token)
    }
  }, [spotifySession?.token, player]) //eslint-disable-line

  return (
    <SpotifyContext.Provider
      value={{
        spotifyApi,
        spotifyDeviceId,
        userDetails,
        fetchSpotifySession,
        refreshSpotifySession,
        getSpotifyCode,
        unlinkSpotify,
        resetSpotifyPlayer,
      }}
      {...props}
    />
  )
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext)
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider')
  }
  return context
}

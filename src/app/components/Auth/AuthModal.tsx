'use client'
import Modal from '../layout/Modal'
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faSpotify } from '@fortawesome/free-brands-svg-icons'
import useAuthModal from '@/hooks/useAuthModal'
import { LocationIdsEnum, Locations } from '@/content'
import SupabaseWrapper from '@/classes/SupabaseWrapper'
import SytledButton from '../global/SytledButton'
import { Browser } from '@capacitor/browser'
import { SPOTIFY_LOGIN_URL_CAPACITOR, SPOTIFY_LOGIN_URL_WEB } from '@/lib/spotify'
import { spotifySessionAtom } from '@/atoms/spotifyAtom'
import { SpotifyTokenResponse } from '@/types/types'
import toast from 'react-hot-toast'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'

type Props = {}

const AuthModal = ({}: Props) => {
  const { onClose, isOpen, authOption, setAuthOption } = useAuthModal()
  const supabaseClient = new SupabaseWrapper(useSupabaseClient())
  const router = useRouter()
  const { session } = useSessionContext()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [userName, setUserName] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(Locations[0].id)
  const isNative = Capacitor.isNativePlatform()
  const [spotifySession, setSpotifySession] = usePersistentRecoilState(spotifySessionAtom)

  const getSpotifyCode = async () => {
    if (isNative) {
      await Browser.open({ url: SPOTIFY_LOGIN_URL_CAPACITOR })
    } else {
      window.location.href = SPOTIFY_LOGIN_URL_WEB
    }
  }

  const refreshSpotifyToken = async (currentToken: SpotifyTokenResponse) => {
    const res = await fetch('/api/spotify/refresh-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: currentToken }),
    })

    const session = await res.json()
    setSpotifySession(session)

    if (session.error) {
      console.log('Error refreshing token', error)
      toast.error('Error refreshing Spotify session')
    }
  }

  const handleSpotifyLogin = async () => {
    if (spotifySession?.token) {
      refreshSpotifyToken(spotifySession.token)
    } else if (!spotifySession?.token) {
      getSpotifyCode()
    }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabaseClient.signInWithProvider('google')
    console.log('data', data, 'error', error)
    if (spotifySession?.token) {
      refreshSpotifyToken(spotifySession.token)
    }
  }

  const signIngWithSpotify = async () => {
    const { data, error } = await supabaseClient.signInWithProvider('spotify')
    console.log('data', data, 'error', error)
    handleSpotifyLogin()
  }

  const onChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  useEffect(() => {
    if (session) {
      //router.refresh();
      console.log('User session found')
      onClose()
    }
  }, [session, router, onClose])

  return (
    <Modal
      title='Welcome!'
      description='We want to keep this real dancers only 💃🕺'
      isOpen={isOpen}
      onChange={onChange}>
      <div className='flex items-center justify-center'>
        <div className=' p-8 pt-2 rounded shadow-md w-96'>
          {authOption !== 'login' && (
            <form
              onSubmit={(e) => {
                e.preventDefault
              }}
              className='space-y-4 mb-8'>
              <label htmlFor='name' className='text-left block text-sm font-medium text-gray-200'>
                How should we call you?:
              </label>
              <input
                type='name'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder='Your Name'
                className='w-full p-2 border rounded'
              />

              <label htmlFor='email' className='text-left block text-sm font-medium text-gray-200'>
                Your email:
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                className='w-full p-2 border rounded'
              />
              <label
                htmlFor='location'
                className='text-left block text-sm font-medium text-gray-200'>
                Your community:
              </label>
              <select
                id='location'
                name='location'
                className='w-full p-2 border rounded mt-1'
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value as LocationIdsEnum)
                }}>
                {Locations.filter((l) => l.id !== LocationIdsEnum.global).map((location, index) => (
                  <option key={index} value={location.id}>
                    {location.label}
                  </option>
                ))}
              </select>
            </form>
          )}
          <div className='gap-y-2 flex flex-col mb-4'>
            <SytledButton
              onClick={signIngWithSpotify}
              className='items-center flex justify-center bg-green-500'>
              {authOption === 'login' ? 'Login' : 'Signup'} with Spotify{' '}
              <FontAwesomeIcon icon={faSpotify} className='ml-2 h-6 w-6' />
            </SytledButton>
            <SytledButton
              onClick={signInWithGoogle}
              className='items-center flex justify-center bg-white'>
              {authOption === 'login' ? 'Login' : 'Signup'} with Google
              <FontAwesomeIcon icon={faGoogle} className='ml-2 h-6 w-6' />
            </SytledButton>
          </div>
          {authOption === 'login' ? (
            <div className='pt-2 text-neutral-400 hover:cursor-pointer hover:text-white'>
              <a
                onClick={() => {
                  setAuthOption('signup')
                }}>
                Not with us yet? Create an account.
              </a>
            </div>
          ) : (
            <div className='pt-2 text-neutral-400 hover:cursor-pointer hover:text-white'>
              <a
                onClick={() => {
                  setAuthOption('login')
                }}>
                Already have an account? Login
              </a>
            </div>
          )}
          {error && <p className='text-red-500 mt-4'>{error}</p>}
        </div>
      </div>
    </Modal>
  )
}

export default AuthModal

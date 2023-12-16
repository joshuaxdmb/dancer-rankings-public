'use client'
import Modal from '../layout/Modal'
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faSpotify } from '@fortawesome/free-brands-svg-icons'
import useAuthModal from '@/hooks/useAuthModal'
import SupabaseWrapper from '@/classes/SupabaseWrapper'
import SytledButton from '../global/SytledButton'
import { Browser } from '@capacitor/browser'
import { SPOTIFY_LOGIN_URL_CAPACITOR, SPOTIFY_LOGIN_URL_WEB } from '@/lib/spotify'
import { spotifySessionAtom } from '@/atoms/spotifyAtom'
import { SpotifyTokenResponse } from '@/types/types'
import toast from '@/lib/toast';
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { getUrl } from '@/lib/helpers'

type Props = {}

const AuthModal = ({}: Props) => {
  const { onClose, isOpen, authOption, setAuthOption } = useAuthModal()
  const supabaseClient = new SupabaseWrapper(useSupabaseClient())
  const router = useRouter()
  const { session } = useSessionContext()
  const [error, setError] = useState('')
  const isNative = Capacitor.isNativePlatform()
  const [spotifySession, setSpotifySession] = usePersistentRecoilState(spotifySessionAtom)

  const getSpotifyCode = async () => {
    if (isNative) {
      window.location.href = SPOTIFY_LOGIN_URL_CAPACITOR
    } else {
      window.location.href = SPOTIFY_LOGIN_URL_WEB
    }
  }

  const refreshSpotifyToken = async (currentToken: SpotifyTokenResponse) => {
    const res = await fetch(getUrl()+'api/spotify/refresh-session', {
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
    try{
      if (spotifySession?.token) {
        refreshSpotifyToken(spotifySession.token)
      } else if (!spotifySession?.token) {
        getSpotifyCode()
      }
    } catch (e){
      console.log('Error refreshing Spotify token', e)
    }
    
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabaseClient.signInWithProvider('google', authOption !== 'login')
    console.log('data from Signin:', data, 'error from Signin:', error)
    if (spotifySession?.token) {
      refreshSpotifyToken(spotifySession.token)
    }
  }

  const signIngWithSpotify = async () => {
    const { data, error } = await supabaseClient.signInWithProvider('spotify', authOption !== 'login')
    console.log('data from Signin:', data, 'error from Signin:', error)
    //handleSpotifyLogin()
   
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
      description='We want to keep this real dancers only... 💃🕺'
      isOpen={isOpen}
      onChange={onChange}>
      <div className='flex items-center justify-center'>
        <div className=' pb-4 px-4 sm:px-8 pt-2 rounded w-96'>
          <div className='gap-y-2 flex flex-col mb-4'>
            <SytledButton
              showLoading={false}
              onClick={signIngWithSpotify}
              className='items-center flex justify-center bg-green-500'>
              {authOption === 'login' ? 'Login' : 'Signup'} with Spotify{' '}
              <FontAwesomeIcon icon={faSpotify} className='ml-2 h-6 w-6' />
            </SytledButton>
            <SytledButton
              showLoading={false}
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

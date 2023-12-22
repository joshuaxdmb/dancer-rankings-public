import React from 'react'
import useAuthModal from '@/hooks/useAuthModal'

import StyledButton from '../global/SytledButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { SpotifyProfile } from 'next-auth/providers/spotify'
import { useSpotify } from '@/hooks/useSpotify'

type Props = {
  isLoading: boolean
  user: any
  spotifySession: SpotifyProfile
}

const LoginButtons = ({ isLoading, user, spotifySession }: Props) => {
  
  const {getSpotifyCode} = useSpotify()

  const authModal = useAuthModal()

  if (isLoading) {
    return null
  } else if (!user) {
    return (
      <div className='flex flex-row items-center'>
        <div>
          <StyledButton
            onClick={() => {
              authModal.setAuthOption('login')
              authModal.onOpen()
            }}
            className='bg-white px-6 py-2 min-w-[100px]'>
            Log In
          </StyledButton>
        </div>
      </div>
    )
  } else if (!spotifySession) {
    return (
      <div className='flex flex-row items-center'>
        <div className='flex gap-1 items-center'>
          <StyledButton 
            onClick={getSpotifyCode}
            className=' px-6 py-2 flex items-center justify-center bg-spotify-green'>
            Link Spotify <FontAwesomeIcon icon={faSpotify} className='ml-2 h-6 w-6' />
          </StyledButton>
        </div>
      </div>
    )
  }
}

export default LoginButtons

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { SpotifyProfile } from 'next-auth/providers/spotify'
import { useSpotify } from '@/hooks/useSpotify'

type Props = {
}

const LoginButtons = ({}: Props) => {
    const {getSpotifyCode} = useSpotify()
    return (
      <div className='flex flex-row items-center'>
        <div className='flex gap-1 items-center'>
          <div 
            onClick={getSpotifyCode}
            className=' px-6 py-2 flex items-center justify-center bg-spotify-green'>
            Link Spotify <FontAwesomeIcon icon={faSpotify} className='ml-2 h-6 w-6' />
          </div>
        </div>
      </div>
    )
  }

export default LoginButtons
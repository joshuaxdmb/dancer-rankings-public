import React from 'react'
import StyledButton from '../../components/global/SytledButton'
import { useSpotify } from '@/hooks/useSpotify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

type Props = {

}

const LinkSpotifyButton = (props: Props) => {
const {getSpotifyCode} = useSpotify()
  return (
    <StyledButton 
    onClick={getSpotifyCode}
    className=' px-6 py-2 flex items-center justify-center bg-spotify-green'>
    Link Spotify <FontAwesomeIcon icon={faSpotify} className='ml-2 h-6 w-6' />
    </StyledButton>
  )
}

export default LinkSpotifyButton
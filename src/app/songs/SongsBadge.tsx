import React from 'react'
import StyledButton from '../components/global/SytledButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

const openSpotify = () => {
    window.open('https://open.spotify.com/')
}

type Props = {
}

const SongsBadge = ({ }: Props) => {
  return (
    <StyledButton
      onClick={openSpotify}
      className='px-6 py-2 flex items-center justify-center bg-spotify-green'>
      <FontAwesomeIcon icon={faSpotify} className='h-6 w-6' /> PLAY ON SPOTIFY 
    </StyledButton>
  )
}

export default SongsBadge

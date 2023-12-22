import React from 'react'
import StyledButton from '../components/global/SytledButton'
import { useRecoilState } from 'recoil'
import { currentTrackAtom } from '@/atoms/playingSongAtom'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { spotifySessionAtom } from '@/atoms/spotifyAtom'
import { useSpotify } from '@/hooks/useSpotify'
import LinkSpotifyButton from '../components/spotify/LinkSpotifyButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

type Props = {}

const SongsBadge = ({}: Props) => {
  const [currentTrack] = useRecoilState(currentTrackAtom)
  const [spotifySession] = usePersistentRecoilState(spotifySessionAtom)
  const {getSpotifyCode} = useSpotify()

  const openSpotify = () => {
    window.open(`https://open.spotify.com/track/${currentTrack.spotify_id}`)
  }
  if (!spotifySession) {
    <LinkSpotifyButton/>
  }
  return (
    <StyledButton
      onClick={openSpotify}
      className='px-6 py-2 flex items-center justify-center bg-spotify-green'>
      <FontAwesomeIcon icon={faSpotify} className='h-6 w-6' /> PLAY ON SPOTIFY
    </StyledButton>
  )
}

export default SongsBadge

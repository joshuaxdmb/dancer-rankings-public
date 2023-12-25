import React from 'react'
import StyledButton from '../components/global/SytledButton'
import { useRecoilState } from 'recoil'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { spotifySessionAtom } from '@/atoms/spotifyAtom'
import { useSpotify } from '@/hooks/useSpotify'
import LinkSpotifyButton from '../components/spotify/LinkSpotifyButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { LocationIdsEnum, PlaylistEnum } from '../../../content'
import { playlistAtom } from '@/atoms/playlistAtom'
import { locationAtom } from '@/atoms/locationAtom'
import { songsAtom } from '@/atoms/songsAtom'
import { SongLocal } from '@/types/types'
import toast from 'react-hot-toast'

type Props = {}

const SongsBadge = ({}: Props) => {
  const [spotifySession, setSpotifySession] = usePersistentRecoilState(spotifySessionAtom)
  const [playlistId] = useRecoilState<PlaylistEnum>(playlistAtom)
  const [location] = useRecoilState<LocationIdsEnum>(locationAtom)
  const [songs] = useRecoilState<any>(songsAtom);

  const { spotifyApi } = useSpotify()

  function capitalizeFirstLetter(str:String) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


  const openSpotify = async () => {
    const customPlaylistName = `${capitalizeFirstLetter(playlistId)} - ${capitalizeFirstLetter(location)}`
    const playlistSongs = songs[location]?.[playlistId]
    const {res, spotifyPlaylist} = await spotifyApi.updateSpotifyPlaylist(playlistId, playlistSongs, customPlaylistName)
    if(!res?.statusCode || res.statusCode >= 400) {
      console.error('Failed to add new tracks to playlist',res.body)
      toast.error('Failed to add new tracks to playlist', {id: 'failed-add-tracks'})
    } else {
      window.open(`https://open.spotify.com/playlist/${spotifyPlaylist.id}`)  
    }
    console.log('here')
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

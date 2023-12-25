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
  const [spotifySession] = usePersistentRecoilState(spotifySessionAtom)
  const [playlistId] = useRecoilState<PlaylistEnum>(playlistAtom)
  const [location] = useRecoilState<LocationIdsEnum>(locationAtom)
  const [songs] = useRecoilState<any>(songsAtom);

  const { spotifyApi } = useSpotify()

  const openSpotify = async () => {
    let existingPlaylist = await spotifyApi.findSpotifyPlaylist(playlistId)
    let spotifyPlaylist = existingPlaylist ? existingPlaylist : await spotifyApi.findSpotifyPlaylist(playlistId)
    const playlistSongs = songs[location]?.[playlistId]
    const uris = playlistSongs.map((song: SongLocal) => 'spotify:track:' + song.spotify_id)
    const res = await spotifyApi.replaceTracksInPlaylist(spotifyPlaylist.id, uris)
    if(!res?.statusCode || res.statusCode !== 200) {
      console.error('Failed to add new tracks to playlist')
      toast.error('Failed to add new tracks to playlist', {id: 'failed-add-tracks'})
    } else {
      window.open(`https://open.spotify.com/playlist/${spotifyPlaylist.id}`)  
    }
    
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

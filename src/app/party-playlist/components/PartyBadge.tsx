import React, { useEffect, useState } from 'react'
import { BiSolidParty } from 'react-icons/bi'
import usePartyOptionsModal from '@/hooks/usePartyOptionsModal'
import { useSpotify } from '@/hooks/useSpotify'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { spotifySessionAtom } from '@/atoms/spotifyAtom'
import LinkSpotifyButton from '@/app/components/spotify/LinkSpotifyButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import StyledButton from '../../components/global/SytledButton'
import { useRecoilState } from 'recoil'
import { songsAtom } from '@/atoms/songsAtom'
import { SongLocal } from '@/types/types'
import { LocationIdsEnum } from '../../../../content'

type Props = {
  partyId: string
}

const PartyBadge = ({ partyId }: Props) => {
  const { onOpen } = usePartyOptionsModal()
  const [spotifySession] = usePersistentRecoilState(spotifySessionAtom)
  const { spotifyApi } = useSpotify()
  const [songs, setSongs] = useRecoilState<any>(songsAtom)
  const [spotifyText, setSpotifyText] = useState('PLAY ON SPOTIFY')
  const [partyOptionsText, setPartyOptionsText] = useState('')

  useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      if (window.innerWidth <= 370) {
        // If window width is greater than or equal to 768px and sidebar is hidden, show the sidebar
        setPartyOptionsText('')
        setSpotifyText('')
      }
      else if (window.innerWidth <= 500) {
        // If window width is greater than or equal to 768px and sidebar is hidden, show the sidebar
        setPartyOptionsText('')
        setSpotifyText('PLAY ON SPOTIFY')
      }
      else {
        // If window width is greater than or equal to 768px and sidebar is hidden, show the sidebar
        setPartyOptionsText('Party Options')
        setSpotifyText('PLAY ON SPOTIFY')
      }
    }

    // Attach the resize event listener
    window.addEventListener('resize', handleResize)
    handleResize()

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const findPlaylist = async () => {
    const res = await spotifyApi.getUserPlaylists()
    const playlists = res.body
    const playlist = playlists.items.find((playlist) => playlist.name === `Dancers App: ${partyId}`)
    return playlist
  }

  const createPlaylist = async () => {
    const playlist = await spotifyApi.createPlaylist(`Dancers App: ${partyId}`, {
      description: 'Dancers App Playlist',
    })
    console.log('Created playlist',playlist.body)
    return playlist.body
  }

  const openSpotify = async () => {
    let existingPlaylist = await findPlaylist()
    let playlist = existingPlaylist ? existingPlaylist : await createPlaylist()
    const playlistSongs = songs[LocationIdsEnum.global]?.[partyId]
    const uris = playlistSongs.map((song: SongLocal) => 'spotify:track:' + song.spotify_id)
    const res = await spotifyApi.replaceTracksInPlaylist(playlist.id, uris)
    window.open(`https://open.spotify.com/playlist/${playlist.id}`)
  }

  const SpotifyButton = () => {
    if (!spotifySession) {
      return <LinkSpotifyButton />
    }
    return (
      <StyledButton
        onClick={openSpotify}
        style={{minWidth: spotifyText.length? 240 : 0}}
        className={`flex items-center justify-center bg-spotify-green h-[45px]`}>
        <FontAwesomeIcon icon={faSpotify} className='h-6 w-6' /> {spotifyText}
      </StyledButton>
    )
  }

  const PartyOptionsButton = () => {
    return (
      <StyledButton style={{minWidth: partyOptionsText.length? 100 : 0}} onClick={onOpen} className={`bg-white py-1 h-[45px]`}>
        <BiSolidParty color='black' size={24} /> {partyOptionsText}
      </StyledButton>
    )
  }

  return (
    <div className='flex flex-row justify-end gap-2'>
      <SpotifyButton />
      <PartyOptionsButton />
    </div>
  )
}

export default PartyBadge

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
import { LocationIdsEnum } from '../../../../content'
import toast from 'react-hot-toast'

type Props = {
  partyId: string
}

const PartyBadge = ({ partyId }: Props) => {
  const { onOpen } = usePartyOptionsModal()
  const [spotifySession] = usePersistentRecoilState(spotifySessionAtom)
  const { spotifyApi } = useSpotify()
  const [songs] = useRecoilState<any>(songsAtom)
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

  const openSpotify = async () => {
    const playlistSongs = songs[LocationIdsEnum.global]?.[partyId]
    const {res, spotifyPlaylist} = await spotifyApi.updateSpotifyPlaylist(partyId, playlistSongs)
    if(!res?.statusCode || res.statusCode !== 200) {
      console.error('Failed to add new tracks to playlist')
      toast.error('Failed to add new tracks to playlist', {id: 'failed-add-tracks'})
    } else {
      window.open(`https://open.spotify.com/playlist/${spotifyPlaylist.id}`)  
    }
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

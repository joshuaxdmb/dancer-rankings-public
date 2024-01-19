'use client'
import React, { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { isPlayingAtom, currentTrackAtom } from '@/atoms/playingSongAtom'
import { useSpotify } from '@/hooks/useSpotify'
import { NonPremiumPlayer, Player, PremiumPlayer } from '@/classes/PlayerClass'
import toast from '@/lib/toast'
import { IoPlayCircle } from 'react-icons/io5'
import PlayingSong from './PlayingSong'
import { PlaylistEnum } from '../../lib/content'
import { playlistAtom } from '@/atoms/playlistAtom'
import { songsAtom } from '@/atoms/songsAtom'
import { locationAtom } from '@/atoms/locationAtom'
import { SongLocal } from '@/types/types'
import { getMarginBottom } from './layout/StatusBarSpacing'

type Props = {
  backGroundColor?: string
}

const PlayingBar: React.FC<Props> = ({ backGroundColor }) => {
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackAtom)
  const [playlist] = useRecoilState<PlaylistEnum>(playlistAtom)
  const [location] = useRecoilState<any>(locationAtom)
  const [songs] = useRecoilState<any>(songsAtom)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom)
  const [songIndex, setSongIndex] = useState<number | null>(null)
  const { userDetails, spotifyApi, spotifyDeviceId, refreshSpotifySession } = useSpotify()
  const [player, setPlayer] = useState<Player | undefined>()
  const [marginBottom, setMarginBottom] = useState(0)

  useEffect(() => {
    const setMarginBottomHeight = async () => {
      const margin = await getMarginBottom(0)
      setMarginBottom(margin)
    }
    setMarginBottomHeight()
  }, [])

  useEffect(() => {
    setPlayer(new NonPremiumPlayer())
  }, [])

  useEffect(() => {
    //autoplay when currentTrack changes
    if (currentTrack?.spotify_id && player) {
      play()
    }
    const index = songs?.[location]?.[playlist]?.findIndex(
      (song: SongLocal) => song.spotify_id === currentTrack?.spotify_id
    )
    setSongIndex(index)

    console.log('Debug: CURRENTLY PLAYING', currentTrack?.spotify_id)
  }, [currentTrack]) // eslint-disable-line

  const play = () => {
    try {
      player?.play(currentTrack)
      if (player instanceof NonPremiumPlayer) {
        setIsPlaying(true) //non premium player doesn't automatically set this
      }
    } catch (e) {
      console.error('Error playing song: ', e)
    }
  }

  const pause = () => {
    player?.pause()
    if (player instanceof NonPremiumPlayer) {
      setIsPlaying(false) //non premium player doesn't automatically set this
    }
  }

  const handlePlayPause = async () => {
    if (!currentTrack) {
      toast.success('Select a song to play!', { id: 'no-song-selected' })
      return
    }
    try {
      if (isPlaying) {
        pause()
      } else {
        play()
      }
    } catch (err: any) {
      console.error('Error playing/pausing', err)
      if (err.statusCode === 401) {
        toast.error('Your spotify session expired', {
          id: 'failed-spotify-search',
        })
        refreshSpotifySession()
      }
    }
  }

  return (
    <div
      style={{ paddingBottom: marginBottom ? marginBottom - 10 : 0 }} //Safe area is too large
      className={`overscroll-y-contain flex flex-col sticky bottom-0 pt-6 px-4 items-center justify-center ${
        backGroundColor || 'bg-black'
      } `}>
      <div className={`flex h-20 flex-row items-center justify-center`}>
        <button className='mx-4 lg:mx-10 cursor-pointer' onClick={handlePlayPause}>
          {currentTrack ? (
            <PlayingSong isPlaying={isPlaying} song={currentTrack} />
          ) : (
            <IoPlayCircle size={50} className='text-white hover:opacity-80' />
          )}
        </button>
      </div>
    </div>
  )
}

export default PlayingBar

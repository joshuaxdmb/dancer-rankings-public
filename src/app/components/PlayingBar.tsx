'use client';
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isPlayingAtom, currentTrackAtom } from '@/atoms/playingSongAtom';
import { useSpotify } from '@/hooks/useSpotify';
import { NonPremiumPlayer, Player, PremiumPlayer } from '@/classes/PlayerClass';
import toast from '@/lib/toast';
import {IoPlaySkipBackSharp, IoPlaySkipForwardSharp, IoPlayCircle} from 'react-icons/io5';
import PlayingSong from './PlayingSong';
import { PlaylistEnum } from '../../../content';
import { playlistAtom } from '@/atoms/playlistAtom';
import { songsAtom } from '@/atoms/songsAtom';
import { locationAtom } from '@/atoms/locationAtom';
import { SongLocal } from '@/types/types';
import { useRouter } from 'next/navigation';
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { spotifySessionAtom } from '@/atoms/spotifyAtom'
import { getMarginBottom } from './layout/StatusBarSpacing';

type Props = {
  backGroundColor?: string;
};

const PlayingBar: React.FC<Props> = ({backGroundColor}) => {
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackAtom);
  const [playlist] = useRecoilState<PlaylistEnum>(playlistAtom)
  const [location] = useRecoilState<any>(locationAtom)
  const [songs] = useRecoilState<any>(songsAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const [songIndex, setSongIndex] = useState<number | null>(null);
  const { userDetails, spotifyApi, spotifyDeviceId } = useSpotify();
  const [player, setPlayer] = useState<Player | undefined>();
  const router = useRouter();
  const [spotifySession] = usePersistentRecoilState(spotifySessionAtom)
  const [marginBottom, setMarginBottom] = useState(0)

  useEffect(() => {
    const setMarginBottomHeight = async () => {
      const margin = await getMarginBottom(0)
      setMarginBottom(margin)
    }
    setMarginBottomHeight()
  }, [])

  useEffect(() => {
    if (userDetails?.product === 'premium') {
      spotifyApi.transferMyPlayback([spotifyDeviceId]).catch((e:any) => {
        console.log('Error setting device on Spotify', e);
      });
      setPlayer(new PremiumPlayer(spotifyApi, spotifyDeviceId));
    } else {
      setPlayer(new NonPremiumPlayer());
        toast.success('Login with Spotify Premium to play complete songs!', {id: 'spotify-premium'});
    }
  }, [spotifyDeviceId, spotifyApi, userDetails?.product]);

  useEffect(() => { //autoplay when currentTrack changes
    if (currentTrack?.spotify_id && player) {
      player.play(currentTrack);
    }
    const index = songs?.[location]?.[playlist]?.findIndex((song: SongLocal) => song.spotify_id === currentTrack?.spotify_id);
    setSongIndex(index);

    console.log('CURRENTLY PLAYIHG', index, songs, location,playlist, currentTrack?.spotify_id)
  }, [currentTrack]);// eslint-disable-line

  const handlePlayPause = () => {
    if(!currentTrack){
      toast.success('Please select a song to play', {id: 'no-song-selected'});
      return
    }
    if (isPlaying) {
      player?.pause();
      if(player instanceof NonPremiumPlayer){
        setIsPlaying(false) //non premium player doesn't automatically set this
      }
    } else {
      try{
        player?.play(currentTrack)
        if(player instanceof NonPremiumPlayer){
          setIsPlaying(true) //non premium player doesn't automatically set this
        }
      }
      catch(err: any) {
        console.error('ERROR', err);
        if (err.statusCode === 401) {
          toast.error('Your spotify session expired', {
            id: 'failed-spotify-search',
          });
          router.refresh();
        }
      }
    }
  };

  const handleNext = () => {
    let newIndex = songIndex
    if (songIndex === null || !currentTrack) {
      return
    } else if (songIndex >= songs[location][playlist].length - 1) {
      newIndex = 0;
    } else {
      newIndex = songIndex + 1;
    }
      const nextSong = songs?.[location]?.[playlist][newIndex];
      setCurrentTrack(nextSong);
      setSongIndex(newIndex);
  };

  const handlePrevious = () => {
    let newIndex = songIndex
    if (songIndex === null || songIndex < 0|| !currentTrack) {
      return
    } else if (songIndex === 0){
      player?.play(currentTrack, 0)
    } else {
      newIndex = songIndex - 1;
      const nextSong = songs?.[location]?.[playlist][newIndex];
      setCurrentTrack(nextSong);
      setSongIndex(newIndex);
    }
  }

  return (
    <div style={{paddingBottom:marginBottom}} className={`overscroll-y-contain flex flex-col sticky bottom-0 pt-4 px-4 pb-6 items-center justify-center ${backGroundColor || 'bg-black'} `}>
      <div className={`flex h-20 flex-row items-center justify-center`}>
      <IoPlaySkipBackSharp onClick={handlePrevious} size={32} className="text-white flex-shrink-0 cursor-pointer hover:opacity-80"/>
        <button className='mx-4 lg:mx-10 cursor-pointer' onClick={handlePlayPause}>
          {currentTrack? <PlayingSong isPlaying={isPlaying} song={currentTrack}/>
          : <IoPlayCircle size={50} className="text-white hover:opacity-80"/>}
        </button>
      <IoPlaySkipForwardSharp onClick={handleNext} size={32} className="text-white flex-shrink-0 cursor-pointer hover:opacity-80"/>
      </div>
     {(userDetails?.product !== 'premium' || !spotifySession) && <p className='h-0 text-sm text-gray-400'>You need to link Spotify Premium to play full songs</p>}
    </div>
  );
};

export default PlayingBar;

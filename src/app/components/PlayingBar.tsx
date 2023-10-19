'use client';
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isPlayingAtom, currentTrackAtom } from '@/atoms/playingSongAtom';
import { useSpotify } from '@/hooks/useSpotify';
import { NonPremiumPlayer, Player, PremiumPlayer } from '@/classes/PlayerClass';
import toast from 'react-hot-toast';
import {IoPlaySkipBackSharp, IoPlaySkipForwardSharp, IoPlayCircle} from 'react-icons/io5';
import PlayingSong from './PlayingSong';

type Props = {
  backGroundColor?: string;
};

const PlayingBar: React.FC<Props> = ({backGroundColor}) => {
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [isUserPremium, setIsUserPremium] = useState(false);
  const { userDetails, spotifyApi, spotifyDeviceId } = useSpotify();
  const [volume, setVolume] = useState(70);
  const [player, setPlayer] = useState<Player | undefined>();

  useEffect(() => {
    if (userDetails?.product === 'premium') {
      setIsUserPremium(true);
      spotifyApi.transferMyPlayback([spotifyDeviceId]).catch((e) => {
        console.log('Error setting device on Spotify', e);
      });
      setPlayer(new PremiumPlayer(spotifyApi, spotifyDeviceId));
    } else {
      setPlayer(new NonPremiumPlayer());
    }
  }, [spotifyDeviceId, spotifyApi, userDetails?.product]);

  useEffect(() => { //autoplay when currentTrack changes
    if (currentTrack?.spotify_id && player) {
      player.play(currentTrack);
    }
  }, [currentTrack]);// eslint-disable-line

  const handlePlayPause = () => {
    if(!currentTrack){
      toast.success('Please select a song to play', {id: 'no-song-selected'});
    }
    if (isPlaying) {
      player?.pause();
    } else {
      player?.play(currentTrack!); // Assuming there's always a track to play
    }
  };

  return (
    <div className={`flex h-20 w-full sticky bottom-0 pt-4 px-4 flex-row items-center justify-center ${backGroundColor || 'bg-black'} `}>
      <IoPlaySkipBackSharp size={32} className="text-white"/>
        <button className='mx-4' onClick={handlePlayPause}>
          {currentTrack? <PlayingSong isPlaying={isPlaying} song={currentTrack}/>
          : <IoPlayCircle size={50} className="text-white"/>}
        </button>
      <IoPlaySkipForwardSharp size={32} className="text-white"/>
    </div>
  );
};

export default PlayingBar;

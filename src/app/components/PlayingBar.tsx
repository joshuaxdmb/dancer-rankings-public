'use client'
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isPlayingAtom, currentTrackAtom } from '@/atoms/playingSongAtom';
import {useSpotify} from '@/hooks/useSpotify';

type Props = {}

const PlayingBar: React.FC<Props> = () => {
  const spotify = useSpotify();
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const [audio, setAudio] = useState<HTMLAudioElement>();

  // Effect to create audio instance and set event listeners
  useEffect(() => {
    const audioInstance = new Audio(currentTrack?.spotify_id);

    audioInstance.onplay = () => setIsPlaying(true);
    audioInstance.onpause = () => setIsPlaying(false);
    audioInstance.onended = () => {
      setIsPlaying(false); // or whatever logic you wish to implement when the track ends
    };

    setAudio(audioInstance);

    return () => {
      audioInstance.pause();
      setAudio(undefined);
    };
  }, [ setIsPlaying]);

  const handlePlayPause = () => {
    if (audio) {
      isPlaying ? audio.pause() : audio.play();
    }
  }

  return (
    <div className="playing-bar bg-slate-500 h-48 w-full sticky bottom-0">
        <>
          <button onClick={handlePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </>
    </div>
  )
}

export default PlayingBar;

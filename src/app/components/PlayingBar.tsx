'use client';
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isPlayingAtom, currentTrackAtom } from '@/atoms/playingSongAtom';
import { useSpotify } from '@/hooks/useSpotify';
import { SongLocal } from '@/types/types';

type Props = {};

const PlayingBar: React.FC<Props> = () => {
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [isUserPremium, setIsUserPremium] = useState(false);
  const { userDetails, spotifyApi, spotifyDeviceId } = useSpotify();

  useEffect(() => {
    spotifyApi.transferMyPlayback([spotifyDeviceId]).catch((e) => {
      console.log('Error setting device on Spotify', e);
    });

    if (userDetails?.product === 'premium') {
      setIsUserPremium(true);
    }
  }, [spotifyDeviceId, spotifyApi, userDetails?.product]);

  const playSong = async (song: SongLocal) => {
    if (isUserPremium) {
      console.log('Currently playing', song?.title);
      spotifyApi
        .transferMyPlayback([spotifyDeviceId])
        .then(() => {
          spotifyApi
            .play({ uris: [`spotify:track:${song.spotify_id}`] })
            .catch((err: any) => {
              console.log('Something failed playing from Spotify', err);
            });
        })
        .catch((e) => {
          console.log('Error setting device on Spotify', e);
        });
      return;
    }
    const audioInstance = new Audio(song?.preview_url || '');
    audioInstance.onplay = () => setIsPlaying(true);
    audioInstance.onpause = () => setIsPlaying(false);
    audioInstance.onended = () => {
      setIsPlaying(false); // or whatever logic you wish to implement when the track ends
    };

    setAudio(audioInstance);
    audioInstance.play();
    return () => {
      audioInstance.pause();
      setAudio(undefined);
    };
  };

  useEffect(() => {
    if (currentTrack?.spotify_id) playSong(currentTrack);
  }, [currentTrack]);

  const handlePlayPause = () => {
    if (isUserPremium) {
      isPlaying ? spotifyApi.pause() : spotifyApi.play();
    }
    if (audio) {
      isPlaying ? audio.pause() : audio.play();
    }
  };

  return (
    <div className="playing-bar bg-slate-500 h-48 w-full sticky bottom-0">
      <>
        <button onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </>
    </div>
  );
};

export default PlayingBar;

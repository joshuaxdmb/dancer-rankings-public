'use client';
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isPlayingAtom, currentTrackAtom } from '@/atoms/playingSongAtom';
import { useSpotify } from '@/hooks/useSpotify';
import { SongLocal } from '@/types/types';
import { NonPremiumPlayer, Player, PremiumPlayer } from '@/classes/PlayerClass';

type Props = {};

const PlayingBar: React.FC<Props> = () => {
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
      setIsPlaying(true);
    }
  }, [currentTrack]);// eslint-disable-line

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

  const handlePlayPause = () => {
    if (isPlaying) {
      player?.pause();
      setIsPlaying(false);
    } else {
      player?.play(currentTrack!); // Assuming there's always a track to play
      setIsPlaying(true);
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

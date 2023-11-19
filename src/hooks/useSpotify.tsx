import React, { createContext, useContext, useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { isPlayingAtom } from '@/atoms/playingSongAtom';
import { spotifySessionAtom } from '@/atoms/spotifyAtom';
import { usePersistentRecoilState } from './usePersistentState';

type SpotifyContextType = {
  togglePlay?: () => void;
  spotifyApi: SpotifyWebApi;
  spotifyDeviceId: string;
  userDetails?: SpotifyApi.CurrentUsersProfileResponse;
};

const SpotifyContext = createContext<SpotifyContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const SpotifyProviderContext = (props: Props) => {
  const [spotifySession, setSpotifySession] = usePersistentRecoilState(spotifySessionAtom);
  const [player, setPlayer] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [spotifyDeviceId, setSpotifyDeviceId] = useState<string>('');
  const [spotifyApi] = useState<SpotifyWebApi>(
    new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    })
  );
  const [userDetails, setUserDetails] = useState<SpotifyApi.CurrentUsersProfileResponse | undefined>(undefined);

  const initializeSpotifyPlayer = (sessionToken: any) => {
    const existingScript = document.querySelector(
      'script[src="https://sdk.scdn.co/spotify-player.js"]'
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = sessionToken || spotifySession?.token.access_token;
      const spotifyPlayer = new Spotify.Player({
        name: 'Dancer Rankings App',
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.7,
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Device is ready to play!');
        setSpotifyDeviceId(device_id);
      });

      spotifyPlayer.addListener(
        'initialization_error',
        ({ message }: { message: string }) => {
          console.error('Spotify Player:', message);
        }
      );

      spotifyPlayer.addListener('player_state_changed', (state) => {
        if (!state) {
          console.log('No state found');
          return;
        }

        //if(state.track_window?.current_track?.id) setCurrentTrack(state.track_window.current_track.id as string);
        setIsPlaying(!state.paused);
        spotifyPlayer.getCurrentState().then((state) => {
          !state ? setIsPlayerActive(false) : setIsPlayerActive(true);
        });
      });

      spotifyPlayer.addListener(
        'authentication_error',
        ({ message }: { message: string }) => {
          console.error('Spotify Player:', message);
        }
      );

      spotifyPlayer.addListener(
        'account_error',
        ({ message }: { message: string }) => {
          console.error('Spotify Player:', message);
        }
      );

      spotifyPlayer.on('playback_error', ({ message }: { message: string }) => {
        console.error('Spotify Player', message);
      });

      spotifyPlayer
        .connect()
        .then((success) => {
          if (success) {
            console.log('Connected to Spotify Player!');
          }
        })
        .catch((e) => {
          console.log('Error connecting to Spotify Player', e);
        });

      setPlayer(spotifyPlayer);
    };
  };

  const initializeApi = async (token: any) => {
    spotifyApi.setAccessToken(token);
    const userDetails = await spotifyApi.getMe();
    setUserDetails(userDetails.body);
  };

  useEffect(() => {
    if (!spotifySession?.token) return;
    if (!player) initializeSpotifyPlayer(spotifySession.token.access_token);
    initializeApi(spotifySession.token.access_token);
    toast.success('Linked Spotify', { id: 'spotify-login' });
  }, [spotifySession?.token]); //eslint-disable-line

  return (
    <SpotifyContext.Provider
      value={{ spotifyApi, spotifyDeviceId, userDetails }}
      {...props}
    />
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

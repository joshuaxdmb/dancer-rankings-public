import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { currentTrackAtom, isPlayingAtom } from '@/atoms/playingSongAtom';

type SpotifyContextType = {
  togglePlay?: () => void;
  spotifySession: any;
  spotifyApi: SpotifyWebApi;
  spotifyDeviceId: string;
  userDetails?: any;
};

const SpotifyContext = createContext<SpotifyContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const SpotifyProviderContext = (props: Props) => {
  const [spotifySession, setSpotifySession] = useState<any | null>(null);
  const [player, setPlayer] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [spotifyDeviceId, setSpotifyDeviceId] = useState<string>('');
  const [spotifyApi, setSpotifyApi] = useState<SpotifyWebApi>(new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  }));
  const [userDetails, setUserDetails] = useState<any>(null);

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
      const token = sessionToken || spotifySession.user.accessToken;
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

      spotifyPlayer.connect().then((success) => {
        if (success) {
          console.log('Connected to Spotify Player!');
        }
      }).catch((e) => {
        console.log('Error connecting to Spotify Player',e)
      });

      setPlayer(spotifyPlayer);
    };
  };

  const getSpotifySession = async () => {
    const response = await fetch('/api/auth/session');
    const session = await response.json()
    console.log('Fetched spotify session', session);
    return session;
  };

  const initializeApi = async (token:any) =>{
    spotifyApi.setAccessToken(token)
    const userDetails = await spotifyApi.getMe();
    setUserDetails(userDetails.body)
  }


  useEffect(() => {
    toast.success('Logging you in...', { id: 'spotify-login' });
    if (!spotifySession?.user) {
      getSpotifySession()
        .then((session) => {
          if (session?.message === 'You must be logged in.') return;
          if (session.error === 'RefreshAccessTokenError') {
            toast.error('Failed to log into Spotify', { id: 'spotify-error' });
            return;
          }
          setSpotifySession(session);
          if (!player) initializeSpotifyPlayer(session.user.accessToken);
          initializeApi(session.user.accessToken)
          toast.success('Logged into Spotify', { id: 'spotify-login' });
        })
        .catch((e) => {
          console.log('Failed to fetch Spotify session', e);
        });
    } else {
      console.log('Spotify session already exists', spotifySession);
      if(!spotifyApi.getAccessToken() && spotifySession?.user){
        initializeApi(spotifySession.user.accessToken)
      }
    }
  }, [spotifySession?.user]); //eslint-disable-line

  const togglePlay = useCallback(
    () => {
      if (player && player.togglePlay) {
        player.togglePlay().catch((e: any) => {
          console.log('Play error',e)})
        setIsPlaying(!isPlaying);
      }
    },
    [player] //eslint-disable-line
  );

  return (
    <SpotifyContext.Provider
      value={{spotifySession, spotifyApi, spotifyDeviceId, userDetails }}
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

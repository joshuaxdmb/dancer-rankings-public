// import { isPlayingAtom } from '@/atoms/playingSongAtom';
// import { useEffect, useState, useCallback } from 'react';
// import { useRecoilState } from 'recoil';
// import SpotifyWebApi from 'spotify-web-api-node';
// import toast from 'react-hot-toast';

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.SPOTIFY_CLIENT_ID,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
// });

// function useSpotify() {
//   const [spotifySession, setSpotifySession] = useState<any>(null);
//   const [player, setPlayer] = useState<any | null>(null);
//   const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);

//   useEffect(() => {
//     if(!spotifySession) return
//     window.onSpotifyWebPlaybackSDKReady = () => {
//       console.log('Found Spotify Player')
//       const token = spotifySession.user.accessToken;
//       const spotifyPlayer = new Spotify.Player({
//         name: 'Dancer Rankings App',
//         getOAuthToken: (cb) => {
//           cb(token);
//         },
//         volume: 0.7
//       });

//       spotifyPlayer.addListener('ready', ({ device_id }) => {
//         console.log('Ready with Device ID', device_id);
//       });

//       spotifyPlayer.addListener('player_state_changed', (state) => {
//         setIsPlaying(!state.paused);
//       });

//       spotifyPlayer.connect().then((success) => {
//         if (success) {
//           console.log('Connected to Spotify Player!');
//         }
//       });

//       setPlayer(spotifyPlayer);
//     };
//   }, [spotifySession]); //eslint-disable-line

//   const playTrack = useCallback(
//     (trackId: string) => {
//       if (player) {
//         player.play({ uris: [trackId], device_id: player._options.id });
//       }
//     },
//     [player]
//   );

//   const pauseTrack = useCallback(() => {
//     if (player && isPlaying) {
//       player.pause();
//     }
//   }, [player]); //eslint-disable-line

//   const resumeTrack = useCallback( () => {
//     if (player && !isPlaying) {
//       player.resume();
//     }
//   },[player]) //eslint-disable-line

//   const getSpotifySession = async () => {
//     const response = await fetch('/api/auth/session');
//     const session = await response.json();
//     console.log('Fetched spotify session');
//     return session;
//   };

//   useEffect(() => {
//     if (!spotifySession) {
//       getSpotifySession().then((session)=>{
//         if(session.error==='RefreshAccessTokenError'){
//           toast.error('Failed to log into Spotify',{id:'spotify-error'})
//           return
//         }
//         setSpotifySession(session);
//         toast.success('Logged into Spotify',{id:'spotify success'})
//       }).catch((e) => {
//           console.log('Failed to fetch Spotify session', e);
//         });
//     } else {
//       spotifyApi.setAccessToken(spotifySession.user.accessToken);
//     }
//   }, [spotifySession]); //eslint-disable-line

//   return {spotifyApi, player:{
//     playTrack,
//     pauseTrack,
//     resumeTrack,
//   }};
// }


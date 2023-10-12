import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

function useSpotify(){
    const [spotifySession, setSpotifySession] = useState<any>(null);

    const getSpotifySession = async() =>{
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        console.log('Fetched spotify session')
        return session;
      }

      useEffect(() => {
        if(!spotifySession){
          getSpotifySession().then((session)=>{
            setSpotifySession(session);
          }).catch((e)=>{
            console.log('Failed to fetch Spotify session',e)
          })
        } else {
            spotifyApi.setAccessToken(spotifySession.user.accessToken);
        }
      },[spotifySession])//eslint-disable-line


    return spotifyApi
}

export default useSpotify;
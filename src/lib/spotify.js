import SpotifyWebApi from "spotify-web-api-node";
import { getUrl } from "./helpers"

const scopes = [
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-email',
    'streaming',
    'user-read-private',
    'user-library-read',
    'user-library-modify',
    'user-top-read',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-follow-read',
    'user-read-private',
].join(',')

const params = {
    scope:scopes

}

const queryParamString  = new URLSearchParams(params)
const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
})

const SPOTIFY_CLIENT_ID='10b68d8b3e99461586a62425e11a71fe'
const SPOTIFY_REDIRECT_URI_CAPACITOR='https://latindancersapp.com/?provider=spotify'
const SPOTIFY_REDIRECT_URI=getUrl()

const client_params_web = new URLSearchParams({
    client_id:SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri:SPOTIFY_REDIRECT_URI,
    scope: scopes
});

const client_params_capacitor = new URLSearchParams({
    client_id:SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri:SPOTIFY_REDIRECT_URI_CAPACITOR,
    scope: scopes
});



const SPOTIFY_LOGIN_URL_WEB = `https://accounts.spotify.com/authorize?${client_params_web.toString()}`;
const SPOTIFY_LOGIN_URL_CAPACITOR = `https://accounts.spotify.com/authorize?${client_params_capacitor.toString()}`;

export default spotifyApi;
export {SPOTIFY_LOGIN_URL_WEB,SPOTIFY_LOGIN_URL_CAPACITOR, LOGIN_URL}
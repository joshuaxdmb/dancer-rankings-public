import SpotifyWebApi from "spotify-web-api-node";
import { getUrl } from "./helpers"

const scopes = [
    'user-read-email',
    'user-read-private',
    'playlist-read-private',
    'playlist-modify-private',
    'playlist-modify-public'
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
const SPOTIFY_REDIRECT_URI_CAPACITOR='https://open.latindancers.app/?provider=spotify'
const SPOTIFY_REDIRECT_URI=getUrl()+'?provider=spotify'

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

import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-email',
    'streaming',
    'user-read-private',
    'user-library-read',
    'user-top-read',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-follow-read'
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


const client_params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    scope: scopes
});


const SPOTIFY_LOGIN_URL = `https://accounts.spotify.com/authorize?${client_params.toString()}`;

export default spotifyApi;
export {SPOTIFY_LOGIN_URL, LOGIN_URL}
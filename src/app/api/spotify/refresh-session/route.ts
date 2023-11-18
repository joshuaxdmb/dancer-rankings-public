import fetch from 'node-fetch';
import SpotifyWebApi from "spotify-web-api-node";
import { SpotifyTokenResponse } from '../session/route';

const scopes = [
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
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
].join(',')

const params = {
    scope:scopes

}

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
})

async function refreshAccessToken(token:SpotifyTokenResponse) {
    try {
      spotifyApi.setAccessToken(token.access_token);
      spotifyApi.setRefreshToken(token.refresh_token);
  
      const { body: refreshToken } = await spotifyApi.refreshAccessToken();
      console.log('REFRESHED TOKEN:', refreshToken);
  
      return {
        token:{...token,
        access_token: refreshToken.access_token,
        expires_in: Date.now() + refreshToken.expires_in * 1000,
        refresh_token: refreshToken.refresh_token || token.refresh_token},
        error: null,
    };
    } catch (error) {
      console.error('Error refreshing access token', error);
      return {
        token,
        error,
      };
    }
  }

export async function POST(req: Request) {
    const { token: oldToken } = await req.json();
    const {token, error}: {token:SpotifyTokenResponse, error:any} = await refreshAccessToken(oldToken);
    // const userResponse = await fetch('https://api.spotify.com/v1/me', {
    //     headers: {
    //         'Authorization': `Bearer ${token.access_token}`,
    //     },
    // });

    // const user = await userResponse.json();

    return Response.json({
        token,
        error
    });
}


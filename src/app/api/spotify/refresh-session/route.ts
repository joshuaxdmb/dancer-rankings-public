import SpotifyWebApi from "spotify-web-api-node";
import { SpotifyTokenResponse } from '../session/route';
import {OPTIONS as _OPTIONS} from '@/lib/api'

export async function OPTIONS(req: Request, res:Response) {
    return _OPTIONS(req, res)
}

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
  scope: scopes

}

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
})

async function refreshAccessToken(token: SpotifyTokenResponse) {
  try {
    spotifyApi.setAccessToken(token.access_token);
    spotifyApi.setRefreshToken(token.refresh_token);

    const { body: refreshToken } = await spotifyApi.refreshAccessToken();
    console.log('Refreshed Spotify token');
    return {
      token: {
        ...token,
        access_token: refreshToken.access_token,
        expires_in: refreshToken.expires_in,
        expires_at: Date.now() + refreshToken.expires_in * 1000,
        refresh_token: refreshToken.refresh_token || token.refresh_token
      },
      error: null,
    };
  } catch (error) {
    console.error('Error refreshing Spotify token', error);
    return {
      token,
      error,
    };
  }
}

export async function POST(req: Request) {
  const { token: oldToken } = await req.json();
  const { token, error }: { token: SpotifyTokenResponse, error: any } = await refreshAccessToken(oldToken);
  return Response.json({
    token,
    error
  });
}


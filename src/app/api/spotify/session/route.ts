import fetch from 'node-fetch';
import {OPTIONS as _OPTIONS} from '@/lib/api'

export async function OPTIONS(req: Request, res:Response) {
    return _OPTIONS(req, res)
}

export type SpotifyTokenResponse = {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
    error?: string;
    error_description?: string;
    expires_at?: number;
};

export async function POST(req: Request) {
    try {
        const { code, isNative } = await req.json();
        if (!code) throw new Error('No code provided')

        const redirect_uri = (isNative ? process.env.SPOTIFY_REDIRECT_URI_NATIVE : process.env.SPOTIFY_REDIRECT_URI_WEB) || 'https://latindancersapp.com'

        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri
            }),
        });

        const token = await tokenResponse.json() as SpotifyTokenResponse
        token.expires_at = Date.now() + token.expires_in * 1000
        if (token.error) {
            throw new Error(token.error_description || token.error)
        }
        return Response.json({
            token,
        });
    } catch (error) {
        let e = (error as any)?.message || error
        return Response.json({
            error: e
        });
    }
}


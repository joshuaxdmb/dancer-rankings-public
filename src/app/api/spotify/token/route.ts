import fetch from 'node-fetch';

export default async function handler(req:Request) {
    const { code } = await req.json();
    console.log(`Basic ${Buffer.from(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID + ':' + process.env.NEXT_SPOTIFY_CLIENT_SECRET).toString('base64')}`)

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.NECT_PUBLIC_SPOTIFY_REDIRECT_URI || '',
        }),
    });

    const data:any = await tokenResponse.json();

    return Response.json({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
    });
}

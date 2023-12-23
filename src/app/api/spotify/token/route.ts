import fetch from 'node-fetch';

export async function POST(req: Request) {
    const { code } = await req.json();

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI || '',
        }),
    });

    const data: any = await tokenResponse.json();

    return Response.json({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
    });
}

import fetch from 'node-fetch';

export type SpotifyTokenResponse = {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
    error?: string;
    error_description?: string;
};

export async function POST(req: Request) {
    try{
        const { code, isNative } = await req.json();
        if(!code) throw new Error('No code provided')

        const redirect_uri = (isNative? process.env.SPOTIFY_REDIRECT_URI_NATIVE : process.env.SPOTIFY_REDIRECT_URI_WEB ) || 'latindancersapp.com'
    
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
        if(token.error){
            throw new Error(token.error_description || token.error)
        }
        // const userResponse = await fetch('https://api.spotify.com/v1/me', {
        //     headers: {
        //         'Authorization': `Bearer ${token.access_token}`,
        //     },
        // });
    
        // const user = await userResponse.json();
    
        return Response.json({
            token,
        });
    } catch (error) {
        let e = (error as any)?.message || error
        return Response.json({
            error:e
        });
    }
}


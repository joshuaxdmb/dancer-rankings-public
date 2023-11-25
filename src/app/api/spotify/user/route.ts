import fetch from 'node-fetch';

export default async function handler(req: Request) {
    const { accessToken } = await req.json();

    const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const data = await userResponse.json();

    Response.json(data);
}

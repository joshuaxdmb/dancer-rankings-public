import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '../../../../lib/spotify';

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshToken } = await spotifyApi.refreshAccessToken();
    console.log('REFRESHED TOKEN:', refreshToken);

    return {
      ...token,
      accessToken: refreshToken.access_token,
      accessTokenExpires: Date.now() + refreshToken.expires_in * 1000,
      refreshToken: refreshToken.refresh_token || token.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing access token', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],

  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      //Initial sign in
      if (account && user) {
        console.log('Existing token is valid')
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
          image: user.image, 
        };
      }

      //Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log('Existing token is valid');
        return token;
      }

      //refresh access token if expired
      console.log('Access token has expired, refreshing');
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      session.user.image = token.image;
      return session;
    },
  },
}

export default NextAuth(authOptions);

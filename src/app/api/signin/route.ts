// pages/api/auth/custom-signin.ts
import { signIn } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { provider, callbackUrl } = req.query;

  try {
    // Perform the sign-in
    const result = await signIn(provider as string, { redirect: false, callbackUrl: callbackUrl as string | undefined });
    if (result?.url) {
      // Return a success response with the redirect URL or token
      res.status(200).json({ url: result.url });
    } else {
      // Handle errors or unsuccessful sign-in
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
}

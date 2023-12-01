import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './[...nextauth]';
import { getToken } from 'next-auth/jwt';

export default async function session(req: NextApiRequest, res: NextApiResponse) {
  // Extract token from the Authorization header
  const token = await getToken({ req, secret: authOptions.secret });

  if (!token) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  // Assuming token contains necessary user information
  return res.json({ user: token.user });
}

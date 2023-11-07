'use client';
import Modal from '../Modal';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import useAuthModal from '@/hooks/useAuthModal';
import { toast } from 'react-hot-toast';
import { LocationIdsEnum, Locations } from '@/content';
import SupabaseWrapper from '@/hooks/useSupabase';
import { isValidEmail } from '@/utils/songsUtils';

type Props = {};

const AuthModal = ({}: Props) => {
  const { onClose, isOpen, authOption, setAuthOption } = useAuthModal();
  const supabaseClient = new SupabaseWrapper(useSupabaseClient());
  const router = useRouter();
  const { session } = useSessionContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(Locations[0].id);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const verifyEmailInSupabase = async (
    userId: any,
    email: any,
    userName: string
  ) => {
    const { data: existingUser } = await supabaseClient.getUserByEmail(email);

    if ((!existingUser || existingUser.length < 1) && isValidEmail(email)) {
      const insertData = {
        email: email,
        full_name: userName,
        location: selectedLocation,
        // other fields can be added here if needed
      };

      const { error: insertError } = await supabaseClient.updateUser(
        userId,
        insertData
      );

      if (insertError) {
        console.error('Error inserting user:', insertError);
      }
    }
  };

  useEffect(() => {
    if (session) {
      //router.refresh();
      console.log('User session found');
      onClose();
    }
  }, [session, router, onClose]);

  const handleSupabaseAuth = async () => {
    if (authOption === 'login') {
      const {
        data: { user },
        error,
      } = await supabaseClient.signIn(email, password);

      if (user) verifyEmailInSupabase(user.id, user.email, userName);

      if (error) {
        console.error(error.message);
        throw new Error('Unable to log in with those credentials');
      } else {
        console.log('User signed in:', user);
      }
    } else {
      // First, check if the user already exists in the `public.users` table
      const { data: existingUser } = await supabaseClient.getUserByEmail(email);

      if (existingUser && existingUser.length > 0) {
        setError('User already registered. Please login.');
        throw new Error('User already registered. Please login.');
      }

      // If not, then proceed with the signup
      console.log('User not found, proceeding with signup', email);
      const {
        data: { user },
        error,
      } = await supabaseClient.signUp(email, password);

      if (error) {
        setError(error.message);
        console.error('Error signing up:', error.message);
        throw new Error('Unable to log in with those credentials');
      }

      if (user) {
        console.log('User signed up:', user);
        verifyEmailInSupabase(user.id, email, userName);
      }
    }
  };

  const handleAuth = async () => {
    if (!isValidEmail(email)) {
      setError('Hmm... your email does not look right');
      return;
    }
    if (password.length < 8) {
      setError('Too easy to hack! Password must be at least 8 characters long');
      return;
    }

    try {
      await handleSupabaseAuth();
      if (!error) {
        await handleSpotifyAuth();
        toast.success('Logged in!', { id: 'auth success' });
      }
      
    } catch (e: any) {
      console.log('Error', e);
      setError(e.message);
    }
  };

  const handleSpotifyAuth = async () => {
    console.log('Logging in to Spotify')
    const spotifySession = await (await fetch('/api/auth/session')).json();
    if (spotifySession.token && session?.user?.id) {
      const insertData = {username: spotifySession.user.username}
      const { error: insertError } = await supabaseClient.updateUser(
        session.user.id,
        insertData
      );
      if(insertError) console.log('Failed to add username from Spotify',insertError)
      console.log('User already signed in on Spotify');
      return;
    }
    signIn('spotify', { callbackUrl: '/' });
  };

  return (
    <Modal
      title="Welcome!"
      description="We want to keep this real dancers only 💃🕺"
      isOpen={isOpen}
      onChange={onChange}
    >
      <div className="flex items-center justify-center">
        <div className=" p-8 pt-2 rounded shadow-md w-96">
          <form
            onSubmit={(e) => {
              e.preventDefault;
            }}
            className="space-y-4"
          >
            {authOption !== 'login' && (
              <input
                type="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="How should we call you?"
                className="w-full p-2 border rounded"
              />
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border rounded"
            />
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-200"
            >
              Select your community:
            </label>
            <select
              id="location"
              name="location"
              className="w-full p-2 border rounded mt-1"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value as LocationIdsEnum);
              }}
            >
              {Locations.map((location, index) => (
                <option key={index} value={location.id}>
                  {location.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleAuth}
              type="button"
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 items-center justify-center flex"
            >
              {authOption === 'login' ? 'Login' : 'Register'}
              <FontAwesomeIcon icon={faSpotify} className="ml-2 h-6 w-6" />
            </button>
            {authOption === 'login' ? (
              <div className="pt-2 text-neutral-400 hover:cursor-pointer hover:text-white">
                <a
                  onClick={() => {
                    setAuthOption('signup');
                  }}
                >
                  Not with us yet? Create an account.
                </a>
              </div>
            ) : (
              <div className="pt-2 text-neutral-400 hover:cursor-pointer hover:text-white">
                <a
                  onClick={() => {
                    setAuthOption('login');
                  }}
                >
                  Already have an account? Login
                </a>
              </div>
            )}
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;

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
import { faGoogle, faSpotify } from '@fortawesome/free-brands-svg-icons';
import useAuthModal from '@/hooks/useAuthModal';
import { toast } from 'react-hot-toast';
import {
  DanceLevelLabels,
  DanceRoleLabels,
  LocationIdsEnum,
  Locations,
} from '@/content';
import SupabaseWrapper from '@/classes/SupabaseWrapper';
import { isValidEmail } from '@/utils/songsUtils';
import { DanceLevelsEnum, DanceRolesEnum } from '@/types/danceClassesTypes';
import { GendersEnum, UserSignUpType } from '@/types/types';
import SytledButton from '../SytledButton';

type Props = {};

const AuthModal = ({}: Props) => {
  const { onClose, isOpen, authOption, setAuthOption } = useAuthModal();
  const supabaseClient = new SupabaseWrapper(useSupabaseClient());
  const router = useRouter();
  const { session } = useSessionContext();
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(Locations[0].id);
  const [danceRole, setDancerole] = useState(DanceRolesEnum.lead);
  const [danceLevel, setDanceLevel] = useState(DanceLevelsEnum.beginner1);
  const [gender, setGender] = useState(GendersEnum.Female);

  const signInWithGoogle = async () => {
    const { data, error } = await supabaseClient.signInWithProvider('google');
    console.log('data', data, 'error', error);
    handleSpotifyAuth()
  };

  const signIngWithSpotify = async () => {
    const { data, error } = await supabaseClient.signInWithProvider('spotify');
    console.log('data', data, 'error', error);
    handleSpotifyAuth()
  };

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  useEffect(() => {
    if (session) {
      //router.refresh();
      console.log('User session found');
      onClose();
    }
  }, [session, router, onClose]);

  // const supabaseLogin = async () => {
  //   const {
  //     data: { user },
  //     error,
  //   } = await supabaseClient.signIn(email, password);

  //   if (error) {
  //     console.error(error.message);
  //     throw new Error('Unable to log in with those credentials');
  //   } else {
  //     console.log('User signed in:', user);
  //   }

  //   return user;
  // };

  // const handleSupabaseAuth = async () => {
  //   if (authOption === 'login') {
  //     await supabaseLogin();
  //   } else {
  //     // First, check if the user already exists in the `public.users` table
  //     const { data: existingUser } = await supabaseClient.getUserByEmail(email);

  //     if (existingUser && existingUser.length > 0) {
  //       setError('User already registered. Please login.');
  //       throw new Error('User already registered. Please login.');
  //     }

  //     // If not, then proceed with the signup
  //     console.log('User not found, proceeding with signup', email);
  //     const insertUser: UserSignUpType = {
  //       email: email,
  //       full_name: userName,
  //       default_location: selectedLocation,
  //       primary_dance_role: danceRole,
  //       lead_level: danceLevel,
  //       follow_level: danceLevel,
  //       password: password,
  //       gender: gender,
  //     };

  //     console.log('Signing up user', insertUser);
  //     const { data, error } = await supabaseClient.signUp(insertUser);

  //     if (error) {
  //       setError('Unable to sign up with those credentials');
  //       console.error('Error signing up:', error.message);
  //       throw new Error('Unable to log in with those credentials');
  //     }
  //   }
  // };

  // const handleAuth = async () => {
  //   if (!isValidEmail(email)) {
  //     setError('Hmm... your email does not look right');
  //     return;
  //   }
  //   if (password.length < 8) {
  //     setError('Too easy to hack! Password must be at least 8 characters long');
  //     return;
  //   }

  //   try {
  //     await handleSupabaseAuth();
  //     if (!error) {
  //       await handleSpotifyAuth();
  //       toast.success('Logged in!', { id: 'auth success' });
  //     }
  //   } catch (e: any) {
  //     console.log('Error', e);
  //     setError(e.message);
  //   }
  // };

  const handleSpotifyAuth = async () => {
    console.log('Logging in to Spotify');
    const spotifySession = await (await fetch('/api/auth/session')).json();
    if (spotifySession.token && session?.user?.id) {
      const insertData = { username: spotifySession.user.username };
      const { error: insertError } = await supabaseClient.updateUser(
        session.user.id,
        insertData
      );
      if (insertError)
        console.log('Failed to add username from Spotify', insertError);
      console.log('User already signed in on Spotify');
      return;
    }
    console.log('User not signed in on Spotify, signing in');
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
          {authOption !== 'login' && (
            <form
              onSubmit={(e) => {
                e.preventDefault;
              }}
              className="space-y-4 mb-8"
            >
              <label
                htmlFor="name"
                className="text-left block text-sm font-medium text-gray-200"
              >
                How should we call you?:
              </label>
              <input
                type="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
                className="w-full p-2 border rounded"
              />

              <label
                htmlFor="email"
                className="text-left block text-sm font-medium text-gray-200"
              >
                Your email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
              <label
                htmlFor="location"
                className="text-left block text-sm font-medium text-gray-200"
              >
                Your community:
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
                {Locations.filter((l) => l.id !== LocationIdsEnum.global).map(
                  (location, index) => (
                    <option key={index} value={location.id}>
                      {location.label}
                    </option>
                  )
                )}
              </select>
            </form>
          )}
          <div className="gap-y-2 flex flex-col mb-4">
            <SytledButton onClick={signIngWithSpotify} className="items-center flex justify-center bg-green-500">
              {authOption === 'login'? 'Login':'Signup'} with Spotify{' '}
              <FontAwesomeIcon icon={faSpotify} className="ml-2 h-6 w-6" />
            </SytledButton>
            <SytledButton onClick={signInWithGoogle} className="items-center flex justify-center bg-white">
            {authOption === 'login'? 'Login':'Signup'} with Google
              <FontAwesomeIcon icon={faGoogle} className="ml-2 h-6 w-6" />
            </SytledButton>
          </div>
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
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;

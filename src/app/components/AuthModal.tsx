'use client';
import Modal from './Modal';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { signIn} from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import useAuthModal from '@/hooks/useAuthModal';


type Props = {
};

const AuthModal = ({}:Props) => {
  const {onClose, isOpen, authOption, setAuthOption} = useAuthModal();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const onChange = (open:boolean) => {
    if(!open){
      onClose()
    }
  }

  useEffect(() => {
    if(session){
      router.refresh();
      console.log('User session found',session)
      onClose()
    }
  },[session, router, onClose])

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get('code');

  //   if (code) {
  //     handleSpotifyCallback(code);
  //   }
  // }, []);

  // const handleSpotifyCallback = async (code: any) => {
  //   // Send this code to your Next.js API route to exchange it for tokens
  //   const response = await fetch('/api/spotify/token', {
  //     method: 'POST',
  //     body: JSON.stringify({ code }),
  //   });

  //   console.log(response,response.json())
  //   const data = await response.json();

  //   if (data.accessToken) {
  //     // Use this access token to get Spotify user details
  //     const userResponse = await fetch('/api/spotify/user', {
  //       method: 'POST',
  //       body: JSON.stringify({ accessToken: data.accessToken }),
  //     });

  //     const userData = await userResponse.json();
  //   }
  // };

  const handleSupabaseAuth = async () => {
    if (authOption === 'login') {
      const { data: existingUser } = await supabaseClient
        .from('users')
        .select('*')
        .eq('email', email);

      if (!existingUser || existingUser.length < 1) {
        setError('We couldn\'t find your email');
      }

      const {
        data: { user },
        error,
      } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error(error.message);
        throw new Error('Unable to log in with those credentials');
      } else {
        console.log('User signed in:', user);
      }

    } else {
      // First, check if the user already exists in the `public.users` table
      const { data: existingUser } = await supabaseClient
        .from('users')
        .select('*')
        .eq('email', email);

      if (existingUser && existingUser.length > 0) {
        setError('User already registered. Please login.');
        throw new Error('User already registered. Please login.')
      }

      // If not, then proceed with the signup
      console.log("User not found, proceeding with signup",email)
      const {
        data: { user },
        error,
      } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message);
        console.error('Error signing up:', error.message);
        throw new Error('Unable to log in with those credentials');
      }

      if (user) {
        console.log('User signed up:', user);
        const insertData = {
          email: user.email,
          full_name: userName,
          // other fields can be added here if needed
        };

        const { error: insertError } = await supabaseClient
          .from('users')
          .update([insertData])
          .eq('id',user.id)

        if (insertError) {
          console.error('Error inserting user:', insertError);
          throw new Error('Unable to log in with those credentials')
        }
      }
    }
  };

  const handleAuth = async() =>{
    if(!isValidEmail(email)){
      setError('Hmm... your email does not look right')
      return
    }
    if(password.length < 8){
      setError('Too easy to hack! Password must be at least 8 characters long')
      return
    }

    try{
      await handleSupabaseAuth()
      if(!error){} await handleSpotifyAuth()
    } catch(e:any){
      console.log('Error',e)
      setError(e.message)
    }
    
  }

  const handleSpotifyAuth = async() => {
    signIn('spotify', { callbackUrl: '/' }).then((res) => {
      console.log('Logged in with Spotify', res)
    }).catch((e) =>{
      console.log('Could not log in with Spotify',e)
    })
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
          <form onSubmit={(e)=>{e.preventDefault}} className="space-y-4">
            {authOption !== 'login' && ( <input
              type="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="How should we call you?"
              className="w-full p-2 border rounded"
            />)}
           
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

            {/* {Object.values(providers).map((provider: any) => (
              <div key={provider.name}>
                <button>Login with {provider.name}</button>
              </div>
            ))} */}
            <button
              onClick={handleAuth}
              type='button'
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 items-center justify-center flex"
            >
              {authOption === 'login'
                ? 'Login'
                : 'Register'}
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

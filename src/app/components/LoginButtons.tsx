import React from 'react'
import useAuthModal from '@/hooks/useAuthModal';
import { signIn } from 'next-auth/react';

import StyledButton from './SytledButton';

type Props = {
    isLoading: boolean;
    user: any;
    spotifySession:any
}

const LoginButtons = ({isLoading,user,spotifySession}: Props) => {
    
    const authModal = useAuthModal();

        if(isLoading) {
          return null
        } else if (!user){
          return (
          <div className="flex flex-row items-center">
            <div>
              <StyledButton
                onClick={() => {
                  authModal.setAuthOption('signup');
                  authModal.onOpen();
                }}
                className="bg-transparent text-neutral-200 font-medium"
              >
                Sign Up
              </StyledButton>
            </div>
            <div>
              <StyledButton
                onClick={() => {
                  authModal.setAuthOption('login');
                  authModal.onOpen();
                }}
                className="bg-white px-6 py-2"
              >
                Log In
              </StyledButton>
            </div>
          </div>
          )
        } else if(!spotifySession){
          return (
            <div className="flex flex-row items-center">
            <div>
              <StyledButton
                onClick={() => {
                  signIn('spotify', { callbackUrl: '/' });
                }}
                className="bg-white px-6 py-2"
              >
                Log into Spotify
              </StyledButton>
            </div>
          </div>
          )
        }
}

export default LoginButtons
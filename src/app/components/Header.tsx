'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import StyledButton from './SytledButton';
import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import Image from 'next/image';

type Props = {
  children: React.ReactNode;
  className?: string;
  pageTitle?: string;
  showUserBadge?: boolean;
};

const Header: React.FC<Props> = ({ children, className, pageTitle, showUserBadge=true }) => {
  const authModal = useAuthModal();
  const { user, spotifySession } = useUser();
  const [showButtons, setShowButtons] = useState(false); // New state for showing buttons
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(window.innerWidth >= 630);
  }, []);

  useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      if (window.innerWidth >= 630 && !visible) {
        // If window width is greater than or equal to 768px and sidebar is hidden, show the sidebar
        setVisible(true);
      } else if (window.innerWidth < 630 && visible) {
        setVisible(false);
      }
    };

    // Attach the resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [visible]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 2000); // 2-second delay

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, []);

  return (
    <div
      className={twMerge(
        `h-fit bg-gradient-to-b from-red-950 p-4 md:p-6`,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="flex gap-x-2 items-center"></div>
        {visible && pageTitle && <h1 className='ml-4 text-2xl font-semibold'>{pageTitle}</h1>}
        {(!user || !spotifySession) && showButtons && (
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
        )}
        {user && spotifySession && showUserBadge && (
          <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-lg ">
            <Image
              width={25}
              height={25}
              className="rounded-full w-10 h-10"
              src={spotifySession?.user?.image || 'assets/icons/spotify.svg'}
              alt="user-image"
            />
            <h2>{spotifySession?.user?.name}</h2>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
        )}
      </div>
      {!visible && pageTitle && <h1 className='ml-4 text-2xl font-semibold'>{pageTitle}</h1>}
      {children}
    </div>
  );
};

export default Header;

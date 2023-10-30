'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import LoginButtons from './LoginButtons';
import { useSpotify } from '@/hooks/useSpotify';
import Image from 'next/image';



type Props = {
  children: React.ReactNode;
  className?: string;
  pageTitle?: string;
  showUserBadge?: boolean;
};

const Header: React.FC<Props> = ({
  children,
  className,
  pageTitle,
  showUserBadge = true,
}) => {
  const { user, isLoading } = useUser();
  const [visible, setVisible] = useState(true);
  const { spotifySession } = useSpotify();

  useEffect(() => {
    setVisible(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    console.log('Updated user state', user);
  }, [user, showUserBadge]);

  useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      if (window.innerWidth >= 768 && !visible) {
        // If window width is greater than or equal to 768px and sidebar is hidden, show the sidebar
        setVisible(true);
      } else if (window.innerWidth < 768 && visible) {
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

  return (
    <div className={twMerge(`p-4 md:p-6 bg-gradient-to-b from-red-950`, className)}>
      <div className="w-full mb-4 flex items-center justify-between md:justify-around lg:justify-between">
        <div className="flex gap-x-2 items-center lg:hidden" />
        {visible && pageTitle && (
          <h1 className="ml-4 text-2xl font-semibold">{pageTitle}</h1>
        )}
        <LoginButtons isLoading={isLoading} user={user} spotifySession={spotifySession} />
        {user && spotifySession && showUserBadge && (
          <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-lg flex-shrink-0">
            <Image
              width={25}
              height={25}
              className="rounded-full w-10 h-10"
              src={spotifySession?.user?.image || '/assets/icons/spotify.svg'}
              alt="user-image"
            />
            <h2 className="px-2">{spotifySession?.user?.name}</h2>
          </div>
        )}
      </div>
      {!visible && pageTitle && (
        <h1 className="ml-4 text-2xl font-semibold">{pageTitle}</h1>
      )}
      {children}
    </div>
  );
};

export default Header;

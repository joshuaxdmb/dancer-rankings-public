'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import LoginButtons from './Auth/LoginButtons';
import { useSpotify } from '@/hooks/useSpotify';
import { useRouter } from 'next/navigation';
import UserBadge from './UserBadge';

type Props = {
  children?: React.ReactNode;
  className?: string;
  pageTitle?: string;
  showUserBadge?: boolean;
  pageBadge?: React.ReactNode;
};

const Header: React.FC<Props> = ({
  children,
  className,
  pageTitle,
  showUserBadge = true,
  pageBadge,
}) => {
  const { user, isLoading } = useUser();
  const [visible, setVisible] = useState(true);
  const { userDetails } = useSpotify();
  const router = useRouter();

  useEffect(() => {
    setVisible(window.innerWidth >= 768);
  }, []);

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
    <div className={twMerge(`p-4 md:p-6 pt-7 bg-gradient-to-b from-red-950`, className)}>
      <div className="w-full mb-4 flex items-center justify-between md:justify-around lg:justify-between">
        <div className="flex gap-x-2 items-center lg:hidden" />
        {visible && pageTitle && (
          <h1 className="ml-4 text-2xl font-semibold">{pageTitle}</h1>
        )}
        <LoginButtons isLoading={isLoading} user={user}/>
        {pageBadge? pageBadge : (user && userDetails && showUserBadge && (
          <UserBadge userDetails={userDetails} />
        ))}
      </div>
      {!visible && pageTitle && (
        <h1 className="ml-4 text-2xl font-semibold">{pageTitle}</h1>
      )}
      {children}
    </div>
  );
};

export default Header;

'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { RxCaretLeft } from 'react-icons/rx';
import { GiHamburgerMenu } from 'react-icons/gi';
import StyledButton from './SytledButton';
import useAuthModal from '@/hooks/useAuthModal';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Header: React.FC<Props> = ({ children, className }) => {
  const authModal = useAuthModal();
  const router = useRouter();
  const handleLogout = () => {};

  return (
    <div
      className={twMerge(
        `h-fit bg-gradient-to-b from-red-950 p-4 md:p-6`,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="flex gap-x-2 items-center"></div>
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
      </div>
      {children}
    </div>
  );
};

export default Header;

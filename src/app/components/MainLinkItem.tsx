'use client';
import { on } from 'events';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  emoji: string;
  name: string;
  href: string;
  onClick: null | Function;
};

const MainLinkItem = ({ emoji, name, href, onClick }: Props) => {
  const router = useRouter();
  const handleClick = () => {
    onClick && onClick();
    router.push(href);
  };
  return (
    <button onClick={handleClick} className="relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4 pl-2">
      <div className='relative min-h-[64px] min-w-[64px] items-center flex justify-center'>
        <div className='text-[60px] text-center p-2'>{emoji}</div>
      </div>
      <p className='text-2xl items-center flex'>{name}</p>
    </button>
  );
};

export default MainLinkItem;

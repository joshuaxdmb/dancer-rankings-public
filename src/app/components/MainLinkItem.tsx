'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  emoji: string;
  name: string;
  href: string;
};

const MainLinkItem = ({ emoji, name, href }: Props) => {
  const router = useRouter();
  const onClick = () => {
    //TODO add auth before push
    router.push(href);
  };
  return (
    <button className="relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4 pl-2">
      <div className='relative min-h-[64px] min-w-[64px] items-center flex justify-center'>
        <div className='text-[60px] text-center p-2'>{emoji}</div>
      </div>
      <p className='text-2xl items-center flex'>{name}</p>
    </button>
  );
};

export default MainLinkItem;

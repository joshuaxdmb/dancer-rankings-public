'use client'
import Header from '@/app/components/Header';
import MainLinkItem from '@/app/components/MainLinkItem';
import { playlistAtom } from '@/atoms/playlistAtom';
import { PlaylistEnum, ActiveLinks } from '@/content';
import { useUser } from '@/hooks/useUser';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';


export default function Account() {
  const { user, userDetails} = useUser();
  const [showMessahe, setShowMessage] = useState(false); // New state for showing buttons
  const [topMargin, setTopMargin] = useState(true);
  const pathname = usePathname();
  const [playlist, setPlaylist] = useRecoilState(playlistAtom)

  const routes = useMemo(
    () => 
      ActiveLinks.map((link)=>(
        {
          label: link.label,
          active: pathname === link.href,
          href: link.href,
          icon: link.icon ? link.icon : null,
          onClick: link.playlist ? () => setPlaylist(link.playlist as PlaylistEnum) : null,
          emoji: link.emoji ? link.emoji : null,
        }
      ))
    ,[pathname, playlist])//eslint-disable-line
    
  useEffect(() => {
    setTopMargin(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      if (window.innerWidth <= 768 && !topMargin) {
        // If window width is greater than or equal to 768px and sidebar is hidden, show the sidebar
        setTopMargin(true);
      } else if (window.innerWidth > 768 && topMargin) {
        setTopMargin(false);
      }
    };

    // Attach the resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [topMargin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 1000); // 2-second delay

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, []);

  return (
    <div
      className="
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
      <Header className='' pageTitle={userDetails? `Hi ${userDetails.first_name || userDetails.full_name || 'there'} 👋! `:`If you're not a dancer, kindly close your browser 💃 🕺`}>
        
      </Header>
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4 mx-4'>
          {routes.map((al)=>(
            <MainLinkItem key={al.label} name={al.label} emoji={al.emoji} href={al.href} onClick={al.onClick}/>
          ))}
        </div>
    </div>
  );
}

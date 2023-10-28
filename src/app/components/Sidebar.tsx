'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Routes } from '@/types/types';
import { HiHome } from 'react-icons/hi';
import Box from './Box';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { HiMiniXMark } from 'react-icons/hi2';
import { GiHamburgerMenu } from 'react-icons/gi';
import StyledButton from './SytledButton';
import { useUser } from '@/hooks/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';
import { LocationIdsEnum, Locations, PlaylistEnum } from '@/content';
import { useRecoilState } from 'recoil';
import { locationAtom } from '@/atoms/locationAtom';
import { signOut } from 'next-auth/react';
import { playlistAtom } from '@/atoms/playlistAtom';

type Props = { children: React.ReactNode };

const Sidebar = ({ children }: Props) => {
  const { user } = useUser();
  const pathname = usePathname();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useRecoilState(locationAtom)
  const [playlist, setPlaylist] = useRecoilState(playlistAtom)
  

  const handleLocationChange = async (location: LocationIdsEnum) => {
    setLocation(location);
  }

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    await signOut();
    //Add reset any playing songs
    router.push('/');
    if (error) {
      console.log(error);
    }
  };

  const routes = useMemo(
    () => [
      {
        label: `Home`,
        active: pathname === Routes.Home,
        href: '/',
        Icon: HiHome,
      },
      {
        label: `🔥 Bachata`,
        active: pathname === Routes.Songs && playlist === PlaylistEnum.bachata,
        onClick: () => setPlaylist(PlaylistEnum.bachata),
        href: Routes.Songs,
      },
      {
        label: `🎉 Salsa`,
        active: pathname === Routes.Songs && playlist === PlaylistEnum.salsa,
        href: Routes.Songs,
        onClick: () => setPlaylist(PlaylistEnum.salsa),
      },
      {
        label: `🌊 Zouk`,
        active: pathname === Routes.Songs && playlist === PlaylistEnum.zouk,
        href: Routes.Songs,
        onClick: () => setPlaylist(PlaylistEnum.zouk),
      },
      {
        label: `💃 Events`,
        active: pathname === Routes.Events,
        href: Routes.Events,
      },
      {
        label: `🕺 Classes`,
        active: pathname === Routes.Classes,
        href: Routes.Classes,
      },
    ],
    [pathname, playlist]
  );

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

  // Sidebar content for code reuse
  const sidebarContent = (
    <div
      className={`flex flex-col gap-y-2 h-full w-[300px] md:p-2 transition-transform duration-300 overflow-y-scroll scrollbar-hide ${
        !visible ? '-translate-x-full' : ''
      }`}
    >
      <Box className="overflow-y-auto h-full">
        <button
          onClick={() => {
            setVisible(false);
          }}
          className="md:hidden p-6 pt-8 pb-0"
        >
          <HiMiniXMark className="text-white" size={35} />
        </button>
        {routes.map((p) => (
          <Link
            key={p.label}
            href={p.href}
            onClick={() => {
              p.onClick && p.onClick();
              if(window.innerWidth < 768) setVisible(false);
            }}
            className={twMerge(
              'flex py-6 pl-6 text-xl flex-col hover:text-white transition cursor-pointer text-neutral-400',
              p.active && 'text-white'
            )}
          >
            <h2 className="flex-row flex gap-x-1 items-center truncate w-full">
              {p.Icon ? <p.Icon size={22} /> : ''}
              {p.label}
            </h2>
          </Link>
        ))}
        {user && (
          <div className="mt-10 w-full flex items-center justify-center flex-col gap-4">
            <StyledButton
              onClick={() => {}}
              className="bg-white px-6 py-0 max-w-[200px] flex items-center justify-center gap-x-2"
            >
              <select
              id="location"
              name="location"
              className="w-full p-2 border-none rounded mt-1 bg-white text-center"
              value={location}
              onChange={(e) =>{ 
                handleLocationChange(e.target.value as LocationIdsEnum)}}
            >
              {Locations.map((location, index) => (
                <option key={index} value={location.id}>
                  {location.label}
                </option>
              ))}
            </select>
            </StyledButton>
            <StyledButton
              onClick={handleLogout}
              className="bg-white px-6 py-2 max-w-[200px] flex items-center justify-center gap-x-2"
            >
              Log Out <FaSignOutAlt />
            </StyledButton>
          </div>
        )}
      </Box>
    </div>
  );

  return (
    <div className="flex h-full relative">
      {visible ? null : (
        <button
          onClick={() => {
            setVisible(true);
          }}
          className="h-12 w-12 absolute top-6 left-4 z-20 md:hidden rounded-full bg-black flex items-center justify-center hover:opacity-60 transition p-3 shadow-sm shadow-gray-900 "
        >
          <GiHamburgerMenu className="text-white" size={22} />
        </button>
      )}
      <div className="md:block md:static hidden absolute top-0 left-0 bottom-0">
        {sidebarContent}
      </div>
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 z-10 transition-transform duration-300 ${
          !visible ? '-translate-x-full' : ''
        }`}
      >
        {sidebarContent}
      </div>
      <main
        className={`h-full flex-1 overflow-y-auto py-2 ${
          visible ? 'md:pl-[300px]' : ''
        }'md:pl-0' w-full`}
      >
        {children}
      </main>
    </div>
  );
};

export default Sidebar;

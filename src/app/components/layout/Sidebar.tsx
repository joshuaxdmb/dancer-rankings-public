/*
The sidebar wraps the main content of the app. It contains the navigation and the main content. 
It is also responsible for handling its own visibility and setting other css classes based on the device
*/
'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Routes } from '@/types/types'
import { HiHome } from 'react-icons/hi'
import Box from '../global/Box'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { HiMiniXMark } from 'react-icons/hi2'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useUser } from '@/hooks/useUser'
import { PlaylistEnum } from '../../../../content'
import { useRecoilState } from 'recoil'
import { playlistAtom } from '@/atoms/playlistAtom'
import AuthButtons from '../authentication/SidebarButtons'
import Loading from '../Loading'
import { deviceDimensionsAtom } from '@/atoms/deviceDimensionsAtom'
import { SafeArea } from 'capacitor-plugin-safe-area'
import { getMarginTop } from './StatusBarSpacing'

type Props = { children: React.ReactNode }

const Sidebar = ({ children }: Props) => {
  const { user, isPremium } = useUser()
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const [playlist, setPlaylist] = useRecoilState(playlistAtom)
  const [marginTop, setMarginTop] = useState(17)
  const [isLoading, setIsLoading] = useState(true)
  const [deviceDimensions, setDeviceDimensions] = useRecoilState(deviceDimensionsAtom)

  const setStatusBarHeight = async () => {
    const { statusBarHeight } = await SafeArea.getStatusBarHeight()
    const margin = await getMarginTop(17, statusBarHeight)
    setMarginTop(margin)
    setDeviceDimensions({ statusBarHeight })
    setIsLoading(false)
  }
  useEffect(() => {
    console.log('Beginning of Sidebar useEffect')
    setStatusBarHeight()
    setVisible(window.innerWidth >= 768)
  }, [])

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
        label: `🎊 Salsa`,
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
        label: `🎉 Party Playlist`,
        active: pathname === Routes.PartyPlaylist,
        href: Routes.PartyPlaylist,
      },
      {
        label: `🕺 Privates`,
        active: pathname === Routes.Classes,
        href: Routes.Classes,
      },
      {
        label: `👤 My Account`,
        active: pathname === Routes.Account,
        href: Routes.Account,
      },
    ],
    [pathname, playlist] //eslint-disable-line
  )

  useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      if (window.innerWidth >= 768 && !visible) {
        // If window width is greater than or equal to 768px and sidebar is hidden, show the sidebar
        setVisible(true)
      } else if (window.innerWidth < 768 && visible) {
        setVisible(false)
      }
    }

    // Attach the resize event listener
    window.addEventListener('resize', handleResize)

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [visible])

  // Sidebar content for code reuse
  const sidebarContent = (
    <div
      className={`flex flex-col gap-y-2 h-full w-[300px] pr-2 transition-transform duration-300 overflow-y-scroll scrollbar-hide z-30 ${
        !visible ? '-translate-x-full' : ''
      }`}>
      <Box className='overflow-y-auto h-full scrollbar-hide z-30'>
        <button
          className={`md:hidden p-6 pt-8 pb-0 z-30`}
          style={{ marginTop }}
          onClick={() => {
            setVisible(false)
          }}>
          <HiMiniXMark className='text-white' size={35} />
        </button>
        {routes.map((p) => (
          (p.href !== Routes.Account || user) &&<Link
            key={p.label}
            href={p.href}
            onClick={() => {
              p.onClick && p.onClick()
              if (window.innerWidth < 768) setVisible(false)
            }}
            className={twMerge(
              'flex py-6 pl-6 text-xl flex-col hover:text-white transition cursor-pointer text-neutral-400',
              p.active && 'text-white'
            )}>
            <h2 className='flex-row flex gap-x-1 items-center truncate w-full'>
              {p.Icon ? <p.Icon size={22} /> : ''}
              {p.label}
            </h2>
          </Link>
        ))}
        {user && <AuthButtons isPremiumUser={isPremium} />}
      </Box>
    </div>
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className={`flex h-full relative scrollbar-hide`}>
      {visible ? null : (
        <button
          onClick={() => {
            setVisible(true)
          }}
          style={{ marginTop }}
          className={`h-12 w-12 absolute left-4 z-30 md:hidden rounded-full flex items-center justify-center hover:opacity-60 transition p-3 shadow-sm shadow-gray-900 bg-black`}>
          <GiHamburgerMenu className='text-white' size={22} />
        </button>
      )}
      <div className='md:block md:static hidden absolute top-0 left-0 bottom-0'>
        {sidebarContent}
      </div>
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 transition-transform duration-300 z-30 ${
          !visible ? '-translate-x-full' : ''
        }`}>
        {sidebarContent}
      </div>
      <main className={`h-full flex-1 ${visible ? 'md:pl-[300px]' : ''}'md:pl-0' w-full`}>
        {children}
      </main>
    </div>
  )
}

export default Sidebar

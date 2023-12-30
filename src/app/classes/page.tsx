'use client'
import Header from '@/app/components/layout/Header'
import { playlistAtom } from '@/atoms/playlistAtom'
import { PlaylistEnum, ActiveLinks } from '../../../content'
import { useUser } from '@/hooks/useUser'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import { DEFAULT_NOT_SIGNED_IN_MESSAGE } from '@/utils/constants'

export default function Home() {
  const { user, userDetails } = useUser()
  const [showMessahe, setShowMessage] = useState(false) // New state for showing buttons
  const [topMargin, setTopMargin] = useState(true)
  const pathname = usePathname()
  const [playlist, setPlaylist] = useRecoilState(playlistAtom)

  const routes = useMemo(
    () =>
      ActiveLinks.map((link) => ({
        label: link.label,
        active: pathname === link.href,
        href: link.href,
        icon: link.icon ? link.icon : null,
        onClick: link.playlist ? () => setPlaylist(link.playlist as PlaylistEnum) : null,
        emoji: link.emoji ? link.emoji : null,
      })),
    [pathname, playlist]
  ) //eslint-disable-line

  useEffect(() => {
    setTopMargin(window.innerWidth <= 768)
  }, [])

  useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      if (window.innerWidth <= 768 && !topMargin) {
        // If window width is greater than or equal to 768px and sidebar is hidden, show the sidebar
        setTopMargin(true)
      } else if (window.innerWidth > 768 && topMargin) {
        setTopMargin(false)
      }
    }

    // Attach the resize event listener
    window.addEventListener('resize', handleResize)

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [topMargin])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true)
    }, 1000) // 2-second delay

    return () => clearTimeout(timer) // Clear the timer on component unmount
  }, [])

  return (
    <div
      className='
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      '>
      <Header
        className=''
        pageTitle={
          userDetails
            ? `Hi ${userDetails.full_name || userDetails.full_name || 'there'} 👋! `
            : DEFAULT_NOT_SIGNED_IN_MESSAGE
        }></Header>
      <div className='flex w-full items-center text-center justify-center text-gray-400 h-full'>
        Coming soon...
      </div>
    </div>
  )
}

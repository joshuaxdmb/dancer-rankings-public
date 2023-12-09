/*
The Home component is the main page of our web application, primarily handling user authentication and Spotify session integration. 
It leverages React hooks for state management and dynamically generates navigation links, adapting to both web and native mobile environments.
*/
'use client'
import Header from '@/app/components/layout/Header'
import MainLinkItem from '@/app/components/MainLinkItem'
import { playlistAtom } from '@/atoms/playlistAtom'
// import { spotifySessionAtom } from '@/atoms/spotifyAtom'
import { PlaylistEnum, ActiveLinks } from '../../../content'
import { useUser } from '@/hooks/useUser'
// import { Capacitor } from '@capacitor/core'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
// import { App } from '@capacitor/app'
// import toast from '@/lib/toast'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
// import { getUrl } from '@/lib/helpers'

export default function Home() {
  const { user, userDetails } = useUser()
  const [showMessage, setShowMessage] = useState(false) // New state for showing buttons
  const [topMargin, setTopMargin] = useState(true)
  const pathname = usePathname()
  const [playlist, setPlaylist] = usePersistentRecoilState(playlistAtom)
  // const isNative = Capacitor.isNativePlatform()
  // const [spotifySession, setSpotifySession] = usePersistentRecoilState(spotifySessionAtom)

  // const fetchSpotifySession = async (authCode: any) => {
  //   toast.success('Almost done...', { id: 'spotify-login' })
  //   if (spotifySession?.token && spotifySession?.token?.expires_at > Date.now()) {
  //     return
  //   }
  //   try {
  //     const res = await fetch(getUrl() + 'api/spotify/session', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ code: authCode, isNative }),
  //     })
  //     const session = await res.json()
  //     console.log('Spotify session response', session)
  //     if (session.error) throw new Error(session.error)
  //     setSpotifySession(session)
  //     window.history.pushState({}, '', '/')
  //   } catch (e) {
  //     console.log('Failed to get spotify session', e)
  //   }
  // }

  // //Handle Spotify callback on mobile
  // useEffect(() => {
  //   if (isNative) {
  //     App.addListener('appUrlOpen', (event) => {
  //       const url = new URL(event.url)
  //         const authCode = url.searchParams.get('code')
  //         if (authCode) {
  //           fetchSpotifySession(authCode)
  //       }
  //     })

  //     return () => {
  //       App.removeAllListeners()
  //     }
  //   } else {
  //     const handleAuthCode = async () => {
  //       const url = window.location.href
  //       const hasCode = url.includes('?code=')
  //       if (hasCode) {
  //         const newUrl = new URL(url)
  //         const authCode = newUrl.searchParams.get('code')
  //         console.log('Got spotify code', authCode)
  //         if (authCode) {
  //           fetchSpotifySession(authCode)
  //         }
  //       }
  //     }
  //     if (!isNative) {
  //       handleAuthCode()
  //     }
  //   }
  // },[])

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
      '>
      <Header
        className=''
        pageTitle={
          userDetails
            ? `Hi ${userDetails.full_name || 'there'} 👋! `
            : `If you're not a dancer, kindly close your browser 💃 🕺`
        }></Header>
      <div className=' h-screen overflow-y-auto pb-52 scrollbar-hide'>
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4 mx-4 overflow-y-auto'>
        {routes.map((al) => (
          <MainLinkItem
            key={al.label}
            name={al.label}
            emoji={al.emoji}
            href={al.href}
            onClick={al.onClick}
          />
        ))}
      </div>
      </div>
    </div>
  )
}

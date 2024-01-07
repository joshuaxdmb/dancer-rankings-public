/*
This is the home component of the application
*/
'use client'
import Header from '@/app/components/layout/Header'
import MainLinkItem from '@/app/components/MainLinkItem'
import { playlistAtom } from '@/atoms/playlistAtom'
import { PlaylistEnum, ActiveLinks } from '../../../content'
import { useUser } from '@/hooks/useUser'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import { DEFAULT_NOT_SIGNED_IN_MESSAGE } from '@/utils/constants'
import { showSideBarAtom } from '@/atoms/layoutAtom'
import { useRouter } from 'next/navigation'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { rejectedSignUpAtom, signUpFormAtom } from '@/atoms/signupFormAtom'
import { stagesEnum } from '../signup/content'

export default function Home() {
  const { userDetails } = useUser()
  const [topMargin, setTopMargin] = useState(true)
  const pathname = usePathname()
  const [playlist, setPlaylist] = useRecoilState(playlistAtom)
  const [showSidebar, setShowSidebar] = useRecoilState(showSideBarAtom)
  const router = useRouter()
  const [signUpForm, setSignUpForm, persistentSignUpForm] =
    usePersistentRecoilState(signUpFormAtom)
  const [rejectedSignUp, setRejectedSignUp] = useRecoilState(rejectedSignUpAtom)

  const routes = useMemo(
    () =>
      ActiveLinks.map((link) => ({
        label: link.label,
        active: pathname === link.href,
        href: link.href,
        icon: link.icon ? link.icon : null,
        onClick: link.playlist ? () => setPlaylist(link.playlist as PlaylistEnum) : null,
        emoji: link.emoji ? link.emoji : null,
        enabled: link.enabled
      })),
    [pathname, playlist]
  )

  useEffect(() => {
    console.log(signUpForm)
    if(userDetails && !userDetails?.identification && !rejectedSignUp) router.push('/signup')
    setShowSidebar(true)
    setTopMargin(window.innerWidth <= 768)
  }, [])

  useEffect(() => {
    // If window width is greater than or equal to 768px and sidebar is hidden, show the sidebar
    const handleResize = () => {
      if (window.innerWidth <= 768 && !topMargin) {
        setTopMargin(true)
      } else if (window.innerWidth > 768 && topMargin) {
        setTopMargin(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [topMargin])

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
        showUserBadge={true}
        pageTitle={
          userDetails
            ? `Hi ${userDetails.full_name || 'there'} 👋! `
            : DEFAULT_NOT_SIGNED_IN_MESSAGE 
        }></Header>
      <div className=' h-screen overflow-y-auto pb-52 scrollbar-hide'>
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4 mx-4 overflow-y-auto'>
        {routes.map((al) => (
          al.enabled && <MainLinkItem
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
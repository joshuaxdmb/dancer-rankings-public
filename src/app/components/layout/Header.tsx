'use client'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { useUser } from '@/hooks/useUser'
import { useEffect, useState } from 'react'
import LoginButtons from '../authentication/LoginButtons'
import { useSpotify } from '@/hooks/useSpotify'
import UserBadge from '../UserBadge'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { spotifySessionAtom } from '@/atoms/spotifyAtom'
import { getPaddingTop } from './StatusBarSpacing'
import { useRecoilState } from 'recoil'
import { deviceDimensionsAtom } from '@/atoms/deviceDimensionsAtom'

type Props = {
  children?: React.ReactNode
  className?: string
  pageTitle?: string
  showUserBadge?: boolean
  pageBadge?: React.ReactNode
}

const Header: React.FC<Props> = ({
  children,
  className,
  pageTitle,
  showUserBadge = true,
  pageBadge,
}) => {
  const { user, isLoading } = useUser()
  const [visible, setVisible] = useState(true)
  const { userDetails } = useSpotify()
  const [spotifySession] = usePersistentRecoilState(spotifySessionAtom)
  const [paddingTop, setPaddingTop] = useState(22)
  const [deviceDimensions, setDeviceDimensions] = useRecoilState(deviceDimensionsAtom)
  const [showLogin, setShowLogin] = useState(true)

  async function setDeviceClasses() {
    const padding = await getPaddingTop(5, deviceDimensions?.statusBarHeight)
    setPaddingTop(padding)
  }

  useEffect(() => {
    setVisible(window.innerWidth >= 768)
    setDeviceClasses()
  }, [])

  useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      if (window.innerWidth >= 768 && !visible) {
        // If window width is greater than or equal to 768px and sidebar is hidden, show the sidebar
        setVisible(true)
      } else if (window.innerWidth < 768 && visible) {
        setVisible(false)
      }

      if(window.innerWidth >= 360 && !showLogin) {
        setShowLogin(true)
      } else if (window.innerWidth < 410 && showLogin) {
        setShowLogin(false)
      }
    }

    // Attach the resize event listener
    window.addEventListener('resize', handleResize)

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [visible,showLogin])

  return (
    <div
      style={{ paddingTop }}
      className={twMerge(`p-4 md:p-6 bg-gradient-to-b from-purple-950 z-20`, className)}>
      <div className='w-full mb-4 flex items-center justify-between md:justify-around lg:justify-between z-20'>
        <div className='flex gap-x-2 items-center lg:hidden z-20' />
        {visible && pageTitle && <h1 className='ml-4 text-2xl font-semibold'>{pageTitle}</h1>}
        <div className='flex flex-row justify-end gap-2'>
        {(!pageBadge || showLogin) && <LoginButtons isLoading={isLoading} user={user} spotifySession={spotifySession} />}
        {pageBadge
          ? pageBadge
          : user && userDetails && showUserBadge && <UserBadge userDetails={userDetails} />}
        </div>
      </div>
      {!visible && pageTitle && <h1 className='ml-4 text-2xl font-semibold z-20'>{pageTitle}</h1>}
      {children}
    </div>
  )
}

export default Header

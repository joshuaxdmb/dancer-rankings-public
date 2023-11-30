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
  const [paddingTop, setPaddingTop] = useState(20)
  const [deviceDimensions, setDeviceDimensions] = useRecoilState(deviceDimensionsAtom)

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
    }

    // Attach the resize event listener
    window.addEventListener('resize', handleResize)

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [visible])

  return (
    <div style={{paddingTop}} className={twMerge(`p-4 md:p-6 bg-gradient-to-b from-purple-950`, className)}>
      <div className='w-full mb-4 flex items-center justify-between md:justify-around lg:justify-between'>
        <div className='flex gap-x-2 items-center lg:hidden' />
        {visible && pageTitle && <h1 className='ml-4 text-2xl font-semibold'>{pageTitle}</h1>}
        <LoginButtons isLoading={isLoading} user={user} spotifySession={spotifySession} />
        {pageBadge
          ? pageBadge
          : user && userDetails && showUserBadge && <UserBadge userDetails={userDetails} />}
      </div>
      {!visible && pageTitle && <h1 className='ml-4 text-2xl font-semibold'>{pageTitle}</h1>}
      {children}
    </div>
  )
}

export default Header

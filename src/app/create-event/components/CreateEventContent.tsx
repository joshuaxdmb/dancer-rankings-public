'use client'

import { useRouter } from 'next/navigation'
import useSubscribeModal from '@/hooks/useSubscribeModal'
import { useUser } from '@/hooks/useUser'
import { useEffect, useState } from 'react'
import { postDataToApi } from '@/lib/helpers'
import toast from '@/lib/toast'
import EventDetails from './EventDetails'

const AccountContent = () => {
  const router = useRouter()
  const subscribeModal = useSubscribeModal()
  const { isLoading, subscription, user } = useUser()
  const [loading, setLoading] = useState(false)

  // TODO: Add a check to see if the user is logged in and redirect to login if not
  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.replace('/')
  //   }
  // }, [isLoading, user, router])

  const redirectToCustomerPortal = async () => {
    setLoading(true)
    try {
      const { url } = await postDataToApi({
        url: 'api/create-portal-link',
      })
      window.location.assign(url)
    } catch (error) {
      if (error) {
        console.log('Error redirecting to customer portal ',error)
        toast.error('Unable to fetch customer portal')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mb-7 px-6 w-full items-center justify-center flex flex-col gap-y-2'>
      <EventDetails/>
    </div>
  )
}

export default AccountContent

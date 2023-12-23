'use client'

import { useRouter } from 'next/navigation'
import useSubscribeModal from '@/hooks/useSubscribeModal'
import { useUser } from '@/hooks/useUser'
import { useEffect, useState } from 'react'
import { getUrl, postData } from '@/lib/helpers'
import Sparkles from 'react-sparkle'
import toast from '@/lib/toast'
import SytledButton from '../../components/global/SytledButton'
import MyOrders from './MyOrders'
import UserDetails from './UserDetails'
import { FaLock } from 'react-icons/fa'

const AccountContent = () => {
  const router = useRouter()
  const subscribeModal = useSubscribeModal()
  const { isLoading, subscription, user } = useUser()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/')
    }
  }, [isLoading, user, router])

  const redirectToCustomerPortal = async () => {
    setLoading(true)
    try {
      const { url } = await postData({
        url: getUrl() + 'api/create-portal-link',
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
      {!subscription ? (
        <div className='flex items-center flex-col sm:flex-row gap-2 justify-center w-full'>
          <p className='hidden sm:flex '>No active plan.</p>
          <SytledButton
          sparkle
            onClick={subscribeModal.onOpen}
            className='bg-primary-purple px-6 py-3 my-2 max-w-[400px] flex items-center justify-center gap-x-2'>
            Go Premium
          </SytledButton>
        </div>
      ) : (
        <>
          <div className='relative h-12 mt-2 text-center max-w-[300px]'>
            <p>
              You are on the <b>premium dancers</b> plan
              <Sparkles count={5} minSize={5} fadeOutSpeed={10} flicker={false} />
            </p>
          </div>
          <SytledButton
            onClick={redirectToCustomerPortal}
            className='bg-white bg-opacity-80 max-w-[400px] mb-5 flex flex-row items-center justify-center'>
            Edit Subscription <FaLock className='ml-2' size={18} />{' '}
          </SytledButton>
        </>
      )}
      <UserDetails />
      <h2 className='text-left w-full text-lg mt-2'>Your Orders</h2>
      <MyOrders />
    </div>
  )
}

export default AccountContent

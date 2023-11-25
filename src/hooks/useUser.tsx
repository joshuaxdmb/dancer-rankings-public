import { SubscriptionType, UserDetailsType, UserOrder } from '@/types/types'
import { User } from '@supabase/auth-helpers-nextjs'
import { useSessionContext, useUser as useSupaUser } from '@supabase/auth-helpers-react'
import React, { useContext, useEffect } from 'react'
import { createContext, useState } from 'react'

type UserContextType = {
  accessToken: string | null
  user: User | null
  userDetails: UserDetailsType | null
  isLoading: boolean
  subscription: SubscriptionType | null
  isPremium: boolean
  userOrders: UserOrder[]
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface Props {
  [propName: string]: any
}

export const MyUserContextProvider = (props: Props) => {
  const { session, isLoading: isLoadingUser, supabaseClient: supabase } = useSessionContext()

  const user = useSupaUser()
  const accessToken = session?.access_token ?? null
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetailsType | null>(null)
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [subscription, setSubscription] = useState<SubscriptionType | null>(null)

  const getOrders = () => supabase.from('orders').select('*').eq('user_id', user?.id)

  const getUserDetails = () => supabase.from('users').select('*').eq('id', user?.id) //Possibly not needed because only has access to own user anyway

  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .eq('user_id', user?.id) //Possibly not needed because only has access to own user anyway

  useEffect(() => {
    if (!userDetails && !isLoadingData && user?.id) {
      setIsLoadingData(true)
      Promise.allSettled([getUserDetails(), getSubscription(), getOrders()])
        .then((results) => {
          const userDetailsResult = results[0]
          const subscriptionResult = results[1]
          const ordersResults = results[2]
          if (userDetailsResult.status === 'fulfilled' && userDetailsResult.value.data?.length) {
            setUserDetails(userDetailsResult.value.data[0] as UserDetailsType)
          }

          if (subscriptionResult.status === 'fulfilled' && subscriptionResult.value.data?.length) {
            setSubscription(subscriptionResult.value.data[0] as SubscriptionType)
          }

          if (ordersResults.status === 'fulfilled' && ordersResults.value.data?.length) {
            setUserOrders(ordersResults.value.data as UserOrder[])
          }

          setIsLoadingData(false)
        })
        .catch((e) => {
          console.log('Error fetching user data:', e)
        })
    } else if (!user && !userDetails && !isLoadingUser && !isLoadingData) {
      setUserDetails(null)
      setSubscription(null)
    }
  }, [user, isLoadingUser]) //eslint-disable-line

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingData || isLoadingUser,
    subscription,
    isPremium: ['active', 'trialing'].includes(subscription?.status || 'null'),
    userOrders,
  }

  return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within MyUserContextProvider')
  }

  return context
}

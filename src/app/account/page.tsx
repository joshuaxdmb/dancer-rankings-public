/*
Shows user information, orders and subscription details. Includes wether purchases have been consumed/used or not.
Allows the user to edit their details and also to cancel their subscription (redierects to stripe)
*/
'use client'
import Header from '@/app/components/layout/Header'
import { useUser } from '@/hooks/useUser'
import AccountContent from './components/AccountContent'
import Loading from './loading'

export default function Account() {
  const { userDetails, isLoading } = useUser()
  if (isLoading || !userDetails?.id) return <Loading />

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
            ? `Hi ${userDetails.full_name || 'there'} 👋! `
            : `If you're not a dancer, kindly close your browser 💃 🕺`
        }></Header>
      <AccountContent />
    </div>
  )
}

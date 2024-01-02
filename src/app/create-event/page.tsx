/*
Shows user information, orders and subscription details. Includes wether purchases have been consumed/used or not.
Allows the user to edit their details and also to cancel their subscription (redierects to stripe)
*/
'use client'
import Header from '@/app/components/layout/Header'
import { useUser } from '@/hooks/useUser'
import CreateEventContent from './components/CreateEventContent'
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
          `Let's plan something memorable! 🎉`
        }></Header>
      <CreateEventContent />
    </div>
  )
}

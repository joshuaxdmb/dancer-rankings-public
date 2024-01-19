/*
Shows user information, orders and subscription details. Includes wether purchases have been consumed/used or not.
Allows the user to edit their details and also to cancel their subscription (redierects to stripe)
*/
'use client'
import Header from '@/app/components/layout/Header'
import { useUser } from '@/hooks/useUser'
import Loading from './loading'
import EventDetails from './components/CreateEventDetails'

export default function Account() {
  const { isLoading } = useUser()
  if (isLoading) return <Loading />

  return (
    <div
      className='
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
        scrollbar-hide
      '>
      <Header className='' pageTitle={`Let's plan something memorable! 🎉`}></Header>
      <div className='mb-7 px-6 w-full items-center justify-center flex flex-col gap-y-2 overflow-y-auto scrollbar-hide'>
        <EventDetails />
      </div>
    </div>
  )
}

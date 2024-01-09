import React from 'react'
import { BiCalendar } from 'react-icons/bi'
import StyledButton from '../../components/global/SytledButton'
import { useRouter } from 'next/navigation'

type Props = {
}

const EventsBadge = ({ }: Props) => {
  const router = useRouter()
  const createEvent = async () => {
    router.push('/create-event')
  }


  const EventsOptionsButton = () => {
    return (
      <StyledButton onClick={createEvent} className={`bg-white py-1 h-[45px]`}>
        <BiCalendar color='black' size={24} /> Create Event
      </StyledButton>
    )
  }

  return (
    <div className='flex flex-row justify-end gap-2'>
      <EventsOptionsButton />
    </div>
  )
}

export default EventsBadge

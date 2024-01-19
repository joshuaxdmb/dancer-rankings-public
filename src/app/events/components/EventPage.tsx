import React from 'react'
import Image from 'next/image'
import { defaultEventImage } from '@/lib/content'
import StyledButton from '@/app/components/global/SytledButton'
import { HiChevronDoubleDown } from 'react-icons/hi2'
import { toBeautifulDateTime } from '@/utils/utils'
import { HiOutlineClock, HiOutlineLocationMarker } from 'react-icons/hi'
import { BsArrowUpCircleFill as ArrowUp } from 'react-icons/bs'
import { EventByVotesType, EventType } from '@/types/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

type Props = {
  eventById: EventType
  userVotes: any
  eventByVotes: EventByVotesType
  handleVote?: (upVoteOnly?: boolean) => void
  nextSlide?: () => void
  prevSlide?: () => void
}

const EventPage = ({ eventById, userVotes, eventByVotes, handleVote, nextSlide }: Props) => {
  return (
    <div className='h-full flex flex-col justify-center items-center text-left gap-5'>
      <div className='flex flex-col items-center gap-5 justify-between'>
        <div
          className='aspect-square max-w-[250px] max-h-[250px] w-5/6 object-cover'
          style={{
            position: 'relative',
            maxHeight: window.innerHeight > 710 ? 250 : 150,
            maxWidth: window.innerHeight > 710 ? 250 : 150,
          }}>
          <Image
            fill={true}
            objectFit='cover'
            alt='event-image'
            src={eventById?.image_path || defaultEventImage}
          />
        </div>
        <h1 className='text-2xl font-semibold text-center w-full max-w-[300px]'>
          {eventById.label}
        </h1>
        <div className='max-w-[300px] mx-2 gap-2 text-gray-300 w-full flex flex-col'>
          <div className='flex flex-row items-center gap-3'>
            <HiOutlineClock size={25} />
            {toBeautifulDateTime(eventById.start_time)}
          </div>
          <a
            target='blank'
            href={eventById.location_link}
            className='flex flex-row items-center gap-3 underline'>
            <HiOutlineLocationMarker size={35} />
            {eventById.venue}
          </a>
          <div className='flex flex-row items-center gap-3'>
            <ArrowUp
              onClick={() => {
                handleVote(false)
              }}
              className={`cursor-pointer hover:opacity-75 mx-[2px] ${
                userVotes?.includes(eventById.id) && 'text-green-500'
              }`}
              size={24}
            />
            {eventByVotes?.total_votes || 1}
          </div>
        </div>
      </div>
      <div className='gap-3 flex flex-col w-full max-w-[290px]'>
        <StyledButton
          onClick={() => {
            handleVote(true)
          }}>
          <ArrowUp className='mr-[2px]' size={20} />
          Upvote Event
        </StyledButton>
        <StyledButton className='bg-spotify-green'>Open Playlist</StyledButton>
        <StyledButton onClick={nextSlide} className='bg-transparent text-white font-medium'>
          <HiChevronDoubleDown size={24} />
          More Details
        </StyledButton>
      </div>
    </div>
  )
}

export default EventPage

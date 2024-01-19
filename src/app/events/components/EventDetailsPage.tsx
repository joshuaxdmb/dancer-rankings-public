import { EventClassType, EventType } from '@/types/types'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { defaultEventImage } from '@/lib/content'
import { toBeautifulDateTime, toBeautifulTime } from '@/utils/utils'

type Props = {
  eventById: EventType
}

const EventDetailsPage = ({ eventById }: Props) => {
  const [isThinScreen, setIsThinScreen] = useState(false)
  const [classes_included, setClassesIncluded] = useState<any[]>([])
  useEffect(() => {
    setIsThinScreen(window.innerWidth <= 300)
  }, [])

  useEffect(() => {
    setClassesIncluded(
      eventById?.classes_included ? JSON.parse(eventById.classes_included as string) : []
    )
  }, [eventById])

  return (
    <div className='h-screen w-full text-lg overflow-y-auto scrollbar-hide pt-[80px]'>
      <div className='flex flex-col items-center gap-5 justify-start'>
        <h1 className='text-2xl font-semibold'>{eventById.label}</h1>
        <div
          className='aspect-square max-w-[220px] max-h-[220px] w-5/6 object-cover overflow-hidden'
          style={{ position: 'relative' }}>
          <Image
            fill={true}
            objectFit='cover'
            alt='event-image'
            src={eventById?.image_path || defaultEventImage}
          />
        </div>
        <div
          style={{ width: !isThinScreen ? '83.33%' : '90%', fontSize: isThinScreen && 15 }}
          className='flex flex-col gap-2 items-center w-5/6 mt-2 pb-[50px]'>
          <div className={rowContainerClass}>
            <p className='font-bold w-1/4'>Starts:</p>
            <p className='w-3/4'>{toBeautifulDateTime(eventById.start_time)}</p>
          </div>
          <div className={rowContainerClass}>
            <p className='font-bold w-1/4'>Ends:</p>
            <p className='w-3/4'>{toBeautifulDateTime(eventById.end_time)}</p>
          </div>
          <div className={rowContainerClass}>
            <p className='font-bold w-1/4'>Location:</p>
            <a
              target='blank'
              href={eventById.location_link}
              className='w-3/4 underline cursor-pointer'>
              {eventById.venue}
            </a>
          </div>
          {eventById.cover && (
            <div className={rowContainerClass}>
              <p className='font-bold w-1/4'>Cover:</p>
              <a className='w-3/4'>${eventById.cover}</a>
            </div>
          )}
          {classes_included?.length > 0 && (
            <div className={rowContainerClass}>
              <p className='font-bold w-1/4'>Classes:</p>
              <div className='w-3/4'>
                {classes_included.map((c: EventClassType, index: number) => {
                  let classTime = c.start_time ? toBeautifulTime(c.start_time) : ''
                  return (
                    <div className='mb-2' key={index}>
                      <p className='w-full'>
                        {c.class} {c.instructors && 'by ' + c.instructors}
                      </p>
                      {c.level && <p className='w-full text-gray-400 text-sm'>Level: {c.level}</p>}
                      {c.start_time && (
                        <p className='w-full text-gray-400 text-sm'>Starts: {classTime}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {eventById.description && (
            <div className={rowContainerClass}>
              <p className='font-bold w-1/4'>Notes:</p>
              <p className='w-3/4 text-gray-300'>{eventById.description}</p>
            </div>
          )}
          {eventById.event_site && (
            <div className={rowContainerClass}>
              <p className='font-bold w-1/4'>Website:</p>
              <p className='w-3/4 underline truncate overflow-hidden cursor-pointer'>
                {eventById.event_site}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const rowContainerClass = 'flex flex-row items-start gap-2 w-full max-w-[350px] text-left'

export default EventDetailsPage

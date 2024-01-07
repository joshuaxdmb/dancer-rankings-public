import React, { useEffect, useState } from 'react'
import Box from '../../components/global/Box'
import { LocationIdsEnum, Locations } from '../../../../content'
import { FaEdit } from 'react-icons/fa'
import StyledButton from '@/app/components/global/SytledButton'
import DateInputField from './TimeInput'
import { EventType } from '@/types/types'
import StyledTextInput from '../../components/StyledTextInput'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { createEventFormAtom } from '@/atoms/createEventFormAtom'
import MultipleChoiceInput from './MultipleChoiceInput'
import toast from 'react-hot-toast'
import { HiMiniMinusCircle, HiMiniPlusCircle } from 'react-icons/hi2'
import ClassInputFielt from './ClassInputFielt'
import { pickImageFromGallery, uploadImageToCloudinary } from '@/utils/cloudinary'
import Image from 'next/image'
import Autocomplete from 'react-google-autocomplete'
import { useSupabase } from '@/hooks/useSupabase'
import { useRouter } from 'next/navigation'

type Props = {}

const UserDetails = ({}: Props) => {
  const [createEventForm, setCreateEventForm] = usePersistentRecoilState(createEventFormAtom)
  const supabase = useSupabase()
  const router = useRouter()
  //Start Form state
  const [editable, setEditable] = useState(true)
  const [label, setLabel] = useState(createEventForm?.label)
  const [address, setAddress] = useState(createEventForm?.address)
  const [addressLink, setAddressLink] = useState(createEventForm?.addressLlink)
  const [eventSite, setEventSite] = useState(createEventForm?.eventSite)
  const [startTime, setStartTime] = useState(createEventForm?.startTime)
  const [classesIncluded, setClassesIncluded] = useState<any[]>(
    createEventForm?.classes_included || []
  )
  const [instructors, setInstructors] = useState(createEventForm?.instructors)
  const [endTime, setEndTime] = useState(createEventForm?.endTime)
  const [location, setLocation] = useState(createEventForm?.location || LocationIdsEnum.toronto)
  const [playlistId, setPlaylistId] = useState(createEventForm?.playlistId)
  const [picture, setPicture] = useState(createEventForm?.picture)
  //End form state

  const addPicture = async () => {
    const file = await pickImageFromGallery()
    if (!file) return
    const url = await uploadImageToCloudinary(file)
    setPicture(url)
  }

  const updateClassesIncluded = async (index: number, newClass: any) => {
    const newClassesIncluded = classesIncluded.map((c, i) => {
      if (i === index) {
        return { ...c, newClass }
      }
      return c
    })
    setClassesIncluded(newClassesIncluded)
  }

  const removeLastClass = () => {
    const newClassesIncluded = classesIncluded.slice(0, -1)
    setClassesIncluded(newClassesIncluded)
  }

  const addClass = () => {
    setClassesIncluded([
      ...classesIncluded,
      {
        class: '',
        level: '',
      },
    ])
  }

  const areTimesCorrect = () => {
    if (startTime > endTime) {
      toast.error('The event cannot end before it begins', { id: 'event-time' })
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!areTimesCorrect()) return
    const insertData = {
      label,
      address,
      addressLink,
      eventSite,
      startTime,
      classesIncluded,
      instructors,
      endTime,
      location,
      playlistId,
      picture,
    }

    setCreateEventForm(insertData)
    setEditable(false)
  }

  const submitEvent = async () => {
    const insertData: EventType = {
      created_at: new Date(),
      label: label,
      venue: address,
      location_link: addressLink,
      event_site: eventSite,
      start_time: startTime,
      classes_included: classesIncluded,
      instructors: instructors,
      end_time: endTime,
      event_location: location,
      playlist_id: playlistId,
      image_path: picture,
    }
    try{
      await supabase.createEvent(insertData)
      toast.success('Event submitted successfully', { id: 'event-submitted' })
      router.push('/events')
    } catch (error) {
      console.log('Error creating event', error)
      toast.error('Error creating event', { id: 'event-submitted' })
    }

  }

  const labelClass = 'mt-3'
  useEffect(() => {}, [])

  return (
    <div className='w-full items-center justify-center flex flex-col gap-y-2'>
      {!editable && (
        <h2 className='text-left w-full text-lg flex flex-row items-center gap-2'>
          Edit{' '}
          <FaEdit onClick={() => setEditable(true)} className='mb-1 cursor-pointer' size={20} />
        </h2>
      )}
      <Box className='padding-2 drop-shadow-sm bg-white bg-opacity-10 px-5 py-5 rounded-md'>
        <form>
          <div>{`Let's give this a cool name`}</div>
          <StyledTextInput
            id='name'
            value={label}
            setValue={setLabel}
            placeholder={'Event name'}
            disabled={!editable}
          />
          <div className={labelClass}>{`How to people get there?`}</div>
          <Autocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            onPlaceSelected={(place) => {
              setAddress(place.formatted_address)
              setAddressLink('https://www.google.com/maps/search/place_id:' + place.place_id)
            }}
            className='text-gray-300 bg-transparent text-sm w-full py-2 z-20 rounded-md h-8 outline-primary-purple pl-2 '
            types={[]}
            options={{
              types: [],
            }}
            aria-placeholder='Venue'
            defaultValue={''}
          />
          <div className={labelClass}>When does the event start?</div>
          <DateInputField birthdate={startTime} setBirthdate={setStartTime} disabled={!editable} />
          <div className={labelClass}>When does the event end?</div>
          <DateInputField birthdate={endTime} setBirthdate={setEndTime} disabled={!editable} />
          <div className={labelClass}>Choose the zone of this event:</div>
          <MultipleChoiceInput
            id='location'
            editable={editable}
            value={location}
            setValue={setLocation}
            options={Locations.filter((l) => l.id !== LocationIdsEnum.global).map((l) => {
              return l.id
            })}
            labels={Locations.filter((l) => l.id !== LocationIdsEnum.global).map((l) => {
              return l.label
            })}
            placeholder='(required)'
          />
          <div className={labelClass}>{`Who's teaching`}</div>
          <StyledTextInput
            id='instructors'
            value={instructors}
            setValue={setInstructors}
            placeholder={'Main instructors (optional)'}
            disabled={!editable}
          />
          <div className={labelClass + ' mb-2'}>{`Classes`}</div>
          {classesIncluded.length ? (
            <div>
              {classesIncluded.map((c, i) => {
                return (
                  <ClassInputFielt
                    key={i}
                    index={i}
                    eventClass={c.class}
                    setClass={updateClassesIncluded}
                    editable={editable}
                  />
                )
              })}
              <StyledButton
                onClick={addClass}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.45)',
                  color: 'white',
                  fontWeight: 'lighter',
                }}
                className={`rounded-lg sm:min-w-[260px] h-10 text-left items-center justify-start pl-3 text-sm mt-4`}>
                {<HiMiniPlusCircle size={20} />} Add Class
              </StyledButton>
              <StyledButton
                onClick={removeLastClass}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.45)',
                  color: 'white',
                  fontWeight: 'lighter',
                }}
                className={`rounded-lg sm:min-w-[260px] h-10 text-left items-center justify-start pl-3 text-sm mt-4`}>
                {<HiMiniMinusCircle size={20} />} Remove Last
              </StyledButton>
            </div>
          ) : (
            <StyledButton
              onClick={addClass}
              style={{
                backgroundColor: 'rgba(255,255,255,0.45)',
                color: 'white',
                fontWeight: 'lighter',
              }}
              className={`rounded-lg sm:min-w-[260px] h-10 text-left items-center justify-start pl-3 text-sm`}>
              {<HiMiniPlusCircle size={20} />} Add Class
            </StyledButton>
          )}
          <div className={labelClass + ' mb-2'}>{`Add a Picture`}</div>

          <StyledButton
            onClick={addPicture}
            style={{
              backgroundColor: 'rgba(255,255,255,0.45)',
              color: 'white',
              fontWeight: 'lighter',
            }}
            className={`rounded-lg sm:min-w-[260px] h-10 text-left items-center justify-start pl-3 text-sm mb-2`}>
            {<HiMiniPlusCircle size={20} />} {picture ? `Replace Picture` : `Add Picture`}
          </StyledButton>
          {picture && (
            <Image
              objectFit='cover'
              height={100}
              width={100}
              alt='uploaded-image'
              src={picture}
              className='w-auto h-40 mx-auto object-cover rounded-md'
            />
          )}
        </form>
      </Box>
      {editable ? (
        <>
          <StyledButton onClick={handleSave} className='bg-primary-purple'>
            Save Changes
          </StyledButton>
        </>
      ) : (
        <>
          <StyledButton onClick={submitEvent} className='bg-primary-purple'>
            Submit Event
          </StyledButton>
        </>
      )}
    </div>
  )
}

export default UserDetails

import { useUser } from '@/hooks/useUser'
import React, { useEffect, useState } from 'react'
import Box from '../../components/global/Box'
import {
  DanceLevelLabels,
  DanceRoleLabels,
  LocationIdsEnum,
  LocationLabels,
  Locations,
} from '../../../../content'
import { ClassOfferedByInstructor, DanceRolesEnum } from '@/types/danceClassesTypes'
import { useSupabase } from '@/hooks/useSupabase'

import { useSpotify } from '@/hooks/useSpotify'
import { FaEdit } from 'react-icons/fa'
import StyledButton from '@/app/components/global/SytledButton'
import DateInputField from './TimeInput'
import { EventType } from '@/types/types'
import StyledTextInput from '../../components/StyledTextInput'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { createEventFormAtom } from '@/atoms/createEventFormAtom'
import MultipleChoiceInput from './MultipleChoiceInput'
import toast from 'react-hot-toast'
import { HiMiniPlusCircle } from 'react-icons/hi2'

type Props = {}

const UserDetails = ({}: Props) => {
  const [createEventForm, setCreateEventForm] = usePersistentRecoilState(createEventFormAtom)
  const { userDetails } = useUser()
  //Start Form state
  const [editable, setEditable] = useState(true)
  const [label, setLabel] = useState(createEventForm?.label)
  const [venue, setVenue] = useState(createEventForm?.venue)
  const [locationLink, setLocationLink] = useState(createEventForm?.location_link)
  const [eventSite, setEventSite] = useState(createEventForm?.event_site)
  const [startTime, setStartTime] = useState(createEventForm?.start_time)
  const [classesIncluded, setClassesIncluded] = useState<any[]>(createEventForm?.classes_included)
  const [instructors, setInstructors] = useState(createEventForm?.instructors)
  const [endTime, setEndTime] = useState(createEventForm?.end_time)
  const [location, setLocation] = useState(createEventForm?.event_location)
  const [playlistId, setPlaylistId] = useState(createEventForm?.playlist_id)
  const [areClassesIncluded, setAreClassesIncluded] = useState('')
  //End form state

  const supabase = useSupabase()

  const addClass = () =>{
    setClassesIncluded(
      [...classesIncluded,
      {
        class:'',
        level:''
      }
      ]
    )
  }

  const areTimesCorrect = () =>{
    if(startTime > endTime) {
      toast.error('The event cannot end before it begins', {id:'event-time'})
      return false
    }
    return true
  }

  const handleSave = async () => {
    if(!areTimesCorrect()) return
    const insertData: EventType = {
      created_at: new Date(),
      label: label,
      venue: venue,
      location_link: locationLink,
      event_site: eventSite,
      start_time: startTime,
      classes_included: classesIncluded,
      instructors: instructors,
      end_time: endTime,
      event_location: location,
      playlistId: playlistId,
    }

    setCreateEventForm(insertData)
    setEditable(false)
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
            placeholder={''}
            disabled={!editable}
          />
          <div className={labelClass}>{`What's the venue?`}</div>
          <StyledTextInput
            id='venue'
            value={venue}
            setValue={setVenue}
            placeholder={''}
            disabled={!editable}
          />
          <div className={labelClass}>When does the event start?</div>
          <DateInputField
            birthdate={startTime}
            setBirthdate={setStartTime}
            disabled={!editable}
          />
          <div className={labelClass}>When does the event end?</div>
          <DateInputField birthdate={endTime} setBirthdate={setEndTime} disabled={!editable} />
          <div className={labelClass}>Choose the zone of this event:</div>
          <MultipleChoiceInput
            id='location'
            editable={editable}
            value={location}
            setValue={setLocation}
            options={Locations.filter(l=>l.id !== LocationIdsEnum.global).map((l) => {
              return l.id
            })}
            labels={Locations.filter(l=>l.id !== LocationIdsEnum.global).map((l) => {
              return l.label
            })}
            placeholder=''
          />
          <div className={labelClass}>{`Who's teaching`}</div>
          <StyledTextInput
            id='instructors'
            value={instructors}
            setValue={setInstructors}
            placeholder={''}
            disabled={!editable}
          />
          <div className={labelClass}>{`Classes`}</div>
          <StyledButton
          onClick={addClass}
            style={{backgroundColor:'rgba(255,255,255,0.45)', color:'white', fontWeight:'lighter'}}
        className={`rounded-lg sm:min-w-[260px] h-10 text-left items-center justify-start pl-3 text-sm`}
        >{<HiMiniPlusCircle size={20} />} Add Class</StyledButton>
        </form>
      </Box>
      {editable && (
        <>
          <StyledButton onClick={handleSave} className='bg-primary-purple'>
            Save Changes
          </StyledButton>
        </>
      )}
    </div>
  )
}

export default UserDetails

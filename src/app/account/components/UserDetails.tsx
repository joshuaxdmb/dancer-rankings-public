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
import { DanceRolesEnum } from '@/types/danceClassesTypes'
import { useSupabase } from '@/hooks/useSupabase'

import { useSpotify } from '@/hooks/useSpotify'
import { FaEdit } from 'react-icons/fa'
import StyledButton from '@/app/components/global/SytledButton'
import BirthdayInputField from './BirthDayInput'
import { shouldUpdateFromSpotify, shouldUpdateUser } from '../accountUtils'
import { GendersEnum, UserDetailsType } from '@/types/types'
import StyledTextInput from '../../components/StyledTextInput'
import toast from '@/lib/toast'
import { isValidEmail } from '@/app/songs/songsUtils'

type Props = {}

const UserDetails = ({}: Props) => {
  const { userDetails } = useUser()
  const { userDetails: userDetailsSpotify } = useSpotify()

  //Start Form state
  const [editable, setEditable] = useState(false)
  const [enteredName, setEnteredName] = useState(userDetails?.full_name)
  const [primaryDanceRole, setPrimaryDanceRole] = useState(userDetails?.primary_dance_role)
  const [birthdate, setBirthdate] = useState<string>(userDetails?.birthdate || '')
  const [selectedLocation, setSelectedLocation] = useState(userDetails?.default_location)
  const [gender, setGender] = useState(userDetails?.gender)
  const [enteredEmail, setEnteredEmail] = useState(userDetails?.email)
  //End form state

  const supabase = useSupabase()

  const handleCancel = () => {
    setEnteredName(userDetails?.full_name)
    setPrimaryDanceRole(userDetails?.primary_dance_role)
    setSelectedLocation(userDetails?.default_location)
    setBirthdate(userDetails?.birthdate || '')
    setEditable(false)
  }

  const handleSave = async () => {

    if(!isValidEmail(enteredEmail)){
      toast.error('Please enter a valid email')
      return
    }
    const insertData: UserDetailsType = {
      full_name: enteredName,
      primary_dance_role: primaryDanceRole,
      default_location: selectedLocation,
      birthdate: birthdate,
      gender,
      email: enteredEmail,
    } as UserDetailsType

    console.log('Insert user data:', insertData)

    if (!shouldUpdateUser(insertData, userDetails)) {
      toast.success('No changes to save')
    } else {
      await supabase.updateUser(userDetails.id, insertData)
    }
    setEditable(false)
  }

  const labelClass = 'mt-3'

  const updateUserFromSpotfiy = async (insertData: UserDetailsType) => {
    await supabase.updateUser(userDetails.id, insertData)
  }

  useEffect(() => {
    const insertData = shouldUpdateFromSpotify(userDetails, userDetailsSpotify)
    if (insertData) updateUserFromSpotfiy(insertData)
  }, [])

  return (
    <div className='w-full items-center justify-center flex flex-col gap-y-2'>
      <h2 className='text-left w-full text-lg flex flex-row items-center gap-2'>
        Your Dancer Stats
        <FaEdit onClick={() => setEditable(true)} className='mb-1 cursor-pointer' size={20} />
      </h2>
      <Box className='padding-2 drop-shadow-sm bg-white bg-opacity-10 px-5 py-5 rounded-md'>
        <form>
          <div>Your Name:</div>
          <StyledTextInput
            id='name'
            value={enteredName}
            setValue={setEnteredName}
            placeholder={userDetails.full_name}
            disabled={!editable}
          />
          <div className={labelClass}>Your Email:</div>
          <StyledTextInput
            id='email'
            type='email'
            value={enteredEmail}
            setValue={setEnteredEmail}
            placeholder={userDetails.email}
            disabled={!editable}
          />
          <div className={labelClass}>Your Birthday Dances:</div>
          <BirthdayInputField
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            disabled={!editable}
          />
          <div className={labelClass}>Your Gender:</div>
          {editable ? (
            <select
              id='gender'
              name='gender'
              className='w-full p-2 border rounded mt-1'
              value={gender}
              onChange={(e) => {
                setGender(e.target.value as GendersEnum)
              }}>
              {Object.keys(GendersEnum).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          ) : (
            <StyledTextInput
              id='location_uneditable'
              value={gender}
              setValue={() => {}}
              placeholder={gender || ''}
              disabled={true}
            />
          )}
          <div className={labelClass}>Your Community:</div>
          {editable ? (
            <select
              id='location'
              name='location'
              className='w-full p-2 border rounded mt-1'
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value as LocationIdsEnum)
              }}>
              {Locations.filter((l) => l.id !== LocationIdsEnum.global).map((location, index) => (
                <option key={index} value={location.id}>
                  {location.label}
                </option>
              ))}
            </select>
          ) : (
            <StyledTextInput
              id='location_uneditable'
              value={LocationLabels[selectedLocation as LocationIdsEnum]}
              setValue={() => {}}
              placeholder={LocationLabels[selectedLocation as LocationIdsEnum] || ''}
              disabled={true}
            />
          )}
          <div className={labelClass}>Primary Dance Role:</div>
          {editable ? (
            <select
              id='dancerole'
              name='dancerole'
              className='w-full p-2 border rounded'
              value={primaryDanceRole}
              onChange={(e) => {
                setPrimaryDanceRole(e.target.value as DanceRolesEnum)
              }}
              disabled={!editable}>
              {Object.keys(DanceRolesEnum).map((dr) => (
                <option key={dr} value={dr}>
                  {dr}
                </option>
              ))}
            </select>
          ) : (
            <StyledTextInput
              id='dancerole_uneditable'
              value={DanceRoleLabels[userDetails.primary_dance_role]}
              setValue={() => {}}
              placeholder={userDetails.primary_dance_role}
              disabled={true}
            />
          )}

          <div className={labelClass}>
            Leader Dance Level{editable ? ' (assigned by instructors)' : ':'}
          </div>
          <StyledTextInput
            id='leaderlevel'
            value={DanceLevelLabels[userDetails.lead_level]}
            setValue={() => {}}
            placeholder={userDetails.lead_level}
            disabled={true}
          />
          <div className={labelClass}>
            Follower Dance Level{editable ? ' (assigned by instructors)' : ':'}
          </div>
          <StyledTextInput
            id='followerlevel'
            value={DanceLevelLabels[userDetails.follow_level]}
            setValue={() => {}}
            placeholder={userDetails.follow_level}
            disabled={true}
          />
        </form>
      </Box>
      {editable && (
        <>
          <StyledButton onClick={handleCancel} className='bg-white'>
            Cancel
          </StyledButton>
          <StyledButton onClick={handleSave} className='bg-primary-purple'>
            Save Changes
          </StyledButton>
        </>
      )}
    </div>
  )
}

export default UserDetails

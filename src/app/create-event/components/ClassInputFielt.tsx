import StyledTextInput from '@/app/components/StyledTextInput'
import { EventClassType } from '@/types/types'
import React from 'react'

type Props = {
  editable: boolean
  eventClass: EventClassType
  setClass: (index: number, value: EventClassType) => void
  index: number
}

const ClassInputFielt = ({ editable, eventClass, setClass, index }: Props) => {
  return (
    <div className='bg-white bg-opacity-10 px-2 rounded-md py-1 mb-2'>
      <h2 className='mt-2'>{`Class ${index + 1}`}</h2>
      <div className='flex flex-row items-center mt-0 justify-center'>
      <p className='text-sm text-gray-200'>Class:</p>
      <StyledTextInput
        className='pl-2 ml-0 mt-0'
        id={'class-' + index}
        value={eventClass.class}
        setValue={(value) => {
          setClass(index, { ...eventClass, class: value })
        }}
        placeholder={'Class'}
        disabled={!editable}
      />
      </div>
      <div className='flex flex-row items-center mt-0'>
      <p className='text-sm text-gray-200'>Instructors:</p>
      <StyledTextInput
        className='pl-2 ml-0 mt-0'
        id={'instructors-' + index}
        value={eventClass.class}
        setValue={(value) => {
          setClass(index, { ...eventClass, instructors: value })
        }}
        placeholder={'Instructors'}
        disabled={!editable}
      />
      </div>
      <div className='flex flex-row items-center mt-0'>
      <p className='text-sm text-gray-200'>Levels:</p>
      <StyledTextInput
        className='pl-2 ml-0 mt-0'
        id={'level-' + index}
        value={eventClass.class}
        setValue={(value) => {
          setClass(index, { ...eventClass, level: value })
        }}
        placeholder={'Levels'}
        disabled={!editable}
      />
      </div>
    </div>
  )
}

export default ClassInputFielt

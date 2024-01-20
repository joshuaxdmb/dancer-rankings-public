import React from 'react'
import ClassInputFielt from './ClassInputFielt'
import StyledButton from '@/app/components/global/SytledButton'
import { HiMiniMinusCircle, HiMiniPlusCircle } from 'react-icons/hi2'

type Props = {
  editable: boolean
  classesIncluded: any[]
  setClassesIncluded: (classes: any[]) => void
  startTime: any
}

const AddClass = ({ editable, classesIncluded, setClassesIncluded, startTime }: Props) => {
  const updateClassesIncluded = async (index: number, newClass: any) => {
    const newClassesIncluded = classesIncluded.map((c, i) => {
      if (i === index) {
        return { ...c, ...newClass }
      }
      return c
    })
    setClassesIncluded(newClassesIncluded)
  }

  const addClass = () => {
    setClassesIncluded([
      ...classesIncluded,
      {
        class: '',
        level: '',
        instructors: '',
        start_time: startTime,
      },
    ])
  }
  const removeLastClass = () => {
    const newClassesIncluded = classesIncluded.slice(0, -1)
    setClassesIncluded(newClassesIncluded)
  }
  return (
    <div>
      {classesIncluded.map((c, i) => {
        return (
          <ClassInputFielt
            key={i}
            index={i}
            eventClass={c}
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
  )
}

export default AddClass

import StyledTextInput from '@/app/components/StyledTextInput'
import React from 'react'

type Props = {
    editable:boolean
    value:string
    setValue: Function
    options: any[]
    labels?:any[]
    placeholder?:string
    id:string
}

const MultipleChoiceInput = ({editable, value, setValue, options, labels, placeholder, id}: Props) => {
  return (
    <>
    {editable ? (
        <select
          id={id}
          className='w-full p-2 border rounded mt-1 text-sm'
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}>
          {options.map((value, index) => (
            <option key={index} value={value}>
              {labels.length? labels[index] : value}
            </option>
          ))}
        </select>
      ) : (
        <StyledTextInput
          id={id+'-disabled'}
          value={value}
          setValue={() => {}}
          placeholder={placeholder || ''}
          disabled={true}
        />
      )}
      </>
  )
}

export default MultipleChoiceInput
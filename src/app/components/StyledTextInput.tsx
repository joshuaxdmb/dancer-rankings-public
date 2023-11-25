import { type } from 'os';
import React from 'react'

type Props = {
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    disabled?: boolean;
    id:string
    type?: string;
}

const StyledTextInput = ({value,setValue, placeholder, disabled,id,type}: Props) => {
  return (
    <input
            id={id}
            type={type?? 'text'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="text-gray-300 bg-transparent w-full py-2"
            disabled={disabled}
          />
  )
}

export default StyledTextInput
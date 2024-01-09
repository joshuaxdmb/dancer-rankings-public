import { type } from 'os';
import React from 'react'

type Props = {
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    disabled?: boolean;
    id:string
    type?: string;
    className?: string;
}

const StyledTextInput = ({value,setValue, placeholder, disabled,id,type,className}: Props) => {
  return (
    <input
            id={id}
            type={type?? 'text'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={"text-gray-300 bg-transparent text-sm w-full py-2 z-20 rounded-md h-8 outline-primary-purple pl-2 "+className}
            disabled={disabled}
          />
  )
}

export default StyledTextInput
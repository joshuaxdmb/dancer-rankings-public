import React from 'react'
import Box from './Box'
import { BeatLoader } from 'react-spinners'

type Props = {
    message?:string
}

const Loading = ({message}: Props) => {
  return (
    <Box className="h-full flex items-center justify-center flex-col">
             <BeatLoader color="#FFFFFF" size={20} />
             {message &&<h1 className="text-lg mt-4">{message}</h1>}
             
        </Box>
  )
}

export default Loading
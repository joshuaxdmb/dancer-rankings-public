"use client"

import { BeatLoader } from 'react-spinners';

import Box from "./components/Box"

const Loading = () =>{
    return (
        <Box className="h-full flex items-center justify-center">
             <BeatLoader color="#FFFFFF" size={20} />
        </Box>
    )
}

export default Loading
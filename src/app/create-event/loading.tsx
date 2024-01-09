"use client"

import { BeatLoader } from 'react-spinners';

import Box from "../components/global/Box"

const Loading = () =>{
    return (
        <Box className="h-full flex items-center justify-center flex-col">
             <BeatLoader color="#FFFFFF" size={20} />
             <h1 className="text-lg mt-4 text-gray-300">Fetching your info...</h1>
        </Box>
    )
}

export default Loading
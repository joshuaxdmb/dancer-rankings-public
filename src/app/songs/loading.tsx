'use client';

import { BeatLoader } from 'react-spinners';

import Box from '../components/global/Box';

const Loading = () => {
  return (
    <Box className="h-full flex items-center justify-center flex-col">
      <div className="w-full flex items-center justify-center flex-col h-screen">
        <div className="loader-container">
          <BeatLoader color="#FFFFFF" size={20} />
        </div>
        <h1 className="text-lg mt-4">Getting you the latest 🔥 tunes</h1>
      </div>
    </Box>
  );
};

export default Loading;

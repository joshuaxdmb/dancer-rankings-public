'use client';

import { BeatLoader } from 'react-spinners';

import Box from '../components/Box';

const Loading = () => {
  return (
    <Box className="h-full flex items-center justify-center flex-col">
          <BeatLoader color="#FFFFFF" size={20} />
        <h1 className="text-lg mt-4">The greatest songs have intros...</h1>
    </Box>
  );
};

export default Loading;

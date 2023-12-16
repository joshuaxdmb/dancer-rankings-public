import { SongLocal } from '@/types/types';
import Image from 'next/image';
import React from 'react';
type Props = {
  song: SongLocal;
  isPlaying: boolean;
};

const PlayingSong = ({ song, isPlaying }: Props) => {
  return (
    <div className="px-4 flex flex-row justify-between items-center w-full
    ">
        <Image alt='song-image' src={isPlaying?'/assets/icons/spotify.svg':'/assets/icons/spotify-white-icon.svg'} width={50} height={50}/>
      <div className={`flex flex-col pb-2 cursor-pointer text-left flex-grow truncate ml-2`}>
        <h2 className={`text-md w-full truncate ${isPlaying && 'text-green-500'}`}>{song.title}</h2>
        <p className="text-sm text-gray-300 w-full">{song.author}</p>
        <p className="text-xs text-gray-400 w-full">suggested by: {song.added_by}</p>
      </div>
    </div>
  );
};

export default PlayingSong;

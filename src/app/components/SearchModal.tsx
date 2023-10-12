import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IoMdClose, IoIosAddCircle } from 'react-icons/io';

type Props = {
  isOpen: boolean;
  songs: any[];
  addSong: (song: any) => void;
};

const SearchModal = ({ isOpen, songs, addSong }: Props) => {
  return (
    <div
      className={`${
        !isOpen ? 'hidden' : ''
      } z-0 drop-shadow-md border flex flex-col border-neutral-700 max-h-full h-auto md:max-h-[85vh] w-[90%] md:w-[90vh] md:max-w-[450px]
    rounded-md bg-neutral-800 p-[25px] pt-2 focus:outline-none overflow-y-scroll scrollbar-hide`}
    >
      {songs.map((song, index) => (
        <div
          className="py-6 border-b w-full text-left flex flex-row justify-between"
          key={index}
        >
          <span className="truncate w-[90%]">
            {song.name} -{' '}
            {song.artists?.map(
              (a: any, index: number) => `${index === 0 ? '' : ','} ${a.name}`
            )}
          </span>
          <IoIosAddCircle onClick={()=>{
            console.log('Adding song')
            addSong(song)
          }} className='hover:opacity-75 cursor-pointer' size={28} />{' '}
        </div>
      ))}
    </div>
  );
};

export default SearchModal;

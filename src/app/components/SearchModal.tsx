import { NonPremiumPlayer } from '@/classes/PlayerClass';
import { SongLocal, SpotifySong } from '@/types/types';
import React, { useEffect } from 'react';
import { IoIosAddCircle } from 'react-icons/io';

type Props = {
  isOpen: boolean;
  songs: SpotifySong[];
  addSong: (song: any) => void;
  handleSelectSong: (song: SongLocal) => void;
};

const SearchModal = ({ isOpen, songs, addSong, handleSelectSong }: Props) => {

  const handleSelect = (song: SpotifySong) =>{
    const artists = song.artists
      .map((a: any, index: number) => `${index === 0 ? '' : ','} ${a.name}`)
      .join('');

    handleSelectSong({
      title : song.name,
      spotify_id : song.id,
      added_by : 'You',
      image_path : song.album.images[0]?.url,
      author : artists,
    } as SongLocal)
  }

  return (
    <div
      className={`${
        !isOpen ? 'hidden' : ''
      } z-0 drop-shadow-md border flex flex-col border-neutral-700 max-h-full h-screen md:max-h-[85vh] w-[90%] md:w-[90vh] md:max-w-[450px]
    rounded-md bg-neutral-800 p-[25px] pt-2 focus:outline-none overflow-y-scroll scrollbar-hide`}
    >
      {songs.map((song, index) => (
        <div
          className="py-6 border-b w-full text-left flex flex-row justify-between"
          key={index}
        >
          <span onClick={()=>{handleSelect(song)}} className="truncate w-[90%]">
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

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
      preview_url: song.preview_url
    } as SongLocal)
  }

  return (
    <div
      className={`${
        !isOpen ? 'hidden' : ''
      } h-[65vh] z-0 drop-shadow-md flex flex-col border-0 w-[90%] md:w-[90vh] md:max-w-[450px] mb-20
    rounded-md bg-neutral-800 p-[25px] pt-2 focus:outline-none overflow-y-scroll scrollbar-hide`}
    >
      {songs.map((song, index) => (
        <div
          className="py-6 border-b w-full text-left flex flex-row justify-between"
          key={index}
        >
          <span onClick={()=>{handleSelect(song)}} className="truncate w-[90%] cursor-pointer">
            {song.name} -{' '}
            {song.artists?.map(
              (a: any, index: number) => `${index === 0 ? '' : ','} ${a.name}`
            )}
          </span>
          <IoIosAddCircle onClick={()=>{
            addSong(song)
          }} className='hover:opacity-75 cursor-pointer' size={28} />{' '}
        </div>
      ))}
    </div>
  );
};

export default SearchModal;

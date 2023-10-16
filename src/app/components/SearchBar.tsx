import React, { useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';
import { IoMdClose } from 'react-icons/io';
import SearchModal from './SearchModal';
import toast from 'react-hot-toast';
import { SpotifySong } from '@/types/types';
import { useRouter } from 'next/navigation';

type Props = {
  spotifySession: any;
  spotifyApi: any;
  handleAddSong: (song: SpotifySong) => void;
};

const SearchBar = ({spotifyApi,spotifySession, handleAddSong}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchedSongs, setSearchedSongs] = useState<SpotifySong[]>([]);
  const router = useRouter();

  const handleSearch = (query: string) => {
    if(!spotifySession){
      toast.error('You must be logged in to spotify to search for a song', {
        id: 'failed-spotify-search',
      });
      return;
    }
    setSearchOpen(true);
    setSearchQuery(query);
    spotifyApi
      .searchTracks(query, { limit: 10 })
      .then((data: any) => {
        setSearchedSongs(data.body.tracks.items);
      })
      .catch((err: any) => {
        console.log('ERROR', err);
        if (err.statusCode === 401) {
          toast.error('Your spotify session expired. Refreshing', {
            id: 'failed-spotify-search',
          });
          router.refresh();
        }
      });
    console.log(searchedSongs);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
  }


  return (
    <div className='flex items-center w-full flex-col'>
      <div
        className={twMerge(
          'bg-white mx-4 rounded-full text-sm flex py-2 px-6 flex-row  transition cursor-pointer text-neutral-600 gap-1 w-11/12 sm:w-5/6 lg:w-1/2'
        )}
      >
        <HiSearch onClick={handleSearch} size={22} className="flex-shrink-0" />
        <input
          type="text"
          placeholder={`What song makes you want to dance? 💃`}
          className="bg-transparent outline-none flex border-none flex-grow"
          value={searchQuery}
          onChange={(e) => {
            const inputValue = (e.target as HTMLInputElement).value;
            handleSearch(inputValue);
          }}
        />
        <IoMdClose
          onClick={() => {
            setSearchQuery('');
            handleCloseSearch();
          }}
          size={22}
          className="flex-shrink-0"
        />
      </div>
      <div className="flex items-center justify-center mt-8 w-full">
        <SearchModal
          isOpen={searchOpen}
          songs={searchedSongs}
          addSong={handleAddSong}
        />
      </div>
    </div>
  );
};

export default SearchBar;

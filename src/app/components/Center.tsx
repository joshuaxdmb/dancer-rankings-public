import { LocationIdsEnum, PlaylistEnum } from '@/content';
import useSpotify from '@/hooks/useSpotify';
import React, { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';
import SearchModal from './SearchModal';
import { IoMdClose } from 'react-icons/io';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import SupabaseWrapper from '@/hooks/useSupabase';
import {
  Song,
  SongLocal,
  SongVoteLocal,
  SpotifySong,
  VotesMap,
} from '@/types/types';
import { useUser } from '@/hooks/useUser';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { locationAtom } from '@/atoms/locationAtom';
import { useRouter } from 'next/navigation';
import { songsAtom } from '@/atoms/songsAtom';
import SongItem from './SongItem';
import { votesByUserAtom } from '@/atoms/votesByUserAtom';
import { mergeSongs, mergeVotes, updateSongsVotes } from '@/utils/utils';

type Props = {
  playlistFilter: PlaylistEnum;
};

const Center = ({ playlistFilter }: Props) => {
  const { user, spotifySession } = useUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useRecoilState(locationAtom);
  const [songs, setSongs] = useRecoilState<any>(songsAtom);
  const [votes, setVotes] = useRecoilState<VotesMap>(votesByUserAtom);
  const [searchedSongs, setSearchedSongs] = useState<SpotifySong[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const supabaseClient = new SupabaseWrapper(useSupabaseClient());
  const router = useRouter();

  useEffect(() => {
    if (!songs[location] || !songs[location]?.[playlistFilter] || !songs[location]?.[playlistFilter]?.length) {
      console.log('here');
      supabaseClient
        .getVotedSongs(playlistFilter, location)
        .then((data: any) => {
          const updatedSongs = mergeSongs(
            songs,
            location,
            playlistFilter,
            data
          );
          setSongs(updatedSongs);
        });
    }
    if (Object.keys(votes).length < 1) {
      if (user) {
        const newVotes: VotesMap = {};
        supabaseClient.getVotedSongsByUser(user?.id).then((data: any) => {
          console.log('votes fetched', data);
          data.map((vote: SongVoteLocal) => {
            newVotes[vote.location_id as string] = {
              [vote.playlist_id as string]: {
                ...newVotes[vote.location_id as string]?.[
                  vote.playlist_id as string
                ],
                [vote.song_spotify_id as string]: vote.vote,
              },
            };
          });
          setVotes(newVotes);
          console.log(newVotes);
        });
      }
    }
  }, [user]); //eslint-disable-line

  const spotifyApi = useSpotify();
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
    console.log('close search');
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleAddSong = async (songDetails: SpotifySong) => {
    if (!user) {
      toast.error('You must be logged in to add a song', {
        id: 'failed-add-song-supabase',
      });
      return;
    }

    if (!spotifySession.user) {
      toast.error('You must be logged in to spotify to add a song', {
        id: 'failed-add-song-spotify',
      });
      return;
    }

    const artists = songDetails.artists
      .map((a: any, index: number) => `${index === 0 ? '' : ','} ${a.name}`)
      .join('');

    const existingSong = await supabaseClient.getSongBySpotifyId(
      songDetails.id
    );

    console.log('EXISTING SONG', existingSong);
    const insertLocalSong: SongLocal = {
      added_by: spotifySession.user.username,
      author: artists,
      image_path: songDetails.album.images[0]?.url || null,
      preview_url: songDetails.preview_url || null,
      spotify_id: songDetails.id,
      title: songDetails.name,
      up_votes: 1,
      down_votes: 0,
      total_votes: 1,
      playlist_id: playlistFilter,
      location_id: location,
    };

    if (existingSong.length) {
      //If song already exists in the db, just add it to the top of the list so user can vote
      toast.success('Song already exists', { id: 'song-exists' });
      const localSongExists = songs[location]?.[playlistFilter]?.find(
        (song: SongLocal) => song.spotify_id === songDetails.id
      );
      if (!localSongExists) {
        setSongs(mergeSongs(songs, location, playlistFilter, [insertLocalSong]));
      }
      return;
    } else {
      //Add song if it does not exist in the db, and also add locally
      const insertSong: Song = {
        added_by: spotifySession.user.username,
        author: artists,
        image_path: songDetails.album.images[0]?.url || null,
        preview_url: songDetails.preview_url || null,
        spotify_id: songDetails.id,
        title: songDetails.name,
      };

      supabaseClient
        .addSong(insertSong)
        .then((data: any) => {
          if (data.status !== 201) {
            toast.error('Failed to add song', {
              id: 'failed-add-song-supabase',
            });
          } else {
            toast.success('Song added!', { id: 'song-added' });
            setSongs(mergeSongs(songs, location, playlistFilter, [insertLocalSong]));
          }
        })
        .catch((e: any) => {
          console.log('Failed to add song', e);
        });

      supabaseClient
        .voteSong(insertSong.spotify_id, user.id, location, playlistFilter, 1)
        .then((data: any) => {
          const newVotes = {
            ...votes,
            [location]: {
              [playlistFilter]: {
                ...votes[location]?.[playlistFilter],
                [insertSong.spotify_id]: 1,
              },
            },
          };
          setVotes(newVotes);
        })
        .catch((e: any) => {
          console.log('Failed to vote for song', e);
        });
    }
  };

  const handleVote = async (song: SongLocal, vote: number) => {
    if (!user) {
      toast.error('You must be logged in to upvote a song', {
        id: 'failed-upvote-song-supabase',
      });
      return;
    }
    supabaseClient
      .voteSong(song.spotify_id, user.id, location, playlistFilter, vote)
      .then((data: any) => {
        console.log('Voted for song', data);
        const newVotes = mergeVotes(votes, location, playlistFilter, song.spotify_id, vote)
        setVotes(newVotes);

        const newSongs = updateSongsVotes(songs, song, location, playlistFilter, song.spotify_id, vote)
        setSongs(newSongs);
      })
      .catch((e: any) => {
        console.log('Failed to vote for song', e);
      });
  };

  return (
    <div>
      <section className="flex items-center justify-center space-x-7">
        <div
          className={twMerge(
            'bg-white mx-4 rounded-full text-sm flex py-2 px-6 flex-row  transition cursor-pointer text-neutral-600 gap-1'
          )}
        >
          <HiSearch
            onClick={handleSearch}
            size={22}
            className="flex-shrink-0"
          />
          <input
            type="text"
            placeholder={`What song makes you want to dance? 💃`}
            className="bg-transparent outline-none border-none flex-grow min-w-[260px]"
            value={searchQuery}
            onChange={(e) => {
              const inputValue = (e.target as HTMLInputElement).value;
              handleSearch(inputValue);
            }}
          />
          <IoMdClose
            onClick={handleCloseSearch}
            size={22}
            className="flex-shrink-0"
          />
        </div>
      </section>
      <section>
        {searchOpen && (
          <div className="flex items-center justify-center mt-4 w-full">
            <SearchModal
              isOpen={searchOpen}
              songs={searchedSongs}
              addSong={handleAddSong}
            />
          </div>
        )}
        <div className='mt-4'>
          {songs[location]?.[playlistFilter]?.map(
            (song: SongLocal, index: number) => (
              <SongItem
                key={index}
                song={song}
                onVote={handleVote}
                userVote={
                  votes?.[location]?.[playlistFilter]?.[song.spotify_id]
                }
              />
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Center;

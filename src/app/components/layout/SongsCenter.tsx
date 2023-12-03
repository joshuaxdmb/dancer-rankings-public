import { useSpotify } from '@/hooks/useSpotify';
import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
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
import { songsAtom } from '@/atoms/songsAtom';
import SongItem from '../SongItem';
import { votesByUserAtom } from '@/atoms/votesByUserAtom';
import { mergeSongs, mergeVotes, updateSongsVotes } from '@/app/songs/songsUtils';
import { currentTrackAtom, isPlayingAtom } from '@/atoms/playingSongAtom';
import SearchBar from '../SearchBar';
import { BeatLoader } from 'react-spinners';
import { useSupabase } from '@/hooks/useSupabase';

type Props = {
  playlist: string;
};

const Center = ({playlist}: Props) => {
  const { user } = useUser();
  const { spotifyApi, userDetails } = useSpotify();
  const [location] = useRecoilState(locationAtom);
  const [songs, setSongs] = useRecoilState<any>(songsAtom);
  const [userVotes, setUserVotes] = useRecoilState<VotesMap>(votesByUserAtom);
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackAtom);
  const supabaseClient = useSupabase()
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);

  useEffect(() => {
    !isLoading && setIsLoading(true);
    if (
      !songs[location] ||
      !songs[location]?.[playlist] ||
      !songs[location]?.[playlist]?.length
    ) {
      supabaseClient
        .getVotedSongs(playlist, location)
        .then((data: any) => {
          const updatedSongs = mergeSongs(songs, location, playlist, data);
          setSongs(updatedSongs);
        })
        .catch((e: any) => {
          toast.error('Failed to fetch songs', { id: 'failed-fetch-songs' });
          setIsLoading(false);
        });
    }
    if (Object.keys(userVotes).length < 1) {
      if (user) {
        supabaseClient
          .getVotedSongsByUser(user?.id)
          .then((data: any) => {
            console.log(data.length, 'votes fetched');
            const transformedVotes = data.reduce(
              (acc: VotesMap, vote: SongVoteLocal) => {
                if (!acc[vote.location_id]) {
                  acc[vote.location_id] = {};
                }
                if (!acc[vote.location_id][vote.playlist_id]) {
                  acc[vote.location_id][vote.playlist_id] = {};
                }
                acc[vote.location_id][vote.playlist_id][vote.song_spotify_id] =
                  vote.vote;
                return acc;
              },
              {}
            );
            setUserVotes(transformedVotes);
          })
          .catch((e: any) => {
            toast.error('Failed to fetch votes', { id: 'failed-fetch-votes' });
            setIsLoading(false);
          });
      }
    }
    setIsLoading(false);
  }, [user, playlist, location]); //eslint-disable-line

  const selectSong = (song: SongLocal) => {
    if(song !== currentTrack){
      setIsPlaying(true)
    }
    setCurrentTrack(song);

  };

  const handleAddSong = async (songDetails: SpotifySong) => {
    if (!user) {
      toast.error('You login to add a song', {
        id: 'failed-add-song-supabase',
      });
      return;
    }

    if (!userDetails?.display_name) {
      toast.error('You must log into spotify to add a song', {
        id: 'failed-add-song-spotify',
      });
      return;
    }

    const artists = songDetails.artists
      .map((a: any, index: number) => `${index === 0 ? '' : ','} ${a.name}`)
      .join('');

    const insertLocalSong: SongLocal = {
      added_by: userDetails.display_name,
      author: artists,
      image_path: songDetails.album.images[0]?.url || null,
      preview_url: songDetails.preview_url || null,
      spotify_id: songDetails.id,
      title: songDetails.name,
      up_votes: 1,
      down_votes: 0,
      total_votes: 1,
      playlist_id: playlist,
      location_id: location,
    };

    const insertSong: Song = {
      added_by: userDetails.display_name,
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
        }
      })
      .catch((e: any) => {
        console.log('Failed to add song', e);
      });

    supabaseClient
      .voteSong(insertSong.spotify_id, user.id, location, playlist, 1)
      .then((data: any) => {
        const newVotes = {
          ...userVotes,
          [location]: {
            [playlist]: {
              ...userVotes[location]?.[playlist],
              [insertSong.spotify_id]: 1,
            },
          },
        };
        setUserVotes(newVotes);
      })
      .catch((e: any) => {
        console.log('Failed to vote for song', e);
      });

    const localSongExists = songs[location]?.[playlist]?.find(
      (song: SongLocal) => song.spotify_id === songDetails.id
    );
    if (!localSongExists) {
      setSongs(mergeSongs(songs, location, playlist, [insertLocalSong]));
    }
  };

  const handleVote = async (song: SongLocal, vote: number) => {
    if (!user) {
      toast.error('You must log in to upvote a song', {
        id: 'failed-upvote-song-supabase',
      });
      return;
    }

    if (userVotes?.[location]?.[playlist]?.[song.spotify_id] === vote) return;

    supabaseClient
      .voteSong(song.spotify_id, user.id, location, playlist, vote)
      .then((data: any) => {
        console.log('Voted for song', data);
        const newVotes = mergeVotes(
          userVotes,
          location,
          playlist,
          song.spotify_id,
          vote
        );
        setUserVotes(newVotes);
        const currentVote =
        userVotes?.[location]?.[playlist]?.[song.spotify_id] || 0;
        const newSongs = updateSongsVotes(
          songs,
          location,
          playlist,
          song.spotify_id,
          vote,
          currentVote
        );
        setSongs(newSongs);
      })
      .catch((e: any) => {
        console.log('Failed to vote for song', e);
      });
  };

  return (
    //TODO:check overscroll
    <div className="flex flex-col h-5/6">
      <section className="flex items-center justify-center space-x-7">
        <SearchBar
          handleAddSong={handleAddSong}
          spotifyApi={spotifyApi}
          userDetails={userDetails}
          handleSelectSong={selectSong}
        />
      </section>
      <section className='flex flex-col overflow-y-auto'>
        {isLoading ? (
          <div className="w-full flex items-center justify-center flex-col h-screen">
            <div className="loader-container">
              <BeatLoader color="#FFFFFF" size={20} />
            </div>
            <h1 className="text-lg mt-4">Getting you the latest 🔥 tunes</h1>
          </div >
        ) : songs[location]?.[playlist]?.length ? (
          <div className='overflow-y-auto pb-20 scrollbar-hide'>
            {songs[location]?.[playlist]?.map(
              (song: SongLocal, index: number) => (
                <SongItem
                  key={index}
                  song={song}
                  onVote={handleVote}
                  onSelect={selectSong}
                  userVote={userVotes?.[location]?.[playlist]?.[song.spotify_id]}
                  isPlaying={currentTrack?.spotify_id === song.spotify_id}
                />
              )
            )}
          </div>
        ) : (
          <div className="text-xl text-center text-gray-300 flex items-center justify-center mb-10 h-screen ">
            <h1>{`No songs found :( Try adding one!`}</h1>
          </div>
        )}
      </section>
    </div>
  );
};

export default Center;

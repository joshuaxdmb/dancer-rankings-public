import { PlaylistEnum } from '@/content';
import { useSpotify } from '@/hooks/useSpotify';
import React, { useEffect, useState } from 'react';
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
import { songsAtom } from '@/atoms/songsAtom';
import SongItem from './SongItem';
import { votesByUserAtom } from '@/atoms/votesByUserAtom';
import { mergeSongs, mergeVotes, updateSongsVotes } from '@/utils/utils';
import { currentTrackAtom, isPlayingAtom } from '@/atoms/playingSongAtom';
import SearchBar from './SearchBar';
import { playlistAtom } from '@/atoms/playlistAtom';
import { BeatLoader } from 'react-spinners';

type Props = {
  playlistFilter?: PlaylistEnum;
};

const Center = ({}: Props) => {
  const { user } = useUser();
  const { spotifySession, spotifyApi } = useSpotify();
  const [location] = useRecoilState(locationAtom);
  const [songs, setSongs] = useRecoilState<any>(songsAtom);
  const [votes, setVotes] = useRecoilState<VotesMap>(votesByUserAtom);
  const [playlist] = useRecoilState<PlaylistEnum>(playlistAtom);
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackAtom);
  const supabaseClient = new SupabaseWrapper(useSupabaseClient());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) setIsLoading(false);
  }, [songs]); //eslint-disable-line

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
    if (Object.keys(votes).length < 1) {
      if (user) {
        const newVotes: VotesMap = {};
        supabaseClient
          .getVotedSongsByUser(user?.id)
          .then((data: any) => {
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
          })
          .catch((e: any) => {
            toast.error('Failed to fetch votes', { id: 'failed-fetch-votes' });
            setIsLoading(false);
          });
      }
    }
  }, [user, playlist, location]); //eslint-disable-line

  const selectSong = (song: SongLocal) => {
    setCurrentTrack(song);
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
      playlist_id: playlist,
      location_id: location,
    };

    if (existingSong.length) {
      //If song already exists in the db, just add it to the top of the list so user can vote
      toast.success('Song already exists', { id: 'song-exists' });
      const localSongExists = songs[location]?.[playlist]?.find(
        (song: SongLocal) => song.spotify_id === songDetails.id
      );
      if (!localSongExists) {
        setSongs(mergeSongs(songs, location, playlist, [insertLocalSong]));
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
            setSongs(mergeSongs(songs, location, playlist, [insertLocalSong]));
          }
        })
        .catch((e: any) => {
          console.log('Failed to add song', e);
        });

      supabaseClient
        .voteSong(insertSong.spotify_id, user.id, location, playlist, 1)
        .then((data: any) => {
          const newVotes = {
            ...votes,
            [location]: {
              [playlist]: {
                ...votes[location]?.[playlist],
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

    if (votes?.[location]?.[playlist]?.[song.spotify_id] === vote) return;

    supabaseClient
      .voteSong(song.spotify_id, user.id, location, playlist, vote)
      .then((data: any) => {
        console.log('Voted for song', data);
        const newVotes = mergeVotes(
          votes,
          location,
          playlist,
          song.spotify_id,
          vote
        );
        setVotes(newVotes);
        const currentVote =
          votes?.[location]?.[playlist]?.[song.spotify_id] || 0;
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
    <div className="h-full mb-20">
      <section className="flex items-center justify-center space-x-7 mb-0">
        <SearchBar
          handleAddSong={handleAddSong}
          spotifyApi={spotifyApi}
          spotifySession={spotifySession}
        />
      </section>
      <section>
          {isLoading ? (
            <div className="w-full flex items-center justify-center flex-col h-screen">
              <div className="loader-container">
                <BeatLoader color="#FFFFFF" size={20} />
              </div>
              <h1 className="text-lg mt-4">Getting you the latest 🔥 tunes</h1>
            </div>
          ) : songs[location]?.[playlist]?.length ? (
            <div>{
            songs[location]?.[playlist]?.map(
              (song: SongLocal, index: number) => (
                <SongItem
                  key={index}
                  song={song}
                  onVote={handleVote}
                  onSelect={selectSong}
                  userVote={votes?.[location]?.[playlist]?.[song.spotify_id]}
                  isPlaying={currentTrack?.spotify_id === song.spotify_id}
                />
              )
            )}
            </div>
          ) : (
            <div className="text-xl text-center text-gray-300 flex items-center justify-center mb-10">
              <h1>{`No songs found :( Try adding one!`}</h1>
            </div>
          )}
      </section>
    </div>
  );
};

export default Center;

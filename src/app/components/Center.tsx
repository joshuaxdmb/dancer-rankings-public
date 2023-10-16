import { PlaylistEnum } from '@/content';
import {useSpotify} from '@/hooks/useSpotify';
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

type Props = {
  playlistFilter: PlaylistEnum;
};

const Center = ({ playlistFilter }: Props) => {
  const { user } = useUser();
  const { spotifySession, togglePlay, spotifyApi, spotifyDeviceId } = useSpotify();
  const [location] = useRecoilState(locationAtom);
  const [songs, setSongs] = useRecoilState<any>(songsAtom);
  const [votes, setVotes] = useRecoilState<VotesMap>(votesByUserAtom);
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackAtom)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const supabaseClient = new SupabaseWrapper(useSupabaseClient());

  useEffect(() => {
    spotifyApi.transferMyPlayback([spotifyDeviceId]).catch(e=>{
      console.log('Error setting device on Spotify',e)
    })

    if(spotifySession?.user.product === 'premium'){
     // setPreviewPlayerLogic
    }
  },[spotifyDeviceId, spotifyApi, spotifySession])

  const playSong = async(song: SongLocal) => {
    console.log('Currently playing', currentTrack?.title)

    if(currentTrack?.spotify_id === song.spotify_id && isPlaying){
      spotifyApi.pause().catch((err: any) => {
        console.log('Something failed pausing from Spotify',err)
      })
      return
    }

    spotifyApi.transferMyPlayback([spotifyDeviceId]).then(()=>{
      spotifyApi.play({uris: [`spotify:track:${song.spotify_id}`]}).catch((err: any) => {
        console.log('Something failed playing from Spotify',err)
      })
      setCurrentTrack(song)
    }).catch(e=>{
      console.log('Error setting device on Spotify',e)
    })
  }

  useEffect(() => {
    if (!songs[location] || !songs[location]?.[playlistFilter] || !songs[location]?.[playlistFilter]?.length) {
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

    if(votes?.[location]?.[playlistFilter]?.[song.spotify_id] === vote) return

    supabaseClient
      .voteSong(song.spotify_id, user.id, location, playlistFilter, vote)
      .then((data: any) => {
        console.log('Voted for song', data);
        const newVotes = mergeVotes(votes, location, playlistFilter, song.spotify_id, vote)
        setVotes(newVotes);
        const currentVote = votes?.[location]?.[playlistFilter]?.[song.spotify_id] || 0
        const newSongs = updateSongsVotes(songs, location, playlistFilter, song.spotify_id, vote, currentVote)
        setSongs(newSongs);
      })
      .catch((e: any) => {
        console.log('Failed to vote for song', e);
      });
  };

  return (
    <div>
      <section className="flex items-center justify-center space-x-7 mb-0">
        <SearchBar handleAddSong={handleAddSong} spotifyApi={spotifyApi} spotifySession={spotifySession}/>
      </section>
      <section>
        <div className='mt-2'>
          {songs[location]?.[playlistFilter]?.map(
            (song: SongLocal, index: number) => (
              <SongItem
                key={index}
                song={song}
                onVote={handleVote}
                onPlay = {playSong}
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

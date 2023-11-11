import { LocationIdsEnum } from "@/content";
import { EventLocalType, Song, SongLocal, UserSignUpType } from "@/types/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Provider } from "@supabase/supabase-js";

class SupabaseWrapper {
    private client: SupabaseClient;

    constructor(client: SupabaseClient) {
        this.client = client;
    }

    async SignInWithProvider(provider: Provider) {
        const { data, error } = await this.client.auth.signInWithOAuth({
            provider: provider,
            options: {
                queryParams: {
                  access_type: 'offline',
                  prompt: 'consent',
                },
              },
        })

        //By convention, handle the error at the highest UI level to provide
        //the best user experience and context.
        if (error) {
            throw error
        }

        return { data, error }
    }

    async getUserByEmail(email: string) {
        return await this.client
            .from('users')
            .select('*')
            .eq('email', email);
    }

    async updateUser(userId: string, insertData: any) {

        return await this.client
            .from('users')
            .update([insertData])
            .eq('id', userId);
    }

    async getVotedSongsByUser(user_id: string) {
        try {
            const { data, error } = await this.client
                .from('songs_votes')
                .select('song_spotify_id, vote, location_id, playlist_id')  // This line ensures only these columns are fetched
                .eq('user_id', user_id)

            if (error) {
                console.error('Error fetching voted songs:', error);
                return [];
            }

            return data; // return the fetched songs data

        } catch (err) {
            console.error('Error executing getVotedSongsByUser:', err);
            return [];
        }
    }

    async getVotedEventsByUser(user_id: string) {
        try {
            const { data, error } = await this.client
                .from('events_votes')
                .select('event_id')  // This line ensures only these columns are fetched
                .eq('user_id', user_id)

            if (error) {
                console.error('Error fetching voted events:', error);
                return [];
            }

            return data; // return the fetched songs data

        } catch (err) {
            console.error('Error executing getVotedEventsByUser:', err);
            return [];
        }
    }

    async getVotedSongs(playlist_id: string, location_id: LocationIdsEnum) {
        try {
            const { data, error } = await this.client.rpc('get_voted_songs', { p_playlist_id: playlist_id, p_location_id: location_id });

            if (error) {
                console.error('Error fetching voted songs:', error);
                return [];
            }

            return data as SongLocal[]; // return the fetched songs data

        } catch (err) {
            console.error('Error executing getVotedSongs:', err);
            return [];
        }
    }

    async getVotedEvents(location_id: LocationIdsEnum) {
        try {
            const { data, error } = await this.client.rpc('get_voted_events', { p_location_id: location_id })
            if (error) {
                console.error('Error fetching voted events!:', error);
                return [];
            }

            return data as EventLocalType[]
        } catch (err) {
            console.error('Error executing getVotedEvents:', err);
            return [];
        }
    }

    async voteSong(songSpotifyId: string, userId: string, location: LocationIdsEnum, playlist_id: string, vote: number) {
        return await this.client
            .from('songs_votes')
            .upsert([
                {
                    vote: vote,
                    user_id: userId,
                    location_id: location,
                    song_spotify_id: songSpotifyId,
                    created_at: new Date().toISOString(),
                    playlist_id: playlist_id
                }
            ])
    }

    async voteEvent(eventId: string, userId: string) {

        try {
            const { data, error } = await this.client
                .from('events_votes')
                .upsert([
                    {
                        event_id: eventId,
                        user_id: userId,
                        vote: 1,
                        created_at: new Date().toISOString(),
                    }
                ])

            if (error) {
                throw error; // or return an error object/message if you prefer
            }
        } catch (err) {
            console.error('Error executing voteEvent:', err);
            throw err; // or return an error object/message if you prefer
        }
    }

    async deleteVoteEvent(eventId: string, userId: string) {
        try {
            const { data, error } = await this.client
                .from('events_votes')
                .delete()
                .eq('user_id', userId)
                .eq('event_id', eventId)

            if (error) {
                throw error; // or return an error object/message if you prefer
            }
        } catch (err) {
            console.error('Error executing deleteVoteEvent:', err);
            throw err; // or return an error object/message if you prefer
        }
    }

    async deleteVoteSong(songSpotifyId: string, userId: string, location: LocationIdsEnum) {
        try {
            const { data, error } = await this.client
                .from('songs_votes')
                .delete()
                .eq('user_id', userId)
                .eq('location_id', location)
                .eq('song_spotify_id', songSpotifyId)

            if (error) {
                console.error('Error deleting upvote:', error);
                throw error; // or return an error object/message if you prefer
            }
        } catch (err) {
            console.error('Error executing deleteUpVoteSong:', err);
            throw err; // or return an error object/message if you prefer
        }
    }

    async signUp(user: UserSignUpType) {

        const signUpData = {
            email: user.email,
            password: user.password,
            options: {
                data: {
                    full_name: user.full_name,
                    default_location: user.default_location,
                    gender: user.gender,
                    primary_dance_role: user.primary_dance_role,
                    lead_level: user.lead_level,
                    follow_level: user.follow_level,
                }
            }

        }
        console.log('Singup data', signUpData)
        const { data, error } = await this.client.auth.signUp(signUpData)

        if (error) {
            console.error('Failed to signup in Supabase', error)
        }

        return { data, error }
        // const { data: userData, error: error2 } = await this.client.from('users').insert([
        //     {
        //         full_name: user.full_name,
        //         email: user.email,
        //         default_location: user.default_location,
        //         gender: user.gender,
        //         primary_dance_role: user.primary_dance_role,
        //         lead_level: user.lead_level,
        //         follow_level: user.follow_level,
        //     }
        // ])

        // return { userData, error2 }
    }

    async getSongBySpotifyId(spotifyId: string) {
        try {
            const { data } = await this.client
                .from('songs')
                .select('*')
                .eq('spotify_id', spotifyId);
            console.log('Fetched song', data)
            return data


        } catch (error) {
            console.error('Error fetching song', error)
        }

    }

    async signIn(email: string, password: string) {
        return await this.client.auth.signInWithPassword({
            email: email,
            password: password,
        });
    }

    async addSong(song: Song) {
        return await this.client
            .from('songs')
            .upsert([song])
    }


}

export default SupabaseWrapper;

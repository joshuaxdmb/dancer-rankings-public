import { LocationIdsEnum, PlaylistEnum } from "@/content";
import { Song } from "@/types/types";

class SupabaseWrapper {
    private client: any; // Using 'any' since the exact type wasn't specified

    constructor(client: any) {
        this.client = client;
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

    async getVotedSongs(playlist_id: PlaylistEnum, location_id: LocationIdsEnum) {
        try {
            const { data, error } = await this.client.rpc('get_voted_songs', { p_playlist_id: playlist_id, p_location_id: location_id });

            if (error) {
                console.error('Error fetching voted songs:', error);
                return [];
            }

            return data; // return the fetched songs data

        } catch (err) {
            console.error('Error executing getVotedSongs:', err);
            return [];
        }
    }


    async voteSong(songSpotifyId: string, userId: string, location: LocationIdsEnum, playlist_id:PlaylistEnum, vote: number) {
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

            return data;
        } catch (err) {
            console.error('Error executing deleteUpVoteSong:', err);
            throw err; // or return an error object/message if you prefer
        }
    }

    async signUp(email: string, password: string) {
        return await this.client.auth.signUp({
            email: email,
            password: password,
        });
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

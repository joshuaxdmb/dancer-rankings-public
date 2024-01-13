import { getUrl } from "@/lib/helpers";
import { LocationIdsEnum } from "../../content";
import { EventByVotesType, ProductWithPrice, Song, SongLocal, UserSignUpType } from "@/types/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Provider } from "@supabase/supabase-js";
import { EventType } from "@/types/types";

class SupabaseWrapper {
    private client: SupabaseClient;

    constructor(client: SupabaseClient) {
        this.client = client;
    }

    async exchangeCodeForSession(code: string) {
        await this.client.auth.exchangeCodeForSession(code)
    }

    async setSession (access_token:string, refresh_token:string) {
        await this.client.auth.setSession({access_token, refresh_token})
    }

    async vote10x (songSpotifyId: string, userId: string, partyId: string) {
        //First check if user has 10x votes not consumer
        const {data: orders, error} = await this.client
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .eq('consumed_at', null)
        .eq('product_name','Vote Booster 10x')

        if(error){
            console.error('Error fetching orders', error)
            throw error
        }

        if(orders.length < 1){
            return {error: 'Not vote boosters available'}
        }

        //Then add 10x votes to song
        const {data:vote, error:voteError} = await this.voteSong(songSpotifyId, userId, LocationIdsEnum.global, partyId, 10)

        if(voteError){
            console.error('Error voting song', voteError)
            throw voteError
        }
        //Then consume 10x vote
        const {data: consume, error: consumeError} = await this.client
        .from('orders')
        .upsert([{
            id: orders[0].id,
            consumed_at: new Date().toISOString()
        }])

        if(consumeError){
            console.error('Error consuming vote', consumeError)
            throw consumeError
        }
    }

    async getProductsWithPrices(productName?: string) {
        let data, error
        if (!productName) {
            ({ data, error } = await this.client
                .from('products')
                .select('*, prices(*)')
                .eq('active', true)
                .eq('prices.active', true)
                .order('metadata->index')
                .order('unit_amount', { foreignTable: 'prices' }))
        } else {
            ({ data, error } = await this.client
                .from('products')
                .select('*, prices(*)')
                .eq('name', productName) // Added filter for productName
                .eq('active', true)
                .eq('prices.active', true)
                .order('metadata->index')
                .order('unit_amount', { foreignTable: 'prices' }))
        }


        if (error) {
            console.log('Error fetching products', error)
            throw error
        }

        return data as ProductWithPrice[]
    }



    async checkPartyExists(partyId: string) {
        const { data, error } = await this.client
            .from('playlists')
            .select('*')
            .eq('id', partyId)

        if (error) {
            throw error;
        }

        if (data?.length > 0) {
            return true
        }
        return false
    }

    async getParty(userId: string) {
        //First check if there was a party created within the last 24 hours
        const recentParty = await this.getRecentParty(userId)
        if (!recentParty) {
            return await this.createParty(userId)
        }
        return recentParty
    }

    async getRecentParty(userId: string) {
        console.log('getting recent party')
        const twentyFourHoursAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

        let { data, error } = await this.client
            .from('playlists')
            .select('*')
            .eq('owner_id', userId)
            .gte('created_at', twentyFourHoursAgo.toISOString()) // Greater than or equal to 24 hours ago
            .order('created_at', { ascending: false })

        if (error) {
            throw error;
        }

        return data?.[0];

    }

    async createEvent(event: EventType) {
        const { data, error } = await this.client
            .from('events')
            .insert([event])

        if (error) {
            throw error;
        }

        return data;
    }

    async createParty(userId: string) {
        console.log('Creating party')
        const { data, error: error1 } = await this.client.from('playlists').insert([
            {
                owner_id: userId,
            }
        ])
        if (error1) {
            throw error1
        }
        //When party is created, it does not return the id, so we need to fetch it again
        console.log('Created party', data)
        const { data: newParty, error: error2 } = await this.client.from('playlists').select('*').eq('owner_id', userId).order('created_at', { ascending: false }).single()

        if (error2) {
            throw error2
        }
        return newParty
    }

    async signInWithProvider(provider: Provider, isNewUser: boolean) {
        const redirectUrl = isNewUser ? getUrl() + 'account' : getUrl()
        const { data, error } = await this.client.auth.signInWithOAuth({
            provider: provider,
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                redirectTo: redirectUrl
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

            return data as EventByVotesType[]
        } catch (err) {
            console.error('Error executing getVotedEvents:', err);
            return [];
        }
    }

    async getEventById(eventId: string) {
        try {
            const { data, error } = await this.client
                .from('events')
                .select('*')
                .eq('id', eventId)

            if (error) {
                throw error;
            }

            return data?.[0];

        } catch (err) {
            console.error('Error executing getEventById:', err);
            throw err;
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

export default SupabaseWrapper
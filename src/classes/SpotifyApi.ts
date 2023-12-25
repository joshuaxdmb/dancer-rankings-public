import { SongLocal } from '@/types/types'
import SpotifyWebApi from 'spotify-web-api-node'
import { LocationIdsEnum } from '../../content'

interface Credentials {
    accessToken?: string | undefined
    clientId?: string | undefined
    clientSecret?: string | undefined
    redirectUri?: string | undefined
    refreshToken?: string | undefined
}

// Extend the SpotifyWebApi class
class SpotifyApi extends SpotifyWebApi {
    constructor(credentials?: Credentials) {
        super(credentials)
    }

    public async findSpotifyPlaylist(partyId: string) {
        const res = await this.getUserPlaylists()
        const playlists = res.body
        const playlist = playlists.items.find((playlist) => playlist.name === `Dancers App: ${partyId}`)
        return playlist
    }

    public async createSpotifyPlaylist(partyId: string) {
        const playlist = await this.createPlaylist(`Dancers App: ${partyId}`, {
            description: 'Dancers App Playlist',
        })
        console.log('Created playlist', playlist.body)
        return playlist.body
    }

    public async updateSpotifyPlaylist(playlistId:string, playlistSongs: SongLocal[]){
        let existingPlaylist = await this.findSpotifyPlaylist(playlistId)
        let spotifyPlaylist = existingPlaylist ? existingPlaylist : await this.findSpotifyPlaylist(playlistId)
        const uris = playlistSongs.map((song) => 'spotify:track:' + song.spotify_id)
        const res = await this.replaceTracksInPlaylist(spotifyPlaylist.id, uris)
        return {res, spotifyPlaylist}
      }
}

export default SpotifyApi

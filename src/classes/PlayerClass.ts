import { SongLocal } from "@/types/types";
import toast from '@/lib/toast';

export abstract class Player {
    abstract play(song: SongLocal, position_ms?:number): void;
    abstract pause(): void;
    abstract stop(): void;
}

// 2. Derived PremiumPlayer class
export class PremiumPlayer extends Player {
    constructor(private spotifyApi: any, private spotifyDeviceId: string) {
        super();
    }

    play(song: SongLocal, position_ms?:number): void {
        console.log('Currently playing', song?.title,'on ',this.spotifyDeviceId);
        this.spotifyApi
            .transferMyPlayback([this.spotifyDeviceId])
            .then(() => {
                this.spotifyApi
                    .play({uris: [`spotify:track:${song.spotify_id}`], options:{position_ms},  })
                    .catch((err: any) => {
                        console.log('Something failed playing from Spotify', err);
                    });
            })
            .catch((e: any) => {
                console.log('Error setting device on Spotify', e);
            });
    }

    pause(): void {
        this.spotifyApi.pause();
    }

    stop(): void {
        this.spotifyApi.pause(); // Assuming the stop behavior for the premium user is the same as pause
    }
}

// 2. Derived NonPremiumPlayer class
export class NonPremiumPlayer extends Player {
    private audioInstance?: HTMLAudioElement;

    play(song: SongLocal, position_ms?:number): void {
        console.log('Currently previewing', song?.title);
        if(!song?.preview_url){
            toast.error('No preview available for this song. Spotify Premium needed');
            return
        }
        if(this.audioInstance){ 
            this.audioInstance.pause()
            this.audioInstance.remove()
        }
        this.audioInstance = new Audio(song?.preview_url || '');
        this.audioInstance.play();
    }

    pause(): void {
        this.audioInstance?.pause();
    }

    stop(): void {
        this.audioInstance?.pause();
        this.audioInstance = undefined; // Cleanup the instance if you want to mimic a stop behavior
    }
}


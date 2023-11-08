import { LocationIdsEnum, PlaylistEnum } from "@/content";
import Stripe from "stripe";
import { ClassOfferedByInstructor, DanceLevelsEnum, DanceRolesEnum } from "./danceClassesTypes";

//Music
export interface UserDetailsType {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    avatar_url?: Stripe.Address;
    payment_meethod?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
    email?: string;
    payment_method:null
    votes_bachata_songs?:string
    votes_events?:string
    votes_salsa_songs?:string
    votes_zouk_songs?:string
    billing_address?: Stripe.Address;
    default_location?:string

}

export interface Song {
    added_by: string | null
    author: string | null
    created_at?: string
    image_path: string | null
    preview_url: string | null
    spotify_id: string
    title: string | null
}

export interface SongLocal {
    added_by: string | null
    author: string | null
    image_path: string | null
    preview_url: string | null
    spotify_id: string
    title: string | null
    up_votes: number
    down_votes: number
    location_id: string
    playlist_id: PlaylistEnum
    total_votes: number
}

export interface SongVoteLocal {
    song_spotify_id: string
    user_id: string
    location_id: string
    playlist_id: PlaylistEnum
    vote: number
}

export interface VotesMap {
    [location_id: string]: {
        [playlist_id: string]: {
            [song_spotify_id: string]: number;
        };
    };
};

export interface SpotifySong{
    album: any;
    artists: any[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: any;
    external_urls: any;
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
}

//Subscriptions

export enum SubscriptionStatusEnum {
    ACTIVE = 'active',
    PAST_DUE = 'past_due',
    CANCELED = 'canceled',
    INCOMPLETE = 'incomplete',
    INCOMPLETE_EXPIRED = 'incomplete_expired',
    TRIALING = 'trialing',
    UNPAID = 'unpaid'
}

export interface SubscriptionType {
    id: string;
    user_id: string;
    status?: Stripe.Subscription.Status;
    metadata?: Stripe.Metadata;
    price_id?: string;
    quantity?: number;
    cancel_at_period_end?: boolean;
    created: string;
    current_period_start: string;
    current_period_end: string;
    ended_at?: string;
    cancel_at?: string;
    canceled_at?: string;
    trial_start?: string;
    trial_end?: string;
    prices?: Price;
}

export interface Price {
    id: string;
    product_id?: string;
    active?: boolean;
    description?: string;
    unit_amount?: number;
    currency?: string;
    type?: Stripe.Price.Type
    interval?: Stripe.Price.Recurring.Interval;
    interval_count?: number;
    trial_period_days?: number | null;
    metadata?: Stripe.Metadata;
    products?: Product;

}

export interface Product {
    id: string;
    active?: boolean;
    name?: string;
    description?: string;
    image?: string;
    metadata?: Stripe.Metadata
}

export interface ProductWithPrice extends Product {
    prices?: Price[];
}

//Navigation

export enum Routes {
    Salsa = '/salsa',
    Bachata = '/bachata',
    Zouk = '/zouk',
    Home = '/',
    Events = '/events',
    Songs = '/songs',
    Classes = '/classes'
}

export type ActiveLink = {
    href: Routes;
    emoji: any,
    label: string,
    playlist?: PlaylistEnum
    icon?: any
};

export enum SupportedCommunities {
    Toronto = 'Toronto',
    NewYork = 'New York',
    Spain = 'Spain',
    Europe = 'Europe',
    LatinAmerica = 'Latin America',
    Global = 'Global'
}

export type User = {
    email: string,
    name: string,
    isEmailVerified: boolean,
    phone?: string,
    isPhoneVerified?: boolean,
    communities: Array<SupportedCommunities>
}

export enum GendersEnum {
    Male='Male',
    Female='Female',
    X='X'
}

export type UserSignUpType ={
    email: string,
    default_location: LocationIdsEnum,
    password: string,
    gender: GendersEnum,
    primary_dance_role: DanceRolesEnum,
    lead_level:DanceLevelsEnum,
    follow_level:DanceLevelsEnum,
    full_name: string,
}

export type EventVoteType = {
    id: string,
    event_id: string,
    vote: number,
    created_at: any
}

export type EventType = {
    created_at: any,
    label: string,
    venue: string,
    location_link?: string,
    event_site?:string,
    start_time: any,
    classes_included?: ClassOfferedByInstructor[],
    instructors: string,
    end_time: any,
    event_location:LocationIdsEnum
}

export type EventLocalType = {
    id: string,
    label: string,
    venue: string,
    location_link?: string,
    image_path?: string,
    event_site?:string,
    start_time: any,
    classes_included?: string,
    instructors: string,
    end_time: any,
    event_location:LocationIdsEnum,
    total_votes: number,
}
import Stripe from "stripe";

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

}

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

export enum Routes {
    Salsa = '/salsa',
    Bachata = '/bachata',
    Zouk = '/zouk',
    Home = '/',
    Events = '/events'
}

export type PlaylistInfo = {
    route: Routes;
    emoji: any,
    label: string,
};

export enum SupportedCommunities {
    Toronto = 'Toronto'
}

export type User = {
    email: string,
    name: string,
    isEmailVerified: boolean,
    phone?: string,
    isPhoneVerified?: boolean,
    communities: Array<SupportedCommunities>
}
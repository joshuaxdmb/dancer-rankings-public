import {loadStripe, Stripe} from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
    console.log('Getting Stripe');
    if (!stripePromise) {
        console.log("No stripe promise, initializing with key", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')
                        .catch(error => {
                            console.error("Error loading Stripe:", error);
                            return null;
                        });
    }
    console.log('Stripe promise:', stripePromise);
    return stripePromise;
};



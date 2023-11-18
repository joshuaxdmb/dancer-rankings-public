import { Price } from "@/types/types";
import { User } from '@supabase/auth-helpers-nextjs';
import Stripe from "stripe";

export const getUrl = () => {
    let url = process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
        'http://localhost:3000'

    url = url.includes('http') ? url : `https://${url}`
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
    return url
}

export const postData = async ({ url, data }: { url: string, data?: {price:Price, user:User, mode:Stripe.Checkout.SessionCreateParams.Mode, isNative:boolean}}) => {
    const fullUrl = `${getUrl()}${url}`
    console.log('PORT REQUEST', fullUrl, data)
    const res: Response = await fetch(fullUrl, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        credentials: 'same-origin',
        body: JSON.stringify(data ?? {})
    })

    if(!res.ok){
        console.log('Error posting data', {url, data, res})
        throw new Error(res.statusText)
    }

    return res.json()
}

export const toDateTime = (secs: number) => {
    const t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}



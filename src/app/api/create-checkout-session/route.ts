import { NextResponse} from "next/server";

import {stripe} from '@/lib/stripe'
import {getUrl} from '@/lib/helpers'
import { createOrRetrieveCustomer } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
    const {price, user, mode, quantity=1, metadata={}} = await request.json()
    try{
        const customer = await createOrRetrieveCustomer({
            uuid: user?.id || '',
            email: user?.email || ''
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            billing_address_collection: "required",
            customer,
            line_items:[
                {price:price.id,
                quantity,}
            ],
            mode,
            allow_promotion_codes: true,
            subscription_data:{
                metadata
            },
            success_url: `${getUrl()}/account`,
            cancel_url: `${getUrl()}`,
        })

        return NextResponse.json({sessionId: session.id})
    } catch (err: any){
        console.log('Error creating checkout session', err.message)
        return new NextResponse(
            'Internal Error',
            {status: 500}
        )
    }
}
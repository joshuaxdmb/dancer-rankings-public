import { NextResponse } from "next/server"
import { stripe } from '@/lib/stripe'
import { createOrRetrieveCustomer } from "@/lib/supabaseAdmin"
import {OPTIONS as _OPTIONS} from '@/lib/api'

export async function OPTIONS(req: Request, res:Response) {
    return _OPTIONS(req, res)
}

export async function POST(request: Request) {
    const { price, user, mode, isNative, quantity = 1, metadata = {} } = await request.json()
    const return_Url = isNative ? process.env.VOTE_BOOSTER_REDIRECT_URI_NATIVE : process.env.VOTE_BOOSTER_REDIRECT_URI_WEB
    try {
        const customer = await createOrRetrieveCustomer({
            uuid: user?.id || '',
            email: user?.email || ''
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            billing_address_collection: "required",
            customer,
            line_items: [
                {
                    price: price.id,
                    quantity,
                }
            ],
            mode,
            allow_promotion_codes: true,
            subscription_data: {
                metadata
            },
            success_url: return_Url,
            cancel_url: return_Url,
        })

        return NextResponse.json({ sessionId: session.id })
    } catch (err: any) {
        console.log('Error creating checkout session', err.message)
        return new NextResponse(
            'Internal Error',
            { status: 500 }
        )
    }
}
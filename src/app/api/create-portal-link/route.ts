import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"
import { stripe } from '@/lib/stripe'
import { getUrl } from '@/lib/helpers'
import { createOrRetrieveCustomer } from "@/lib/supabaseAdmin"
import {OPTIONS as _OPTIONS} from '@/lib/api'

export async function OPTIONS(req: Request, res:Response) {
    return _OPTIONS(req, res)
}

export async function POST() {
    try {
        const supabase = createRouteHandlerClient({
            cookies,
        })

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new Error('User not found')
        }

        const customer = await createOrRetrieveCustomer({
            uuid: user?.id || '',
            email: user?.email || ''
        })

        if (!customer) {
            throw new Error('Customer not found')
        }

        const { url } = await stripe.billingPortal.sessions.create({
            customer,
            return_url: `${getUrl()}/account`,
        })

        return NextResponse.json({ url })

    } catch (err: any) {
        console.log('Error creating checkout session', err.message)
        return new NextResponse(
            'Internal Error',
            { status: 500 }
        )
    }
}
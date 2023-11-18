import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import {
    upsertPriceRecrtord, upsertProductRecord, manageSubscriptionStatusChange, manageNewOrder
} from '@/lib/supabaseAdmin'

const relevantEvents = new Set([
    'product.created',
    'price.created',
    'price.updated',
    'product.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
])

export async function POST(
    request: Request,
) {
    const body = await request.text()
    const sig = request.headers.get('Stripe-Signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event: Stripe.Event
    try {
        if (!sig || !webhookSecret) return
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: any) {
        console.log('Error message', err.message)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    if (relevantEvents.has(event.type)) {
        try {
            switch (event.type) {
                case 'product.created':
                case 'product.updated':
                    await upsertProductRecord(event.data.object as Stripe.Product)
                    break
                case 'price.created':
                case 'price.updated':
                    await upsertPriceRecrtord(event.data.object as Stripe.Price)
                    break
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription
                    await manageSubscriptionStatusChange(
                        subscription.id,
                        subscription.customer as string,
                        event.type === 'customer.subscription.created'
                    )
                    break
                case 'checkout.session.completed':
                    const session = event.data.object as Stripe.Checkout.Session
                    if (session.mode === 'subscription') {
                        const subscriptionId = session.subscription
                        await manageSubscriptionStatusChange(
                            subscriptionId as string,
                            session.customer as string,
                            true
                        )
                    } else {
                        await manageNewOrder(
                            session.id,
                            session.customer as string,
                            false
                        )
                    }
                    break
                default:
                    throw new Error('Unhandled relevant event')
            }
        } catch (err: any) {
            console.log('Error message', err.message)
            return new NextResponse('Webhook Error', { status: 400 })
        }
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
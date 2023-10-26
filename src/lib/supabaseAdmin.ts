import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

import { Database } from '@/types/supabase'
import { Price, Product } from '@/types/types'

import { stripe } from './stripe'
import { toDateTime } from './helpers'

export const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const upsertProductRecord = async (product: Stripe.Product) => {
    const productData: Product = {
        id: product.id,
        active: product.active,
        name: product.name,
        description: product.description ?? undefined,
        image: product.images[0] ?? null,
        metadata: product.metadata
    }

    const { error } = await supabaseAdmin.from('products').upsert([productData])
    if (error) {
        console.log('Error upserting product', error)
        throw error
    }

    console.log('Upserted product', productData)
}

const upsertPriceRecrtord = async (price: Stripe.Price) => {
    const priceData: Price = {
        id: price.id,
        product_id: typeof price.product === 'string' ? price.product : '',
        active: price.active,
        description: price.nickname ?? undefined,
        unit_amount: price.unit_amount ?? undefined,
        currency: price.currency,
        type: price.type,
        interval: price.recurring?.interval,
        interval_count: price.recurring?.interval_count,
        trial_period_days: price.recurring?.trial_period_days,
        metadata: price.metadata
    }

    const { error } = await supabaseAdmin.from('prices').upsert([priceData])

    if (error) {
        console.log('Error upserting price', error)
        throw error
    }
    console.log('Upserted price', priceData)
}

const createOrRetrieveCustomer = async ({ email, uuid }
    : { email: string, uuid: string }) => {
    const { data, error } = await supabaseAdmin
        .from('customers')
        .select('stripe_customer_id')
        .eq('id', uuid)
        .single()

    if (error) {
        console.log('Error retrieving customer', error)
        throw error
    }
    if (!data?.stripe_customer_id) {
        const customerData: { metadata: { supabaseUUID: string }; email?: string } = {
            metadata: { supabaseUUID: uuid }
        }

        if (email) {
            customerData.email = email
        }

        const customer = await stripe.customers.create(customerData)
        const { error: supabaseError } = await supabaseAdmin
            .from('customers')
            .insert([{ id: uuid, stripe_customer_id: customer.id }])

        if (supabaseError) {
            console.log('Error inserting customer', supabaseError)
            throw supabaseError
        }
        console.log('Inserted customer', customer)
        return customer.id
    }
    return data.stripe_customer_id
}

const copyBillingDetailsToCustomer = async (uuid: string, payment_method: Stripe.PaymentMethod) => {

    const customer = payment_method.customer as string
    const { name, phone, address } = payment_method.billing_details
    if (!name || !phone || !address) {
        console.log('No billing details to copy')
        return
    }

    await stripe.customers.update(customer, {
        name: name,
        phone: phone,//@ts-ignore
        address: address
    })

    const { error } = await supabaseAdmin
        .from('users')
        .update({
            billing_address: { ...address },
            payment_method: { ...payment_method[payment_method.type] }
        })
        .eq('id', uuid)

    if (error) {
        console.log('Error updating user', error)
        throw error
    }
}

const manageSubscriptionStatusChange = async (subscriptionId: string, customerId: string, createAction = false) => {
    const { data: customerData, error: customerError } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

    if (customerError) {
        console.log('Error retrieving customer', customerError)
        throw customerError
    }

    const { id: uuid } = customerData

    const subscription = await stripe.subscriptions.retrieve(subscriptionId,
        { expand: ['default_payment_method'] })

    const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] = {
        id: subscription.id,
        user_id: uuid,
        // @ts-ignore
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        metadata: subscription.metadata,
        // @ts-ignore
        quantity: subscription.quantity,
        cancel_at_period_end: subscription.cancel_at_period_end,
        cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
        canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at).toISOString() : null,
        current_period_start: toDateTime(subscription.current_period_start).toISOString(),
        current_period_end: toDateTime(subscription.current_period_end).toISOString(),
        created: toDateTime(subscription.created).toISOString(),
        ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
        trial_start: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
        trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
    }

    const { error } = await supabaseAdmin.from('subscriptions').upsert([subscriptionData])

    if (error) {
        console.log('Error upserting subscription', error)
        throw error
    }

    console.log('Upserted subscription', subscriptionData)

    if (createAction && subscription.default_payment_method && uuid) {
        await copyBillingDetailsToCustomer(uuid, subscription.default_payment_method as Stripe.PaymentMethod)
    }
}

export {
    upsertProductRecord,
    upsertPriceRecrtord,
    createOrRetrieveCustomer,
    manageSubscriptionStatusChange
}
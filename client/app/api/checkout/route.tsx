import Stripe from 'stripe';
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';


type METADATA = {
  userId: string;
  priceId: string;
  quantity: number;
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(request: NextRequest) {
  const body = await request.text(); // Get the raw request body as a string
  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
  const sig = (await headers()).get('stripe-signature') as string;

  if (!sig) {
    console.error('No stripe-signature header found');
    return new Response('Webhook Error: Missing signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // Pass the raw body and signature as is to constructEvent
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Error verifying signature or parsing event:', err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const eventType = event.type;
  if (eventType !== 'checkout.session.completed' && eventType !== 'checkout.session.async_payment_succeeded') {
    return new Response('Omitted event', { status: 200 });
  }

  const data = event.data.object;
  const metadata = data.metadata as unknown as METADATA;
  const userId = metadata.userId;
  const priceId = metadata.priceId;
  const quantity = metadata.quantity;
  const created = data.created;
  const currency = data.currency;
  const customerDetails = data.customer_details;
  const amount = data.amount_total;


  try {
    // database update here
    return new Response('Item purchased', { status: 200 });
  } catch (error) {
    console.error('Database update failed:', error);
    return new Response('Server error', { status: 500 });
  }
}

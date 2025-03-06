import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: NextRequest) {
  try {
    // Parse the request data
    const data = await request.json();
    const priceId = data.priceId;
    const productId = data.productId;
    const quantity = data.quantity;
    
    // Create a Supabase client using cookies for server-side auth
    const cookieStore = cookies();
    const supabaseServer = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the user from the server-side client
    const { data: { user }, error } = await supabaseServer.auth.getUser();
    
    if (error || !user) {
      console.error('Authentication error:', error);
      return new NextResponse('User not authenticated', { status: 401 });
    }
    
    const userId = user.id;
    // Create the checkout session
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: quantity
          }
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/my-stories`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/my-stories`,
        metadata: {
          userId: userId,
          priceId: priceId,
          quantity: quantity.toString()
        }
      });
      
    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.error('Checkout error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
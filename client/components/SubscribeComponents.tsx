'use client';
import { useState, useEffect } from 'react';
import getStripe from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type SubscribeProps = {
  name: string;
  price: number;
  features: string[];
  billingCycle: 'monthly' | 'yearly';
};

const SubscribeComponent = ({ name, price, features, billingCycle }: SubscribeProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Get the appropriate price ID based on the plan and billing cycle
  const getPriceId = () => {
    // This is a placeholder - you'll need to replace with your actual Stripe price IDs
    const priceIds = {
      Basic: {
        monthly: 'price_1Qz3f3JDkwGnmgLOZmeQRFG0',
        yearly: 'price_1Qz3gFJDkwGnmgLOnbs7q9Np',
      },
      Pro: {
        monthly: 'price_1Qz3gkJDkwGnmgLOFzJwHqOg',
        yearly: 'price_1Qz3hIJDkwGnmgLOKXUZfr1s',
      },
      Enterprise: {
        monthly: 'price_1Qz3hlJDkwGnmgLOQ9zm0pQx',
        yearly: 'price_1Qz3ieJDkwGnmgLODjqRaqVm',
      },
    };
    
    return priceIds[name as keyof typeof priceIds][billingCycle];
  };

  // Get the appropriate product ID based on the plan
  const getProductId = () => {
    // This is a placeholder - you'll need to replace with your actual Stripe product IDs
    const productIds = {
      Basic: 'prod_RspJK50ZAg7Uk8',
      Pro: 'prod_RspLnqFr8800WD',
      Enterprise: 'prod_RspMjDLLWP88bf',
    };
    
    return productIds[name as keyof typeof productIds];
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to login if not logged in
      router.push('/login?redirectedFrom=/pricing');
      return;
    }

    setLoading(true);
    const stripe = await getStripe();
    if (!stripe) {
      setLoading(false);
      return;
    }

    try {
      const priceId = getPriceId();
      const productId = getProductId();
      
      // Default quantity - you might want to adjust this based on your business logic
      const quantity = 1

      // Get the current session token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          priceId,
          productId,
          quantity,
          userId: user.id
        })
      });

      const data = await response.json();
      if (!data.ok) throw new Error('Something went wrong');
      
      await stripe.redirectToCheckout({
        sessionId: data.result.id
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate the displayed price based on billing cycle
  const displayPrice = billingCycle === 'yearly' 
    ? `$${(price * 0.8 * 12).toFixed(2)}/year` 
    : `$${price.toFixed(2)}/month`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-2xl font-bold mb-4">{displayPrice}</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="text-sm">{feature}</li>
          ))}
        </ul>
      </div>
      <Button 
        onClick={handleSubscribe} 
        className="w-full mt-auto"
        disabled={loading}
      >
        {loading ? 'Processing...' : user ? 'Subscribe Now' : 'Login to Subscribe'}
      </Button>
    </div>
  );
};

export default SubscribeComponent;

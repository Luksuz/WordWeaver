"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SubscribeComponent from "@/components/SubscribeComponents"
import { supabase } from "@/lib/supabase"

const plans = [
  {
    name: "Basic",
    price: 9.99,
    features: ["100 AI-generated articles per month", "Basic research tools", "Email support"],
  },
  {
    name: "Pro",
    price: 19.99,
    features: [
      "Unlimited AI-generated articles",
      "Advanced research tools",
      "Priority email support",
      "Custom templates",
    ],
  },
  {
    name: "Enterprise",
    price: 49.99,
    features: ["Everything in Pro", "Dedicated account manager", "API access", "Custom AI model training"],
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    fetchUser()
  }, [])

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>

      <div className="flex justify-center mb-8">
        <Button
          variant={billingCycle === "monthly" ? "default" : "outline"}
          onClick={() => setBillingCycle("monthly")}
          className="mr-2"
        >
          Monthly
        </Button>
        <Button 
          variant={billingCycle === "yearly" ? "default" : "outline"} 
          onClick={() => setBillingCycle("yearly")}
        >
          Yearly (Save 20%)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col h-full">
            <CardContent className="pt-6 px-6 pb-6 flex flex-col h-full">
              <SubscribeComponent
                name={plan.name}
                price={plan.price}
                features={plan.features}
                billingCycle={billingCycle}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


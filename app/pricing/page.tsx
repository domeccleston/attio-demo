"use client";

import { useState } from "react";
import Link from "next/link";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { plans } from "@/data/plans";
import { Footer } from "@/components/marketing/footer";
import { Navigation } from "@/components/marketing/navigation";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight font-medium text-center mt-10 mb-6">
          <span className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-900 text-transparent bg-clip-text">
            Pricing
          </span>
        </h1>
        <p className="text-md md:text-lg lg:text-xl text-center text-gray-700 max-w-xl mx-auto mb-8">
          Flexible pricing that scales as well as our GPUs do. Monthly
          contracts, no hidden fees.
        </p>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                billingPeriod === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-200`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("annual")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                billingPeriod === "annual"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-200`}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                index === 1 ? "shadow-md relative" : ""
              } flex flex-col`}
            >
              {index === 1 && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {billingPeriod === "monthly"
                      ? plan.monthlyPrice
                      : plan.annualPrice}
                  </div>
                  <p className="text-gray-600">
                    {plan.name === "Enterprise"
                      ? "per month"
                      : `per ${billingPeriod === "monthly" ? "month" : "year"}`}
                  </p>
                </div>
                <ul className="space-y-2">
                  {Object.entries(plan.features)
                    .slice(0, 5)
                    .map(([feature, value], featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-gray-700"
                      >
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>
                          {typeof value === "boolean"
                            ? feature
                            : `${feature}: ${value}`}
                        </span>
                      </li>
                    ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-gray-50 mt-auto">
                <Link
                  href={
                    plan.name === "Enterprise"
                      ? "https://forms.fillout.com/t/cbbG8Mg1Dyus?lead_source=fillout"
                      : "/dashboard"
                  }
                >
                  <Button
                    className="w-full"
                    variant={index === 1 ? "default" : "outline"}
                  >
                    {plan.name === "Enterprise"
                      ? "Contact Sales"
                      : "Get Started"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

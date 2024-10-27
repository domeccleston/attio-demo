"use client";

import { Navigation } from "@/components/marketing/navigation";
import { Carousel } from "@/components/marketing/carousel";
import { Hero } from "@/components/marketing/hero";
import { Banner } from "@/components/marketing/banner";

export default function HomePage() {
  return (
    <div>
      <Navigation />
      <Banner />
      <Hero />
      <Carousel />
    </div>
  );
}

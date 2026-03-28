import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturedDetails } from "@/components/landing/featured-details";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedDetails />
    </>
  );
}

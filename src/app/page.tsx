import Hero from "@/components/homepage/Hero";
import PopularDestinations from "@/components/homepage/PopularDestinations";
import CuratedStays from "@/components/homepage/CuratedStays";
import Categories from "@/components/homepage/Categories";
import InvestmentTeaser from "@/components/homepage/InvestmentTeaser";
import SocialProof from "@/components/homepage/SocialProof";
import HostCTA from "@/components/homepage/HostCTA";
import FinalCTA from "@/components/homepage/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularDestinations />
      <CuratedStays />
      <Categories />
      <InvestmentTeaser />
      <SocialProof />
      <HostCTA />
      <FinalCTA />
    </>
  );
}

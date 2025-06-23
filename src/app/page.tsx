"use client"

import AppBanner from "@/components/common/app-banner";
import Features from "@/components/common/features";
import Hero from "@/components/common/hero";
import Provider from "@/components/common/provider";
import SearchBar from "@/components/common/searchbar";
import Testimonials from "@/components/common/testimonials";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSearch = (searchParams: any) => {
    const queryParams = new URLSearchParams();
    
    if (searchParams.keyword) queryParams.set('keyword', searchParams.keyword);
    if (searchParams.location) queryParams.set('location', searchParams.location);
    if (searchParams.ageGroup) queryParams.set('ageGroup', searchParams.ageGroup);
    if (searchParams.maxPrice) queryParams.set('maxPrice', searchParams.maxPrice.toString());
    
    router.push(`/childcare?${queryParams.toString()}`);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#FE7743]">
        <Hero />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10" style={{ marginTop: "-5rem" }}>
          <div className="rounded-xl bg-white shadow-xl">
            <h2 className="py-8 text-center text-2xl font-bold text-[#273F4F] md:text-3xl">
              Find the perfect childcare solution
            </h2>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        
        <Provider/>
        <Features />
        <Testimonials/>
        <AppBanner/>
      </div>
    </main>
  );
}

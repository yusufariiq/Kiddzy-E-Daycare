import AppBanner from "@/components/common/app-banner";
import Features from "@/components/common/features";
import Hero from "@/components/common/hero";
import Provider from "@/components/common/provider";
import SearchBar from "@/components/common/searchbar";
import Testimonials from "@/components/common/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#FE7743]">
        <Hero />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10" style={{ marginTop: "-5rem" }}>
          <div className="rounded-xl bg-white shadow-xl">
            <SearchBar />
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

import Features from "@/components/common/features";
import Hero from "@/components/common/hero";
import Navbar from "@/components/common/navbar";
import SearchBar from "@/components/common/searchbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="space-y-10 bg-[#EFEEEA]">
        <Hero />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ marginTop: "-6rem" }}>
          <div className="rounded-xl bg-white shadow-xl">
            <SearchBar />
          </div>
        </div>

        <Features />
        </div>
    </main>
  );
}

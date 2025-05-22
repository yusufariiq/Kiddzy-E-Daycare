import ChildcareCard from "@/components/common/childcare-card"
import SearchBar from "@/components/common/searchbar"
import { childcareListings } from "@/data/chidlcare"

export default function ChildcarePage() {
  return (
    <div className="min-h-screen pb-10">
      <main>
        {/* Hero Section */}
        <div className="text-white mt-10 mb-5 max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8 py-16 bg-[#FE7743] rounded-2xl">
            <h1 className="text-3xl text-balance md:text-5xl">Discover Trusted Childcare <span className="font-bold">In Your Area!</span></h1>
        </div>

        <div className="py-8">
            <SearchBar/>    
        </div>

        {/* Grid View */}
        <div className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {childcareListings.map((listing) => (
                <ChildcareCard key={listing.id} {...listing} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
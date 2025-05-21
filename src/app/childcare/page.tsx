import ChildcareCard from "@/components/common/childcare-card"
import SearchBar from "@/components/common/searchbar"
import { Button } from "@/components/ui/button"
import { Grid, List, Filter, MapPin, } from "lucide-react"

// Sample childcare data
const childcareListings = [
  {
    id: "1",
    image: "/hero.webp",
    name: "Happy Kids Daycare",
    location: "123 Main St, Anytown, USA",
    price: "$45/day",
    rating: 4.8,
    reviewCount: 124,
    tags: ["Daycare", "Ages 2-5", "Full-time"],
    availability: "Mon-Fri, 7AM-6PM",
  },
  {
    id: "2",
    image: "/hero.webp",
    name: "Sunshine Preschool",
    location: "456 Oak Ave, Somewhere City, USA",
    price: "$950/month",
    rating: 4.6,
    reviewCount: 89,
    tags: ["Preschool", "Ages 3-5", "Part-time"],
    availability: "Mon-Fri, 8AM-3PM",
  },
  {
    id: "3",
    image: "/hero.webp",
    name: "Mary's Childcare",
    location: "789 Pine Rd, Another Place, USA",
    price: "$25/hour",
    rating: 4.9,
    reviewCount: 56,
    tags: ["Nanny", "All Ages", "Flexible"],
    availability: "Weekends Available",
  },
  {
    id: "4",
    image: "/hero.webp",
    name: "Little Learners Academy with a Very Long Name That Might Overflow",
    location: "101 Cedar Ln, Faraway Town with a Very Long Address That Might Cause Issues, USA",
    price: "$1200/month",
    rating: 4.7,
    reviewCount: 112,
    tags: ["Montessori", "Ages 1-6", "Full-time", "Educational", "Meals Included"],
    availability: "Mon-Fri, 7:30AM-5:30PM",
  },
  {
    id: "5",
    image: "/hero.webp",
    name: "After School Club",
    location: "202 Maple Dr, Nearby City, USA",
    price: "$350/month",
    rating: 4.5,
    reviewCount: 78,
    tags: ["After School", "Ages 6-12", "Part-time"],
    availability: "Mon-Fri, 3PM-6PM",
  },
  {
    id: "6",
    image: "/hero.webp",
    name: "Tiny Tots Daycare",
    location: "303 Birch Blvd, Nextdoor Village, USA",
    price: "$55/day",
    rating: 4.4,
    reviewCount: 65,
    tags: ["Infant Care", "Ages 0-2", "Full-time"],
    availability: "Mon-Fri, 8AM-5PM",
  },
]

export default function ChildcarePage() {
  return (
    <div className="min-h-screen pb-10">
      <main>
        {/* Hero Section */}
        <div className="text-white mt-10 mb-5 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 py-16 bg-[#FE7743] rounded-2xl">
            <h1 className="text-3xl md:text-5xl">Discover Trusted Childcare <span className="font-bold">In Your Area!</span></h1>
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
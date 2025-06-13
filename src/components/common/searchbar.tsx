"use client"

import { useState } from "react"
import { MapPin, Search, Users} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/utils"

export interface SearchBarProps {
  onSearch?: (searchParams: {
    location: string
    keyword?: string
    ageGroup?: string
    maxPrice?: number
  }) => void
  onReset?: () => void
  className?: string
}

const ageGroupOptions = [
  { value: "0-1", label: "0–1 years" },
  { value: "1-2", label: "1–2 years" },
  { value: "2-3", label: "2–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5-12", label: "5–12 years" },
]

export default function SearchBar({ onSearch, className }: SearchBarProps) {
  const [location, setLocation] = useState("")
  const [keyword, setKeyword] = useState("")
  const [ageGroup, setAgeGroup] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const [errors, setErrors] = useState<{ location?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    onSearch?.({
      location,
      keyword,
      ageGroup,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    })
  }

  return (
    <div className={cn("w-full px-4 py-6 md:px-6", className)}>
      <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <label htmlFor="location" className="text-sm font-medium text-[#273F4F]">Location</label>
            <Input
              id="location"
              placeholder="Enter city or ZIP"
              icon={<MapPin className="h-5 w-5" />}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={errors.location}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="keyword" className="text-sm font-medium text-[#273F4F]">Keyword</label>
            <Input
              id="keyword"
              placeholder="e.g. Montessori, bilingual"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="ageGroup" className="text-sm font-medium text-[#273F4F]">Age Group</label>
            <Select
              id="ageGroup"
              options={ageGroupOptions}
              placeholder="Select age group"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              icon={<Users className="h-5 w-5" />}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="price" className="text-sm font-medium text-[#273F4F]">Max Price (Rp)</label>
            <Input
              id="price"
              type="number"
              min="0"
              placeholder="e.g. 500000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button type="submit" className="px-6">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </form>
    </div>
  )
}
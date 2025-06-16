"use client"

import { useState } from "react"
import { MapPin, Search, Users, X, RotateCcw} from "lucide-react"
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

const locationOptions = [
  { value: "Jakarta", label: "Jakarta" },
  { value: "Bogor", label: "Bogor" },
  { value: "Depok", label: "Depok" },
  { value: "Tangerang", label: "Tangerang" },
  { value: "Bekasi", label: "Bekasi" },
]

export default function SearchBar({ onSearch, onReset, className }: SearchBarProps) {
  const [location, setLocation] = useState("")
  const [keyword, setKeyword] = useState("")
  const [ageGroup, setAgeGroup] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const [errors, setErrors] = useState<{ location?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    // Create search parameters object
    const searchParams = {
      location,
      keyword: keyword.trim() || undefined,
      ageGroup: ageGroup || undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    }
    
    onSearch?.(searchParams)
  }

  const handleReset = () => {
    setLocation("")
    setKeyword("")
    setAgeGroup("")
    setMaxPrice("")
    setErrors({})
    onReset?.()
  }

  const clearField = (field: string) => {
    switch (field) {
      case 'location':
        setLocation("")
        break
      case 'keyword':
        setKeyword("")
        break
      case 'ageGroup':
        setAgeGroup("")
        break
      case 'maxPrice':
        setMaxPrice("")
        break
    }
  }

  const hasActiveFilters = location || keyword || ageGroup || maxPrice

  return (
    <div className={cn("w-full px-4 py-6 md:px-6", className)}>
      <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <label htmlFor="keyword" className="text-sm font-medium text-[#273F4F]">
              Keyword
            </label>
            <div className="relative">
              <Input
                id="keyword"
                placeholder="e.g. Montessori, bilingual"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pr-8"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => clearField('keyword')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="location" className="text-sm font-medium text-[#273F4F]">
              Location
            </label>
            <div className="relative">
              <Select
                id="location"
                placeholder="Select location"
                options={locationOptions}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                icon={<MapPin className="h-5 w-5" />}
                className="pr-8"
              />
            </div>
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="ageGroup" className="text-sm font-medium text-[#273F4F]">
              Age Group
            </label>
            <div className="relative">
              <Select
                id="ageGroup"
                options={ageGroupOptions}
                placeholder="Select age group"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                icon={<Users className="h-5 w-5" />}
                className="pr-8"
              />
              {ageGroup && (
                <button
                  type="button"
                  onClick={() => clearField('ageGroup')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="price" className="text-sm font-medium text-[#273F4F]">
              Max Price (Rp)
            </label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                min="0"
                placeholder="e.g. 500000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="pr-8"
              />
              {maxPrice && (
                <button
                  type="button"
                  onClick={() => clearField('maxPrice')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button type="submit" className="px-6 bg-[#FE7743] hover:bg-[#E66A3A]">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          
          {hasActiveFilters && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              className="px-6 border-[#FE7743] text-[#FE7743] hover:bg-[#FE7743] hover:text-white"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {keyword && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FE7743] text-white text-xs rounded-full">
                Keyword: {keyword}
                <button
                  type="button"
                  onClick={() => clearField('keyword')}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FE7743] text-white text-xs rounded-full">
                Location: {location}
                <button
                  type="button"
                  onClick={() => clearField('location')}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {ageGroup && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FE7743] text-white text-xs rounded-full">
                Age: {ageGroupOptions.find(opt => opt.value === ageGroup)?.label}
                <button
                  type="button"
                  onClick={() => clearField('ageGroup')}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {maxPrice && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FE7743] text-white text-xs rounded-full">
                Max Price: Rp {parseInt(maxPrice).toLocaleString('id-ID')}
                <button
                  type="button"
                  onClick={() => clearField('maxPrice')}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
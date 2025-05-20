"use client"

import { cn } from "@/utils/utils"

import type React from "react"

import { useState } from "react"
import { MapPin, Search, Calendar, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, type SelectOption } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// Sample data for dropdowns
const ageRangeOptions: SelectOption[] = [
  { value: "0-1", label: "0-1 years" },
  { value: "1-2", label: "1-2 years" },
  { value: "2-3", label: "2-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-12", label: "5-12 years" },
]

const serviceTypeOptions: SelectOption[] = [
  { value: "daycare", label: "Daycare" },
  { value: "nanny", label: "Nanny" },
  { value: "babysitter", label: "Babysitter" },
  { value: "preschool", label: "Preschool" },
  { value: "afterschool", label: "After School Care" },
]

const availabilityOptions: SelectOption[] = [
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "evenings", label: "Evenings" },
]

export interface SearchBarProps {
  onSearch?: (searchParams: {
    location: string
    childAge?: string
    serviceType?: string
    availability?: string
  }) => void
  className?: string
}

export default function SearchBar({ onSearch, className }: SearchBarProps) {
  const [location, setLocation] = useState("")
  const [childAge, setChildAge] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [availability, setAvailability] = useState("")
  const [errors, setErrors] = useState<{ location?: string }>({})

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate location (required field)
    if (!location.trim()) {
      setErrors({ location: "Location is required" })
      return
    }

    setErrors({})

    if (onSearch) {
      onSearch({
        location,
        childAge,
        serviceType,
        availability,
      })
    }
  }

  return (
    <div className={cn("w-full px-4 py-6 md:px-6", className)}>
      <h2 className="mb-10 text-center text-2xl font-bold text-[#273F4F] md:text-3xl">
        Find the perfect childcare solution
      </h2>

      <form onSubmit={handleSearch} className="mx-auto max-w-6xl">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-[#273F4F]">
              Location
            </label>
            <Input
              id="location"
              type="text"
              placeholder="Enter your zip code"
              icon={<MapPin className="h-5 w-5" />}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={errors.location}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="childAge" className="block text-sm font-medium text-[#273F4F]">
              Child's Age
            </label>
            <Select
              id="childAge"
              options={ageRangeOptions}
              placeholder="Select age range"
              icon={<Users className="h-5 w-5" />}
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="serviceType" className="block text-sm font-medium text-[#273F4F]">
              Service Type
            </label>
            <Select
              id="serviceType"
              options={serviceTypeOptions}
              placeholder="Select service"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="availability" className="block text-sm font-medium text-[#273F4F]">
              Availability
            </label>
            <Select
              id="availability"
              options={availabilityOptions}
              placeholder="Select when"
              icon={<Calendar className="h-5 w-5" />}
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button type="submit" className="px-8 py-3 text-base">
            <Search className="mr-2 h-5 w-5" />
            Search Providers
          </Button>
        </div>
      </form>
    </div>
  )
}
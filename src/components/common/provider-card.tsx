"use client"

import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2, MapPin, Clock, Users } from "lucide-react"

interface ProviderCardProps {
  provider: {
    _id: string
    name: string
    description: string
    address: string
    location: string
    whatsapp: string
    email: string
    images: string[]
    price: number
    features: string[]
    ageGroups: Array<{ min: number; max: number }>
    availability: boolean
    isActive: boolean
    capacity: number
    operatingHours: Array<{
      day: string
      open: string
      close: string
    }>
    createdAt: string
  }
  onEdit: (provider: any) => void
  onDelete: (id: string) => void
  onView?: (provider: any) => void
}

export default function ProviderCard({ provider, onEdit, onDelete, onView }: ProviderCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getTodayHours = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = days[new Date().getDay()]
    const todayHours = provider.operatingHours.find((hours) => hours.day === today)

    if (todayHours) {
      return `${todayHours.open} - ${todayHours.close}`
    }
    return "Closed today"
  }

  return (
    <div className="group overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-52 w-full overflow-hidden">
        {provider.images.length > 0 ? (
          <img
            src={provider.images[0] || "/placeholder.svg"}
            alt={provider.name}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              provider.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {provider.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="space-y-3">
          {/* Provider Name */}
          <h3 className="text-lg font-semibold text-[#273F4F] line-clamp-1 group-hover:text-[#FE7743] transition-colors">
            {provider.name}
          </h3>

          {/* Price */}
          <p className="text-xl font-bold text-[#FE7743]">
            {formatPrice(provider.price)}
            <span className="text-sm font-normal text-gray-500 ml-1">/ day</span>
          </p>

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-[#273F4F] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-2">{provider.address}</p>
          </div>

          {/* Operating Hours */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#273F4F] flex-shrink-0" />
            <p className="text-sm text-gray-600">{getTodayHours()}</p>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#273F4F] flex-shrink-0" />
            <p className="text-sm text-gray-600">Capacity: {provider.capacity} children</p>
          </div>

          {/* Age Groups */}
          {provider.ageGroups && provider.ageGroups.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {provider.ageGroups.map((ageGroup, index) => (
                <span key={index} className="bg-[#273F4F]/10 text-[#273F4F] text-xs px-2 py-1 rounded-md">
                  {ageGroup.min}-{ageGroup.max} years
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
          {/* View Button */}
          {onView && (
            <Button
              onClick={() => onView(provider)}
              variant="ghost"
              className="text-[#273F4F] hover:text-[#FE7743] hover:bg-[#FE7743]/10 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}

          {/* Edit/Delete Buttons */}
          <div className="flex gap-2 opacity-100">
            <Button
              onClick={() => onEdit(provider)}
              size="sm"
              className="bg-[#FE7743] hover:bg-[#FE7743]/90 text-white"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>

            <Button
              onClick={() => onDelete(provider._id)}
              size="sm"
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

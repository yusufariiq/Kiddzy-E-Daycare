import Link from "next/link"
import { MapPin, Clock, Users } from "lucide-react"

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
  },
  className: string
}

export default function ChildcareCard({provider, className=""}: ProviderCardProps) {
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
  }
    
  return (
    <Link
      href={`/childcare/${provider._id}`}
      className={`group overflow-hidden rounded-lg bg-white transition-all hover:shadow-lg border border-gray-200 ${className}`}
    >
      {/* Card Image */}
      <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-64">
        {provider.images.length > 0 ? (
          <img
            src={provider.images[0] || "/placeholder.svg"}
            alt={provider.name}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>

      {/* Card Content */}
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
            <p className="text-sm text-gray-600">{getTodayHours() || '08:00 - 17:00'}</p>
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
      </div>
    </Link>
  )
}

import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock } from "lucide-react"

export interface ChildcareCardProps {
  id: string
  image: string
  name: string
  location: string
  price: number
  availability?: string
  className?: string
}

export default function ChildcareCard({
  id,
  image,
  name,
  location,
  price,
  availability,
  className = "",
}: ChildcareCardProps) {
  return (
    <Link
      href={`/childcare/${id}`}
      className={`group overflow-hidden rounded-lg bg-white transition-all hover:shadow-lg border border-gray-200 ${className}`}
    >
      {/* Card Image */}
      <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-64">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* {price && (
          <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-bold text-[#273F4F] shadow-sm">
            {price}
          </div>
        )} */}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-8">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#273F4F] line-clamp-1">{name}</h3>
          </div>

          {location && (
            <div className="mb-2 flex items-center text-gray-600">
              <MapPin className="mr-1 h-4 w-4 text-[#FE7743]" />
              <span className="text-sm line-clamp-1">{location}</span>
            </div>
          )}

          {availability && (
            <div className="mb-3 flex items-center text-gray-600">
              <Clock className="mr-1 h-4 w-4 text-[#FE7743]" />
              <span className="text-sm">{availability}</span>
            </div>
          )}
        </div>

        {price && (
          <div className="border-t-2 pt-2 border-gray-200">
            <p className="text-sm">Start from </p> 
            <div className="text-lg font-bold text-[#273F4F]">
              Rp {Number(price).toLocaleString("id-ID")}
            </div>
          </div>
        )}

        {/* {tags && tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block rounded-full bg-[#EFEEEA] px-2 py-1 text-xs font-medium text-[#273F4F]"
              >
                {tag}
              </span>
            ))}
          </div>
        )} */}
      </div>
    </Link>
  )
}

import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Clock } from "lucide-react"

export interface ChildcareCardProps {
  id: string
  image: string
  name: string
  location: string
  price: string
  rating?: number
  reviewCount?: number
  tags?: string[]
  availability?: string
  featured?: boolean
  className?: string
}

export default function ChildcareCard({
  id,
  image,
  name,
  location,
  price,
  rating,
  reviewCount,
  tags,
  availability,
  featured = false,
  className = "",
}: ChildcareCardProps) {
  return (
    <div
      className={`group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg ${
        featured ? "border-2 border-[#FE7743]" : "border border-gray-200"
      } ${className}`}
    >
      {/* Card Image */}
      <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-64">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {featured && (
          <div className="absolute left-0 top-4 bg-[#FE7743] px-3 py-1 text-sm font-medium text-white">Featured</div>
        )}
        {price && (
          <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-bold text-[#273F4F] shadow-sm">
            {price}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#273F4F] line-clamp-1">{name}</h3>
          {rating !== undefined && (
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-[#FE7743] text-[#FE7743]" />
              <span className="text-sm font-medium">
                {rating.toFixed(1)}
                {reviewCount !== undefined && <span className="text-gray-500"> ({reviewCount})</span>}
              </span>
            </div>
          )}
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

        {tags && tags.length > 0 && (
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
        )}

        <div className="mt-auto flex items-center justify-between">
          <Link
            href={`/childcare/${id}`}
            className="inline-flex items-center text-sm font-medium text-[#FE7743] hover:text-[#e66a3a] hover:underline"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

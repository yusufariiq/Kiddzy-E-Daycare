"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { MapPin, ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useParams, useRouter } from "next/navigation"

interface OperatingHours {
  _id: string
  day: string
  open: string
  close: string
}

interface Provider {
  _id: string
  name: string
  address: string
  images: string[]
  price: number
  availability: boolean
  operatingHours: OperatingHours[]
  description?: string
  features?: string[]
}

export default function ChildcareProviderPage() {
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const params = useParams()
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/providers/${id}`)
        if (!res.ok) throw new Error("Failed to fetch provider")
        const json = await res.json()
        setProvider(json.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProvider()
    }
  }, [id])

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" className="text-[#FE7743]" />
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Provider not found</h2>
        <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  const description =
    provider.description ||
    "This childcare provider offers a safe, nurturing environment for children to learn and grow. With experienced staff and a well-structured program, we ensure your child receives the best care possible."

  return (
    <div className="min-h-screen pb-16">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-[#FE7743]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images */}
          <div className="lg:col-span-2">
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-xl mb-4">
              <img
                src={provider.images[activeImage] || "/placeholder.svg"}
                alt={provider.name}
                className="size-full object-cover"
              />
            </div>

            {/* Thumbnail gallery */}
            {provider.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {provider.images.slice(0, 5).map((image, index) => (
                  <div
                    key={index}
                    className={`relative h-16 sm:h-20 w-full overflow-hidden rounded-lg cursor-pointer 
                      ${activeImage === index ? "ring-2 ring-[#FE7743]" : "opacity-70"}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${provider.name} image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column - Details and Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#273F4F] mb-4">{provider.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-1 h-4 w-4 text-[#FE7743]" />
                  <span className="text-sm">{provider.address}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4 pt-4">
                <p className="text-sm text-gray-600 mb-1">Start from</p>
                <div className="text-2xl font-bold text-[#273F4F] mb-4">Rp {provider.price.toLocaleString("id-ID")}</div>

                <Button
                  onClick={() => router.push(`/childcare/${id}/book`)}
                  className="w-full bg-[#FE7743] hover:bg-[#e56a3a] text-white py-6 rounded-xl text-lg font-semibold"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Provider details section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-[#273F4F] mb-4">About this childcare</h2>
              <p className="text-gray-700 whitespace-pre-line">{description}</p>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#273F4F] mb-4">Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {provider.features?.map((features, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#FE7743] mr-2"></div>
                    <span className="text-gray-700">{features}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operating hours */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#273F4F] mb-4">Operating Hours</h2>
              <div className="space-y-3">
                {provider.operatingHours.length > 0 ? (
                  provider.operatingHours.map((hours) => (
                    <div key={hours._id} className="flex justify-between items-center">
                      <span className="font-medium">{hours.day}</span>
                      {(hours.open && hours.close === "CLOSED" ) ?
                        (
                          <span className="text-gray-600">
                            Closed
                          </span>
                        ) : (
                          <span className="text-gray-600">
                            {hours.open} - {hours.close}
                          </span>
                        )   
                      }
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600">Operating hours not available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
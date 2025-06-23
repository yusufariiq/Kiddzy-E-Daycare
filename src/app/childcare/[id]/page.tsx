"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { MapPin, ArrowLeft, Phone, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ProviderData } from "@/lib/types/providers"
import { useAuth } from "@/context/auth.context"
import toast from "react-hot-toast"
import AvailableCalendar from "@/components/common/calendar"

const getOperationalStatus = (operatingHours: any[]) => {
  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
  
  const todaySchedule = operatingHours.find(
    schedule => schedule.day.toLowerCase() === currentDay.toLowerCase()
  )

  if (!todaySchedule || todaySchedule.open === "CLOSED") {
    // Find next opening day
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const currentDayIndex = daysOfWeek.indexOf(currentDay)
    
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7
      const nextDay = daysOfWeek[nextDayIndex]
      const nextSchedule = operatingHours.find(
        schedule => schedule.day.toLowerCase() === nextDay.toLowerCase()
      )
      
      if (nextSchedule && nextSchedule.open !== "CLOSED") {
        return {
          isOpen: false,
          message: `Closed today • Opens ${nextDay} at ${nextSchedule.open}`,
          status: 'closed'
        }
      }
    }
    
    return {
      isOpen: false,
      message: 'Currently closed',
      status: 'closed'
    }
  }

  const currentTime = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  const isOpen = currentTime >= todaySchedule.open && currentTime <= todaySchedule.close

  if (isOpen) {
    return {
      isOpen: true,
      message: `Open now • Closes at ${todaySchedule.close}`,
      status: 'open'
    }
  } else if (currentTime < todaySchedule.open) {
    return {
      isOpen: false,
      message: `Closed • Opens today at ${todaySchedule.open}`,
      status: 'closed'
    }
  } else {
    // Find next opening time
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const currentDayIndex = daysOfWeek.indexOf(currentDay)
    
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7
      const nextDay = daysOfWeek[nextDayIndex]
      const nextSchedule = operatingHours.find(
        schedule => schedule.day.toLowerCase() === nextDay.toLowerCase()
      )
      
      if (nextSchedule && nextSchedule.open !== "CLOSED") {
        return {
          isOpen: false,
          message: `Closed • Opens ${nextDay} at ${nextSchedule.open}`,
          status: 'closed'
        }
      }
    }
    
    return {
      isOpen: false,
      message: 'Currently closed',
      status: 'closed'
    }
  }
}

export default function ChildcareProviderPage() {
  const [provider, setProvider] = useState<ProviderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  const [childrenCount, setChildrenCount] = useState(1)
  const [showCalendar, setShowCalendar] = useState(false)
  const [operationalStatus, setOperationalStatus] = useState<{
    isOpen: boolean
    message: string
    status: string
  } | null>(null)
  const { token, isAuthenticated } = useAuth()
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

  useEffect(() => {
    if (!provider?.operatingHours) return

    const updateStatus = () => {
      const status = getOperationalStatus(provider.operatingHours)
      setOperationalStatus(status)
    }

    updateStatus()

    const interval = setInterval(updateStatus, 60000)

    return () => clearInterval(interval)
  }, [provider?.operatingHours])

  const handleBack = () => {
    router.back()
  }

  const handleChildrenCountChange = (count: number) => {
    setChildrenCount(count)
  }

  const handleBooking = () => {
    if (!isAuthenticated || !token) {
      toast.error("To book this childcare, please log in or create an account first.")
      return
    }

    if (!operationalStatus?.isOpen) {
      toast.error("This childcare is currently closed. Please check operating hours.")
      return
    }

    router.push(`/childcare/${id}/book`)
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

  const isBookingEnabled = operationalStatus?.isOpen && provider.availability && provider.isActive

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
            <div className="relative h-64 sm:h-80 md:h-[500px] w-full overflow-hidden rounded-xl mb-4">
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
              <div className="flex flex-col mb-4 gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#273F4F] mb-4">{provider.name}</h1>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-5">
                    <MapPin className="size-4 text-[#FE7743]" />
                  </div>
                  <span className="text-sm">{provider.address}</span>
                </div>
                <Link href={provider.location} target="_blank" className="line-clamp-1 flex items-center gap-3 text-gray-600">
                  <div className="w-5">
                    <Map className="size-4 text-[#FE7743]" />
                  </div>
                  <span className="text-sm underline">{provider.location}</span>
                </Link>
                <Link href={`https://wa.me/${provider.whatsapp}`} target="_blank" className="flex items-center gap-3 text-gray-600">
                  <div className="w-5">
                    <Phone className="size-4 text-[#FE7743]" />
                  </div>
                  <span className="text-sm">{provider.whatsapp}</span>
                </Link>
              </div>

              <div className="border-t border-gray-200 my-4 pt-4">
                <p className="text-sm text-gray-600 mb-1">Start from</p>
                <div className="text-2xl font-bold text-[#273F4F] mb-4">Rp {provider.price.toLocaleString("id-ID")}</div>
                <Button
                  onClick={() => setShowCalendar(!showCalendar)}
                  variant="outline"
                  className="w-full py-3 mb-3 rounded-xl text-sm font-medium border-[#FE7743] text-[#FE7743] hover:bg-[#FE7743]/5"
                >
                  {showCalendar ? 'Hide Calendar' : 'Check Availability'}
                </Button>
                
                <Button
                  onClick={handleBooking}
                  disabled={!isBookingEnabled}
                  className={`w-full py-6 rounded-xl text-lg font-semibold transition-colors ${
                    isBookingEnabled
                      ? 'bg-[#FE7743] hover:bg-[#e56a3a] text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isBookingEnabled ? 'Book Now' : 'Currently Closed'}
                </Button>
                
                {!isBookingEnabled && operationalStatus && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {operationalStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar section */}
        {showCalendar && provider && (
          <div className="mt-8">
            <AvailableCalendar
              providerId={typeof id === 'string' ? id : ''}
              childrenCount={childrenCount}
              onChildrenCountChange={handleChildrenCountChange}
              className="max-w-4xl mx-auto"
            />
          </div>
        )}

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
                  provider.operatingHours.map((hours) => {
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === hours.day.toLowerCase()
                    const isClosed = hours.open === "CLOSED" || hours.close === "CLOSED"
                    
                    return (
                      <div key={hours._id} className={`flex justify-between items-center ${isToday ? 'font-semibold text-[#FE7743]' : ''}`}>
                        <span className="font-medium">{hours.day}</span>
                        <span className={`${isClosed ? 'text-red-600' : 'text-gray-600'}`}>
                          {isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    )
                  })
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
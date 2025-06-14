"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Calendar, CreditCard, Phone } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import BookingConfirmation from "@/components/booking/booking-confirmation"
import BookingDetailsStep from "@/components/booking/booking-details-step"
import ChildInfoStep from "@/components/booking/child-info-step"
import PaymentStep from "@/components/booking/payment-step"
import EmergencyContactForm from "@/components/booking/emergency-contact-form"
import { useAuth } from "@/context/auth.context"
import toast from "react-hot-toast"
import ProtectedRoute from "@/components/common/ProtectedRoute"

interface Provider {
  _id: string
  name: string
  address: string
  images: string[]
  price: number
}

interface ChildData {
  _id?: string
  fullname: string
  nickname: string
  age: number
  gender: "male" | "female" | "other"
  allergies: string[]
}

interface BookingData {
  startDate: Date
  endDate: Date
  childrenCount: number // This will be auto-calculated
  notes?: string
}

interface EmergencyContact {
  name: string
  phone: string
  relationship: string
  isAuthorizedForPickup: boolean
}

interface PaymentData {
  paymentMethod: string
  totalAmount: number
}

const steps = [
  { id: 1, name: "Child Information", icon: User },
  { id: 2, name: "Booking Details", icon: Calendar },
  { id: 3, name: "Emergency Contact", icon: Phone },
  { id: 4, name: "Payment", icon: CreditCard },
]

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)
  const [childrenData, setChildrenData] = useState<ChildData[]>([])
  const [childrenIds, setChildrenIds] = useState<string[]>([])
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const params = useParams()
  const router = useRouter()
  const { id } = params
  const { token, isAuthenticated } = useAuth()
  

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await fetch(`/api/providers/${id}`)
        if (!res.ok) throw new Error("Failed to fetch provider")
        const json = await res.json()
        setProvider(json.data)
      } catch (e) {
        console.error(e)
        router.push("/childcare")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProvider()
    }
  }, [id, router, token, isAuthenticated])

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  const handleChildInfoSubmit = async (children: ChildData[]) => {
    setIsProcessing(true)
    try {
      const createdChildrenIds: string[] = []
      
      for (const childData of children) {
        const childResponse = await fetch("/api/children", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(childData),
        })

        if (!childResponse.ok) {
          throw new Error("Failed to create child record")
        }

        const childResult = await childResponse.json()
        createdChildrenIds.push(childResult.child._id)
      }
      
      setChildrenIds(createdChildrenIds)
      setChildrenData(children)
      handleNext()
    } catch (error: any) {
      console.error("Error creating children:", error)
      toast.error("Error creating children: " + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBookingDetailsSubmit = (data: BookingData) => {
    // Auto-calculate childrenCount from actual children added
    const updatedData = {
      ...data,
      childrenCount: childrenData.length 
    }
    setBookingData(updatedData)
    handleNext()
  }

  const handleEmergencyContactSubmit = (data: EmergencyContact) => {
    setEmergencyContact(data)
    handleNext()
  }

  const handlePaymentSubmit = async (data: PaymentData) => {
    if (!childrenIds.length || !bookingData || !provider || !emergencyContact) return
    
    setIsProcessing(true)
    setPaymentData(data)

    try {
      const bookingPayload = {
        providerId: id,
        childrenIds: childrenIds,
        startDate: bookingData.startDate.toISOString(),
        endDate: bookingData.endDate.toISOString(),
        childrenCount: childrenData.length,
        notes: bookingData.notes,
        paymentMethod: data.paymentMethod,
        totalAmount: data.totalAmount,
        emergencyContact: emergencyContact
      }

      console.log('Booking payload:', bookingPayload)

      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload),
      })

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json()
        throw new Error(errorData.error || "Failed to create booking")
      }

      const bookingResult = await bookingResponse.json()
      const createdBookingId = bookingResult.booking._id

      setBookingId(createdBookingId)
      setPaymentData(data)
      setShowConfirmation(true)
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push("/bookings")
      }, 3000)
      
    } catch (error: any) {
      console.error("Booking failed:", error)
      toast.error("Booking failed: " + error.message)
    } finally {
      setIsProcessing(false)
    }
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
        <Button onClick={() => router.push("/childcare")} variant="outline">
          Back to Search
        </Button>
      </div>
    )
  }

  if (showConfirmation && bookingId && paymentData) {
    return (
      <BookingConfirmation
        provider={provider}
        childData={childrenData[0]}
        bookingData={bookingData!}
        paymentData={paymentData}
        bookingId={bookingId}
      />
    )
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-[90vh] space-y-10 mb-10">
        {/* Header */}
        <div className="bg-[#FE7743] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="flex items-center gap-2 text-white"
              >
                <ArrowLeft className="size-5" />
                Back
              </Button>
              <div className="text-center">
                <h1 className="text-3xl font-bold">Book Childcare</h1>
              </div>
              <div className="w-16"></div>
            </div>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${
                      isActive
                        ? "border-[#FE7743] bg-[#FE7743] text-white"
                        : isCompleted
                          ? "border-[#FE7743] bg-[#FE7743] text-white"
                          : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-[#FE7743]" : isCompleted ? "text-[#FE7743]" : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden sm:block w-10 h-0.5 mx-3 
                      ${isCompleted ? "bg-[#FE7743]" : "bg-gray-300"}`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-5 md:gap-0">
          {/* Provider Summary */}
          <div className="w-full md:w-1/3 h-fit px-4 sm:px-6">
            <div className="flex flex-col gap-4 border-2 border-gray-200 rounded-xl">
              <div className="relative w-full overflow-hidden">
                <img
                  src={provider.images[0] || "/image5.webp"}
                  alt={provider.name}
                  className="w-full h-full rounded-t-xl object-cover"
                />
              </div>
              <div className="px-4 sm:px-6 lg:px-8 pb-4">
                <h3 className="text-xl font-semibold text-[#273F4F]">{provider.name}</h3>
                <p className="text-base text-gray-600 mb-2">{provider.address}</p>
                <p className="text-lg font-bold text-[#FE7743]">Rp {provider.price.toLocaleString("id-ID")} <span className="text-sm text-gray-400 font-normal">/ day</span></p>
                
                {/* Show children count when available */}
                {childrenData.length > 0 && (
                  <div className="mt-3 p-3 bg-[#FFF8F5] rounded-lg border border-[#FE7743]/20">
                    <p className="text-sm font-medium text-[#273F4F]">
                      Children: {childrenData.length}
                    </p>
                    <div className="text-xs text-gray-600 mt-1">
                      {childrenData.map((child, index) => (
                        <div key={index}>{child.nickname} ({child.age}y)</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="w-full md:w-2/3 mx-auto px-4 sm:px-6">
            {currentStep === 1 && (
              <ChildInfoStep 
                onSubmit={handleChildInfoSubmit} 
                initialData={childrenData} 
                isProcessing={isProcessing}
              />
            )}
            {currentStep === 2 && (
              <BookingDetailsStep 
                onSubmit={handleBookingDetailsSubmit} 
                initialData={bookingData} 
                provider={provider}
                childrenCount={childrenData.length}
              />
            )}
            {currentStep === 3 && (
              <EmergencyContactForm
                onSubmit={handleEmergencyContactSubmit}
                initialData={emergencyContact}
              />
            )}
            {currentStep === 4 && (
              <PaymentStep
                onSubmit={handlePaymentSubmit}
                provider={provider}
                childData={childrenData[0] || childrenData}
                bookingData={{
                  ...bookingData!,
                  childrenCount: childrenData.length
                }}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
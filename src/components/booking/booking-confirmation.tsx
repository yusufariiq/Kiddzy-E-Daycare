"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, User, CreditCard, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface BookingConfirmationProps {
  provider: any
  childData: any
  bookingData: any
  paymentData: any
  bookingId: string
}

export default function BookingConfirmation({
  provider,
  childData,
  bookingData,
  paymentData,
  bookingId,
}: BookingConfirmationProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)

  const calculateDays = () => {
    const diffTime = Math.abs(bookingData.endDate.getTime() - bookingData.startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/bookings")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Success Message */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#273F4F] mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">Your childcare booking has been successfully confirmed.</p>
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to bookings page in {countdown} seconds...
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-[#273F4F] mb-4">Booking Details</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FFF8F5] rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-[#FE7743]" />
              </div>
              <div>
                <p className="font-medium">Provider</p>
                <p className="text-gray-600">{provider.name}</p>
                <p className="text-sm text-gray-500">{provider.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FFF8F5] rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-[#FE7743]" />
              </div>
              <div>
                <p className="font-medium">Booking Period</p>
                <p className="text-gray-600">
                  {bookingData.startDate.toLocaleDateString()} - {bookingData.endDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {calculateDays()} day{calculateDays() > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FFF8F5] rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-[#FE7743]" />
              </div>
              <div>
                <p className="font-medium">Child Information</p>
                <p className="text-gray-600">
                  {childData.fullname} ({childData.nickname})
                </p>
                <p className="text-sm text-gray-500">
                  {childData.age} years old, {childData.gender}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FFF8F5] rounded-full flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-[#FE7743]" />
              </div>
              <div>
                <p className="font-medium">Payment</p>
                <p className="text-gray-600">Rp {paymentData.totalAmount.toLocaleString("id-ID")}</p>
                <p className="text-sm text-gray-500">Paid via {paymentData.paymentMethod.replace("_", " ")}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#FFF8F5] rounded-lg border border-[#FE7743]/20">
            <p className="text-sm text-[#273F4F]">
              <strong>Booking ID:</strong> {bookingId}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Please save this booking ID for your records. You'll receive a confirmation email shortly.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/bookings")}
            className="w-full bg-[#FE7743] hover:bg-[#e56a3a] text-white py-4 rounded-xl text-lg font-semibold"
          >
            View My Bookings
          </Button>

          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full py-4 rounded-xl border-[#FE7743] text-[#FE7743] hover:bg-[#FE7743] hover:text-white flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  )
}
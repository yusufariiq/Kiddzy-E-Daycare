"use client"

import { Button } from "@/components/ui/button"
import { Calendar, MapPin, User, MoreHorizontal, Eye, RotateCcw, X, Loader2 } from "lucide-react"
import { useState } from "react"

interface Provider {
  _id?: string
  name: string
  address: string
  image?: string[]
}

interface Child {
  _id?: string
  fullname: string
  nickname: string
}

interface Booking {
  _id: string
  bookingId: string
  providerId: Provider
  childId: Child
  startDate: string
  endDate: string
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  totalAmount: number
  createdAt: string
}

interface BookingCardProps {
  booking: Booking
  onViewDetails: (id: string) => void
  onCancel: (id: string) => void
  onRebook: (id: string) => void
  actionLoading?: string | null
}

export default function BookingCard({ 
  booking, 
  onViewDetails, 
  onCancel, 
  onRebook,
  actionLoading 
}: BookingCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const canCancel = ["pending", "confirmed"].includes(booking.status)
  const canRebook = ["completed", "cancelled"].includes(booking.status)
  const isLoading = actionLoading === booking._id

  const handleCancelClick = () => {
    setShowCancelConfirm(true)
    setShowActions(false)
  }

  const handleConfirmCancel = () => {
    onCancel(booking._id)
    setShowCancelConfirm(false)
  }

  // Safe access to provider and child properties
  const providerName = booking.providerId?.name || 'Unknown Provider'
  const providerAddress = booking.providerId?.address || 'No address provided'
  const childFullname = booking.childId?.fullname || 'Unknown Child'
  const childNickname = booking.childId?.nickname || 'Unknown'

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-[#273F4F]">{providerName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{providerAddress}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="text-sm">
                    {childFullname} ({childNickname})
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowActions(!showActions)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
              {showActions && !isLoading && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                  <button
                    onClick={() => {
                      onViewDetails(booking._id)
                      setShowActions(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  {canRebook && (
                    <button
                      onClick={() => {
                        onRebook(booking._id)
                        setShowActions(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Book Again
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={handleCancelClick}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#FE7743]" />
              <div>
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="text-sm font-medium">{formatDate(booking.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#FE7743]" />
              <div>
                <p className="text-xs text-gray-500">End Date</p>
                <p className="text-sm font-medium">{formatDate(booking.endDate)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-lg font-bold text-[#FE7743]">Rp {booking.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-gray-100">
            <Button
              onClick={() => onViewDetails(booking._id)}
              variant="outline"
              size="sm"
              className="border-[#FE7743] text-[#FE7743] hover:bg-[#FE7743] hover:text-white"
              disabled={isLoading}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#273F4F] mb-2">Cancel Booking</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="text-sm text-gray-500 mb-6">
              <p><strong>Provider:</strong> {providerName}</p>
              <p><strong>Child:</strong> {childFullname}</p>
              <p><strong>Date:</strong> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
                disabled={isLoading}
              >
                Keep Booking
              </Button>
              <Button
                onClick={handleConfirmCancel}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
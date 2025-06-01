"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Clock,
  User,
  MapPin,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useAuth } from "@/context/auth.context"

interface Childrens {
  _id: string
  fullname: string
  nickname: string
  age: number
  gender: string
}

interface BookingDetails {
  _id: string
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  childrenIds: Childrens[]
  providerId: {
    _id: string
    name: string
    address: string
    email: string
    whatsapp: string
  }
  startDate: string
  endDate: string
  childrenCount: number
  notes: string
  totalAmount: number
  paymentMethod: string
  userId: string
  createdAt: string
  updatedAt: string
}

export default function BookingDetailsPage() {
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "timeline">("overview")
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const { token } = useAuth()

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`/api/bookings/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch booking details')
        }

        const data = await response.json()
        setBooking(data.booking)
      } catch (error) {
        console.error("Failed to fetch booking details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBookingDetails()
    }
  }, [id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateDays = () => {
    if (!booking) return 0
    const start = new Date(booking.startDate)
    const end = new Date(booking.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
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

  const handleCancelBooking = async () => {
    if (!booking || !window.confirm("Are you sure you want to cancel this booking?")) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to cancel booking')
      }

      const data = await response.json()
      setBooking(data.booking)
      alert('Booking cancelled successfully')
    } catch (error) {
      console.error("Failed to cancel booking:", error)
      alert('Failed to cancel booking. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    if (!booking) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update booking status')
      }

      const data = await response.json()
      setBooking(data.booking)
      alert(`Booking status updated to ${newStatus}`)
    } catch (error) {
      console.error("Failed to update booking:", error)
      alert('Failed to update booking. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" className="text-[#FE7743]" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Booking not found</h2>
        <Button onClick={() => router.push("/bookings")} variant="outline">
          Back to Bookings
        </Button>
      </div>
    )
  }

  const canModify = ["pending", "confirmed"].includes(booking.status)
  const canCancel = ["pending", "confirmed"].includes(booking.status)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#FE7743]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                className="flex items-center gap-2 text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Booking Details</h1>
                <p className="text-sm text-white">ID: {booking._id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl border-2 border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 px-6">
                  {[
                    { id: "overview", label: "Overview", icon: User },
                    { id: "timeline", label: "Timeline", icon: Clock },
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? "border-[#FE7743] text-[#FE7743]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Booking Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-[#273F4F] mb-4">Booking Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Booking Period</label>
                            <div className="mt-1">
                              <p className="text-[#273F4F] font-medium">
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </p>
                              <p className="text-sm text-gray-600">{calculateDays()} days</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Number of Children</label>
                            <p className="text-[#273F4F] font-medium mt-1">{booking.childrenCount}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Payment Method</label>
                            <p className="text-[#273F4F] font-medium mt-1 capitalize">{booking.paymentMethod.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Child Information */}
                    <div>
                      {booking.childrenIds?.map((child: any) => {
                        return (
                          <div className="my-4">
                            <h4 className="text-lg font-semibold text-[#273F4F] mb-4">Child Information</h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                                  <p className="text-[#273F4F] font-medium mt-1">{child.fullname}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Nickname</label>
                                  <p className="text-[#273F4F] font-medium mt-1">{child.nickname}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Age</label>
                                  <p className="text-[#273F4F] font-medium mt-1">{child.age} years old</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Gender</label>
                                  <p className="text-[#273F4F] font-medium mt-1 capitalize">{child.gender}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    

                    {/* Notes */}
                    {booking.notes && (
                      <div>
                        <h4 className="text-lg font-semibold text-[#273F4F] mb-4">Additional Information</h4>
                        <div className="bg-[#FE7743]/15 rounded-lg p-4">
                          <h5 className="font-medium text-[#273F4F] mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Notes
                          </h5>
                          <p className="text-gray-700">{booking.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {(canModify || canCancel) && (
                      <div className="flex justify-end gap-3">
                      {canCancel && (
                        <Button
                          onClick={handleCancelBooking}
                          disabled={actionLoading}
                          variant="default"
                        >
                          Cancel Booking
                        </Button>
                      )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "timeline" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-[#273F4F]">Booking Timeline</h4>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-[#FE7743] rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-[#273F4F]">Booking Created</h5>
                            <span className="text-xs text-gray-500">by user</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-1">Booking request submitted successfully</p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Information */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#273F4F] mb-4">Provider Details</h3>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#273F4F]">{booking.providerId.name}</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-600">{booking.providerId.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{booking.providerId.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{booking.providerId.whatsapp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#273F4F] mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{calculateDays()} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Children</span>
                  <span className="font-medium">{booking.childrenCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">{booking.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-[#FE7743]">Rp {booking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
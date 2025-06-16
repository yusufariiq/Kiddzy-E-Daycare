"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Filter, Plus, Clock, AlertTriangle } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"
import BookingCard from "@/components/booking/booking-card"
import toast from "react-hot-toast"
import { useAuth } from "@/context/auth.context"
import ProtectedRoute from "@/components/common/ProtectedRoute"
import Booking, { ProviderInfo } from "@/lib/types/booking"

interface Provider extends ProviderInfo {
  image?: string[]
}

interface Child {
  _id?: string
  fullname: string
  nickname: string
}

interface BookingPageData extends Omit<Booking, 'provider' | 'child'> {
  provider: Provider
  child: Child
}

interface ApiResponse {
  bookings: BookingPageData[]
  count: number
  filter: string
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && token) {
      const filterParam = activeTab === 'active' ? 'active' : undefined
      fetchBookings(filterParam)
    }
  }, [activeTab, isAuthenticated, token])

  const fetchBookings = async (filter?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (filter && filter !== 'all') {
        params.append('filter', filter)
      }
      
      const response = await fetch(`/api/bookings?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`)
      }

      const data: ApiResponse = await response.json()
      
      const normalizedBookings = data.bookings.map(booking => ({
        ...booking,
        provider: {
          name: booking.provider?.name || 'Unknown Provider',
          address: booking.provider?.address || 'No address provided',
          image: booking.provider?.image || []
        },
        child: {
          fullname: booking.child?.fullname || 'Unknown Child',
          nickname: booking.child?.nickname || 'Unknown'
        }
      }))
      
      setBookings(normalizedBookings)
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch bookings")
      toast.error("Failed to load bookings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string, reason?: string) => {
    try {
      setActionLoading(bookingId)
      
      const params = new URLSearchParams()
      if (reason) {
        params.append('reason', reason)
      }

      const response = await fetch(`/api/bookings/${bookingId}?${params.toString()}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel booking')
      }

      const data = await response.json()
      toast.success(data.message || "Booking cancelled successfully")
      
      // Refresh bookings
      await fetchBookings()
    } catch (error) {
      console.error("Failed to cancel booking:", error)
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRebook = (bookingId: string) => {
    const booking = bookings.find(b => b._id === bookingId)
    if (booking) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('rebookData', JSON.stringify({
          providerId: booking.providerId,
          childName: booking.childName
        }))
      }
      router.push('/childcare')
    }
  }

  const getFilteredBookings = () => {
    let filtered = bookings

    // Filter by tab (active vs history)
    if (activeTab === "active") {
      filtered = filtered.filter((booking) => ["pending", "confirmed", "active"].includes(booking.status))
    } else {
      filtered = filtered.filter((booking) => ["completed", "cancelled"].includes(booking.status))
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((booking) => booking.status === filterStatus)
    }

    return filtered
  }

  const getStatusCount = (status: string) => {
    if (status === "active") {
      return bookings.filter((b) => ["pending", "confirmed", "active"].includes(b.status)).length
    } else {
      return bookings.filter((b) => ["completed", "cancelled"].includes(b.status)).length
    }
  }

  const filteredBookings = getFilteredBookings()

  if (error && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#273F4F] mb-2">Unable to Load Bookings</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => fetchBookings()}
            className="bg-[#FE7743] hover:bg-[#e56a3a] text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-[#FE7743] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-white gap-4">
              <div>
                <h1 className="text-3xl font-bold ">My Bookings</h1>
                <p className="mt-1">Manage your childcare bookings and view booking history</p>
              </div>
              <Button
                onClick={() => router.push("/childcare")}
                variant="default"
                className="bg-white text-[#273F4F] px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#273F4F] hover:text-white"
              >
                <Plus className="h-4 w-4" />
                New Booking
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "active" ? "bg-white text-[#FE7743] shadow" : "text-gray-600 hover:text-[#FE7743]"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Active Bookings
              <span className="bg-[#FE7743] text-white text-xs px-2 py-1 rounded-full">{getStatusCount("active")}</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "history" ? "bg-white text-[#FE7743] shadow-sm" : "text-gray-600 hover:text-[#FE7743]"
              }`}
            >
              <Clock className="h-4 w-4" />
              Booking History
              <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full">{getStatusCount("history")}</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl py-3 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by provider, child name, or booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button 
                  variant="default"
                  onClick={() => fetchBookings()}
                  disabled={loading}
                  className="bg-[#FE7743] rounded-lg h-auto"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" className="text-[#FE7743]" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border-2 border-gray-200 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#273F4F] mb-2">
                {activeTab === "active" ? "No Active Bookings" : "No Booking History"}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "active"
                  ? "You don't have any active bookings at the moment."
                  : "You haven't made any bookings yet."}
              </p>
              <Button
                onClick={() => router.push("/childcare")}
                className="bg-[#FE7743] hover:bg-[#e56a3a] text-white px-6 py-3 rounded-xl"
              >
                Find Childcare Providers
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onViewDetails={(id: string) => router.push(`/bookings/${id}`)}
                  onCancel={(id: string) => handleCancelBooking(id)}
                  onRebook={handleRebook}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
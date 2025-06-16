"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Eye, Calendar, AlertCircle, Filter, ChevronUp, ChevronDown } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import BookingModal from "@/components/common/booking-modal"
import { useAuth } from "@/context/auth.context"
import toast from "react-hot-toast"
import { Select } from "@/components/ui/select"
import Booking from "@/lib/types/booking"

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortField, setSortField] = useState<keyof Booking>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/booking', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (response.ok) {
        setBookings(data.bookings || [])
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch bookings')
      }
    } catch (err) {
      setError('Failed to fetch bookings')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/booking/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (response.ok) {
        setSelectedBooking(data.booking)
        setIsModalOpen(true)
      } else {
        setError(data.error || 'Failed to fetch booking details')
      }
    } catch (err) {
      setError('Failed to fetch booking details')
      console.error('Error fetching booking details:', err)
    }
  }

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/admin/booking/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Update the booking in the list
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId ? { ...booking, status: status as any } : booking
        ))
        
        // Update the selected booking if it's the same one
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: status as any })
        }
        toast.success(`Booking status updated to ${selectedBooking?.status}`);
        setError(null)
      } else {
        setError(data.error || 'Failed to update booking status')
      }
    } catch (err) {
      setError('Failed to update booking status')
      console.error('Error updating booking:', err)
    } finally {
      setIsUpdating(false)
      setIsModalOpen(false)
    }
  }

  const handleCancelBooking = async (bookingId: string, reason: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/admin/booking/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Update the booking status to cancelled
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
        ))
        
        // Update the selected booking if it's the same one
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: 'cancelled' })
        }
        
        toast.success("Booking successfully cancelled");
        setError(null)
      } else {
        setError(data.error || 'Failed to cancel booking')
      }
    } catch (err) {
      setError('Failed to cancel booking')
      console.error('Error cancelling booking:', err)
    } finally {
      setIsUpdating(false)
      setIsModalOpen(false)

    }
  }

  const filteredBookings = bookings.filter((booking) => {
      const matchesSearch = searchTerm === "" || 
        booking.childName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.providerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === "all" || booking.status === filterStatus
      
      return matchesSearch && matchesStatus
    }
  )
  .sort((a, b) => {
    if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }

    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filterOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "e_wallet":
        return "bg-green-100 text-green-800"
      case "debit_card":
        return "bg-blue-100 text-blue-800"
      case "bank_transfer":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#273F4F]">Bookings</h1>
          <p className="text-gray-600 mt-1">Manage all childcare bookings</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </Button>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FE7743]" />
              <Input
                placeholder="Search by child name, parent, provider, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select
              id="ageGroup"
              options={filterOptions}
              placeholder="All Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-3 px-5 border-gray-300 rounded-md focus:border-[#FE7743] focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Bookings Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" className="text-[#FE7743]" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings found matching your criteria
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">No</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Child/Children</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Parent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Provider</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      <button
                        className="flex items-center gap-1 hover:text-[#273F4F]"
                        onClick={() => handleSort("createdAt")}
                      >
                        Date
                        {sortField === "createdAt" && (
                          <span>
                            {sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Payment</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => (
                    <tr key={booking._id} className="border-b text-[#273F4F] border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        {booking.childrenCount ? (
                          <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                            {booking.childrenCount} Child{booking.childrenCount > 1 ? 'ren' : ''}
                          </span>
                        ) : (
                          booking.childName || 'N/A'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {booking.userId?.firstName || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        {booking.providerId?.name || booking.providerName || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(booking.startDate).toLocaleDateString()} -{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#FE7743]">
                        Rp {booking.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {booking.paymentMethod && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(booking.paymentMethod)}`}
                          >
                            {booking.paymentMethod.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => fetchBookingDetails(booking._id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Modal */}
      <BookingModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedBooking(null)
        }}
        onStatusUpdate={handleStatusUpdate}
        onCancel={handleCancelBooking}
        isUpdating={isUpdating}
      />
    </div>
  )
}
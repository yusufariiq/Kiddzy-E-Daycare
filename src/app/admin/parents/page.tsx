"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Trash2, Eye } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useAuth } from "@/context/auth.context"
import toast from "react-hot-toast"
import type { User } from "@/lib/types/user"
import type Booking from "@/lib/types/booking"
import UserBookingsModal from "@/components/common/user-booking-modal"
import BookingModal from "@/components/booking/booking-modal"

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [selectedUserBookings, setSelectedUserBookings] = useState<Booking[]>([])
  const [showBookingsModal, setShowBookingsModal] = useState(false)
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [selectedUserName, setSelectedUserName] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile")
        }

        setUsers(data.data)
      } catch (error: any) {
        toast.error(error.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleViewBookings = async (userId: string, userName: string) => {
    try {
      setBookingsLoading(true)
      setSelectedUserName(userName)
      setSelectedUserId(userId)
      setShowBookingsModal(true)

      const response = await fetch(`/api/admin/users/${userId}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch bookings")
      }

      setSelectedUserBookings(data.bookings)
    } catch (error: any) {
      toast.error(error.message || "Failed to load bookings")
      setShowBookingsModal(false)
    } finally {
      setBookingsLoading(false)
    }
  }

  const handleViewBookingDetail = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowBookingDetailModal(true)
  }

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/booking/${bookingId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update the booking in the user's bookings list
        setSelectedUserBookings((prev) =>
          prev.map((booking) => (booking._id === bookingId ? { ...booking, status: status as any } : booking)),
        )

        // Update the selected booking if it's the same one
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: status as any })
        }

        toast.success(`Booking status updated to ${status}`)
      } else {
        toast.error(data.error || "Failed to update booking status")
      }
    } catch (err) {
      toast.error("Failed to update booking status")
      console.error("Error updating booking:", err)
    } finally {
      setShowBookingDetailModal(false)
    }
  }

  const handleCancelBooking = async (bookingId: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/booking/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update the booking status to cancelled
        setSelectedUserBookings((prev) =>
          prev.map((booking) => (booking._id === bookingId ? { ...booking, status: "cancelled" } : booking)),
        )

        // Update the selected booking if it's the same one
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: "cancelled" })
        }

        toast.success("Booking successfully cancelled")
      } else {
        toast.error(data.error || "Failed to cancel booking")
      }
    } catch (err) {
      toast.error("Failed to cancel booking")
      console.error("Error cancelling booking:", err)
    } finally {
      setShowBookingDetailModal(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "user":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#273F4F]">Parents</h1>
          <p className="text-gray-600 mt-1">Manage parents accounts and permissions</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Registered Parents ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" className="text-[#FE7743]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">First Name</th>
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">Last Name</th>
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">Email</th>
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">Phone</th>
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">Role</th>
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-[#273F4F]">{user.firstName}</td>
                      <td className="py-3 px-4 text-[#273F4F]">{user.lastName}</td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-gray-600">{user.phoneNumber}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role ? "Parents" : "User"}
                        </span>
                      </td>
                      <td className="flex py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                          onClick={() => handleViewBookings(user._id, `${user.firstName} ${user.lastName}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Bookings Modal */}
      <UserBookingsModal
        userId={selectedUserId}
        userName={selectedUserName}
        isOpen={showBookingsModal}
        onClose={() => {
          setShowBookingsModal(false)
          setSelectedUserBookings([])
          setSelectedUserId(null)
        }}
        onViewBooking={handleViewBookingDetail}
        bookings={selectedUserBookings}
        loading={bookingsLoading}
      />

      {/* Booking Detail Modal */}
      <BookingModal
        booking={selectedBooking}
        isOpen={showBookingDetailModal}
        onClose={() => {
          setShowBookingDetailModal(false)
          setSelectedBooking(null)
        }}
        onStatusUpdate={handleStatusUpdate}
        onCancel={handleCancelBooking}
      />
    </div>
  )
}

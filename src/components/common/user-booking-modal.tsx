"use client"

import { useState } from "react"
import { X, Calendar, User, Eye, Clock, MapPin, CreditCard } from "lucide-react"
import LoadingSpinner from "../ui/loading-spinner"
import type Booking from "@/lib/types/booking"
import { getRowBackgroundColor, getStatusColor } from "@/utils/colorStatus"

interface UserBookingsModalProps {
  userId: string | null
  userName: string
  isOpen: boolean
  onClose: () => void
  onViewBooking?: (booking: Booking) => void
  bookings: Booking[]
  loading: boolean
}

export default function UserBookingsModal({
  userId,
  userName,
  isOpen,
  onClose,
  onViewBooking,
  bookings,
  loading,
}: UserBookingsModalProps) {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed" | "active" | "completed" | "cancelled"
  >("all")
  const [sortField, setSortField] = useState<"startDate" | "totalAmount" | "status">("startDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  if (!isOpen) return null

  const filteredBookings = bookings
    .filter((booking) => statusFilter === "all" || booking.status === statusFilter)
    .sort((a, b) => {
      if (sortField === "startDate") {
        return sortDirection === "asc"
          ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          : new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      }
      if (sortField === "totalAmount") {
        return sortDirection === "asc" ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount
      }
      if (sortField === "status") {
        return sortDirection === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
      }
      return 0
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Get counts for tabs
  const getStatusCount = (status: "all" | "pending" | "confirmed" | "active" | "completed" | "cancelled") => {
    if (status === "all") return bookings.length
    return bookings.filter((booking) => booking.status === status).length
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-xl max-w-6xl w-full mx-auto max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#FFFFFF] flex items-center justify-between p-5 border-b border-[#273F4F]/10 rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-[#273F4F]">Bookings for {userName}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#273F4F]/60 hover:text-[#273F4F] bg-[#273F4F]/5 hover:bg-[#273F4F]/10 rounded-full p-2 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Status Filter Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center whitespace-nowrap ${
                statusFilter === "all" ? "bg-white text-[#273F4F] shadow-sm" : "text-gray-600 hover:text-[#273F4F]"
              }`}
            >
              All
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === "all" ? "bg-[#273F4F]/10 text-[#273F4F]" : "bg-gray-200 text-gray-600"
                }`}
              >
                {getStatusCount("all")}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center whitespace-nowrap ${
                statusFilter === "pending"
                  ? "bg-white text-yellow-600 shadow-sm"
                  : "text-gray-600 hover:text-yellow-600"
              }`}
            >
              Pending
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-gray-200 text-gray-600"
                }`}
              >
                {getStatusCount("pending")}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter("confirmed")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center whitespace-nowrap ${
                statusFilter === "confirmed"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Confirmed
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === "confirmed" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-600"
                }`}
              >
                {getStatusCount("confirmed")}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center whitespace-nowrap ${
                statusFilter === "active" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Active
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === "active" ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"
                }`}
              >
                {getStatusCount("active")}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center whitespace-nowrap ${
                statusFilter === "completed" ? "bg-white text-gray-700 shadow-sm" : "text-gray-600 hover:text-gray-700"
              }`}
            >
              Completed
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === "completed" ? "bg-gray-200 text-gray-700" : "bg-gray-200 text-gray-600"
                }`}
              >
                {getStatusCount("completed")}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter("cancelled")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center whitespace-nowrap ${
                statusFilter === "cancelled" ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:text-red-600"
              }`}
            >
              Cancelled
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === "cancelled" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-600"
                }`}
              >
                {getStatusCount("cancelled")}
              </span>
            </button>
          </div>

          {/* Bookings Content */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" className="text-[#FE7743]"/>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
              <p className="text-gray-500 mt-1">
                {statusFilter === "all"
                  ? "This user hasn't made any bookings yet."
                  : `No ${statusFilter} bookings found for this user.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Booking Cards */}
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 ${getRowBackgroundColor(booking.status)}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section - Main Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-[#273F4F]">Booking #{booking._id.slice(-8)}</h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-[#FE7743]">{formatCurrency(booking.totalAmount)}</div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        {/* Booking Period */}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#FE7743]" />
                          <div>
                            <p className="text-gray-500">Booking Period</p>
                            <p className="font-medium text-[#273F4F]">
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </p>
                          </div>
                        </div>

                        {/* Provider */}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#FE7743]" />
                          <div>
                            <p className="text-gray-500">Provider</p>
                            <p className="font-medium text-[#273F4F]">
                              {booking.providerId?.name || booking.providerName || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Children Count */}
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-[#FE7743]" />
                          <div>
                            <p className="text-gray-500">Children</p>
                            <p className="font-medium text-[#273F4F]">
                              {booking.childrenCount || 1} child{(booking.childrenCount || 1) > 1 ? "ren" : ""}
                            </p>
                          </div>
                        </div>

                        {/* Payment Method */}
                        {booking.paymentMethod && (
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-[#FE7743]" />
                            <div>
                              <p className="text-gray-500">Payment</p>
                              <p className="font-medium text-[#273F4F]">
                                {booking.paymentMethod.replace("_", " ").toUpperCase()}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Created Date */}
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#FE7743]" />
                          <div>
                            <p className="text-gray-500">Created</p>
                            <p className="font-medium text-[#273F4F]">{formatDate(booking.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Statistics */}
          {!loading && bookings.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-[#273F4F]/5 rounded-lg p-3">
                  <p className="text-2xl font-bold text-[#273F4F]">{bookings.length}</p>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                </div>
                <div className="bg-[#FE7743]/10 rounded-lg p-3">
                  <p className="text-2xl font-bold text-[#FE7743]">
                    {formatCurrency(bookings.reduce((sum, booking) => sum + booking.totalAmount, 0))}
                  </p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-600">
                    {bookings.filter((b) => ["active", "confirmed"].includes(b.status)).length}
                  </p>
                  <p className="text-sm text-gray-600">Active Bookings</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "completed").length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

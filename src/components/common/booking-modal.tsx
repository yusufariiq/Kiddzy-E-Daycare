"use client"

import { useState, useEffect } from "react"
import { X, Calendar, User, Phone, MapPin, CreditCard, FileText, AlertCircle, Check, PhoneIcon } from "lucide-react"
import { Button } from "../ui/button"
import Booking from "@/lib/types/booking"
import Link from "next/link"

interface BookingModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (bookingId: string, status: string) => void
  onCancel: (bookingId: string, reason: string) => void
}

export default function BookingModal({ booking, isOpen, onClose, onStatusUpdate, onCancel }: BookingModalProps) {
  const [cancelReason, setCancelReason] = useState("")
  const [showCancelForm, setShowCancelForm] = useState(false)
  const [cancelError, setCancelError] = useState("")

  useEffect(() => {
    if (!isOpen) {
      setShowCancelForm(false)
      setCancelReason("")
      setCancelError("")
    }
  }, [booking, isOpen])

  if (!isOpen || !booking) return null

  const handleStatusUpdate = (selectedStatus: string) => {
    onStatusUpdate(booking._id, selectedStatus)
  }

  const handleCancel = () => {
    if (cancelReason.trim() === "") {
      setCancelError("Please provide a reason for cancellation")
      return
    }

    onCancel(booking._id, cancelReason)
    setShowCancelForm(false)
    setCancelReason("")
  }

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

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Handle array of children or single child object
  const renderChildren = () => {
    if (Array.isArray(booking.childrenIds)) {
      return booking.childrenIds.map((child) => (
        <div
          key={child._id}
          className="bg-white p-4 rounded-lg border border-[#273F4F]/10 shadow-sm hover:shadow-md transition-shadow"
        >
          <p className="font-medium text-[#273F4F]">{child.fullname || child.name}</p>
          <p className="text-sm text-[#000000]/70">
            {child.age} years{child.gender === "male" ? "• Male" : "• Female"}
          </p>
          {child.specialNeeds && (
            <div className="mt-2">
              <p className="text-xs font-medium text-[#273F4F]">Special needs:</p>
              <p className="text-sm text-[#FE7743]">{child.specialNeeds}</p>
            </div>
          )}
          {child.allergies && (
            <div className="mt-2">
              <p className="text-xs font-medium text-[#273F4F]">Allergies:</p>
              <p className="text-sm text-[#FE7743]">
                {Array.isArray(child.allergies) ? child.allergies.join(", ") : child.allergies}
              </p>
            </div>
          )}
        </div>
      ))
    } else if (booking.childrenIds) {
      // Handle single child object
      const child = booking.childrenIds
      return (
        <div className="bg-white p-4 rounded-lg border border-[#273F4F]/10 shadow-sm hover:shadow-md transition-shadow">
          <p className="font-medium text-[#273F4F]">{child.fullname || child.name}</p>
          <p className="text-sm text-[#000000]/70">
            {child.age} years{child.gender ? ` • ${child.gender}` : ""}
          </p>
          {child.specialNeeds && (
            <div className="mt-2">
              <p className="text-xs font-medium text-[#273F4F]">Special needs:</p>
              <p className="text-sm text-[#FE7743]">{child.specialNeeds}</p>
            </div>
          )}
          {child.allergies && (
            <div className="mt-2">
              <p className="text-xs font-medium text-[#273F4F]">Allergies:</p>
              <p className="text-sm text-[#FE7743]">
                {Array.isArray(child.allergies) ? child.allergies.join(", ") : child.allergies}
              </p>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-xl max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#FFFFFF] flex items-center justify-between p-5 border-b border-[#273F4F]/10 rounded-t-xl">
          <h2 className="text-2xl font-bold text-[#273F4F]">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-[#273F4F]/60 hover:text-[#273F4F] bg-[#273F4F]/5 hover:bg-[#273F4F]/10 rounded-full p-2 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
           {/* Status Management */}
           <div>
            <h3 className="text-lg font-semibold text-[#273F4F] mb-4">Status Management</h3>

            {/* Current Status Display */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#273F4F] mb-2">Current Status</label>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(booking.status)}`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                <span className="text-sm text-[#000000]/60">Last updated: {formatDate(booking.createdAt)}</span>
              </div>
            </div>

            {/* Dynamic Action Buttons */}
            {booking.status !== "cancelled" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {/* Confirmed Status Actions */}
                  {booking.status === "confirmed" && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate("active")}
                        className="px-6 py-2.5 bg-[#FE7743] text-white rounded-lg hover:bg-[#FE7743]/90 focus:ring-2 focus:ring-[#FE7743]/50 focus:outline-none transition-colors font-medium flex items-center gap-2"
                      >
                        Activate Booking
                      </Button>
                      <Button
                        onClick={() => setShowCancelForm(!showCancelForm)}
                        className="px-6 py-2.5 bg-[#273F4F] text-white rounded-lg hover:bg-[#273F4F]/90 focus:ring-2 focus:ring-[#273F4F]/50 focus:outline-none transition-colors font-medium"
                      >
                        Cancel Booking
                      </Button>
                    </>
                  )}

                  {/* Active Status Actions */}
                  {booking.status === "active" && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate("completed")}
                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500/50 focus:outline-none transition-colors font-medium flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Complete Booking
                      </Button>
                      <Button
                        onClick={() => setShowCancelForm(!showCancelForm)}
                        className="px-6 py-2.5 bg-[#273F4F] text-white rounded-lg hover:bg-[#273F4F]/90 focus:ring-2 focus:ring-[#273F4F]/50 focus:outline-none transition-colors font-medium"
                      >
                        Cancel Booking
                      </Button>
                    </>
                  )}

                  {/* Pending Status Actions */}
                  {booking.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate("active")}
                        className="px-6 py-2.5 bg-[#FE7743] text-white rounded-lg hover:bg-[#FE7743]/90 focus:ring-2 focus:ring-[#FE7743]/50 focus:outline-none transition-colors font-medium flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Confirm Booking
                      </Button>
                      <Button
                        onClick={() => setShowCancelForm(!showCancelForm)}
                        className="px-6 py-2.5 bg-[#273F4F] text-white rounded-lg hover:bg-[#273F4F]/90 focus:ring-2 focus:ring-[#273F4F]/50 focus:outline-none transition-colors font-medium"
                      >
                        Cancel Booking
                      </Button>
                    </>
                  )}

                  {/* Completed Status - No actions needed */}
                  {booking.status === "completed" && (
                    <div className="flex items-center gap-2 text-[#273F4F]/70">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="font-medium">This booking has been completed</span>
                    </div>
                  )}
                </div>

                {/* Status Flow Indicator */}
                <div className="mt-6 p-4 bg-[#273F4F]/5 rounded-lg">
                  <h4 className="text-sm font-medium text-[#273F4F] mb-3">Booking Status Flow</h4>
                  <div className="flex items-center justify-between text-xs">
                    <div
                      className={`flex flex-col items-center text-[#273F4F]/50`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-[#FE7743]`}
                      ></div>
                      <span>Pending</span>
                    </div>
                    <div
                      className={`flex-1 h-px ${["confirmed", "active", "completed"].includes(booking.status) ? "bg-[#FE7743]" : "bg-[#273F4F]/20"} mx-2`}
                    ></div>
                    <div
                      className={`flex flex-col items-center ${booking.status === "confirmed" ? "text-[#FE7743]" : booking.status === "pending" ? "text-[#273F4F]/50" : "text-[#273F4F]/50"}`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${booking.status === "confirmed" ? "bg-[#FE7743]" : ["active", "completed"].includes(booking.status) ? "bg-[#FE7743]" : "bg-[#273F4F]/20"} mb-1`}
                      ></div>
                      <span>Confirmed</span>
                    </div>
                    <div
                      className={`flex-1 h-px ${["active", "completed"].includes(booking.status) ? "bg-[#FE7743]" : "bg-[#273F4F]/20"} mx-2`}
                    ></div>
                    <div
                      className={`flex flex-col items-center ${booking.status === "active" ? "text-[#FE7743]" : booking.status === "completed" ? "text-[#273F4F]/50" : "text-[#273F4F]/50"}`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${booking.status === "active" ? "bg-[#FE7743]" : booking.status === "completed" ? "bg-[#FE7743]" : "bg-[#273F4F]/20"} mb-1`}
                      ></div>
                      <span>Active</span>
                    </div>
                    <div
                      className={`flex-1 h-px ${booking.status === "completed" ? "bg-[#FE7743]" : "bg-[#273F4F]/20"} mx-2`}
                    ></div>
                    <div
                      className={`flex flex-col items-center text-[#273F4F]/50`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${booking.status === "completed" ? "bg-[#FE7743]" : "bg-[#273F4F]/20"} mb-1`}
                      ></div>
                      <span>Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cancelled Status Message */}
            {booking.status === "cancelled" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">This booking has been cancelled</span>
                </div>
                <p className="text-sm text-red-600 mt-1">No further actions are available for cancelled bookings.</p>
              </div>
            )}

            {/* Cancel Form */}
            {showCancelForm && booking.status !== "cancelled" && (
              <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h4 className="text-lg font-semibold text-[#273F4F]">Cancel Booking</h4>
                </div>

                <label htmlFor="cancel-reason" className="block text-sm font-medium text-[#273F4F] mb-2">
                  Cancellation Reason <span className="text-red-600">*</span>
                </label>

                <textarea
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => {
                    setCancelReason(e.target.value)
                    if (e.target.value.trim() !== "") {
                      setCancelError("")
                    }
                  }}
                  placeholder="Please provide a detailed reason for cancellation..."
                  className={`w-full px-4 py-3 border ${cancelError ? "border-red-500" : "border-red-300"} rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors resize-none bg-white`}
                  rows={3}
                />

                {cancelError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {cancelError}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                  <Button
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500/50 focus:outline-none transition-colors font-medium"
                  >
                    Confirm Cancellation
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCancelForm(false)
                      setCancelReason("")
                      setCancelError("")
                    }}
                    className="px-6 py-2.5 bg-[#273F4F]/70 text-white rounded-lg hover:bg-[#273F4F] focus:ring-2 focus:ring-[#273F4F]/50 focus:outline-none transition-colors font-medium"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Information */}
            <div className="space-y-4 bg-[#273F4F]/5 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-[#273F4F] border-b border-[#273F4F]/10 pb-2">
                Booking Information
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#273F4F]/70">Booking ID</label>
                  <p className="font-medium text-[#000000]">{booking._id}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#273F4F]/70">Provider</label>
                  <p className="font-medium text-[#000000]">{booking.providerId?.name}</p>
                  {booking.providerId?.address && (
                    <div className="flex items-center gap-1 mt-1 text-[#000000]/70">
                      <MapPin className="h-3.5 w-3.5 text-[#FE7743]" />
                      <p className="text-sm">{booking.providerId.address}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-[#273F4F]/70">Booking Period</label>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4 text-[#FE7743]" />
                    <p className="font-medium text-[#000000]">
                      {new Date(booking.startDate).toLocaleDateString()} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#273F4F]/70">Status</label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#273F4F]/70">Total Amount</label>
                  <p className="font-bold text-[#FE7743] text-lg">Rp {booking.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div className="space-y-4 bg-[#273F4F]/5 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-[#273F4F] border-b border-[#273F4F]/10 pb-2">
                Parent Information
              </h3>

              <div className="space-y-3">
                {booking.userId && (
                  <>
                    <div>
                      <label className="text-xs font-medium text-[#273F4F]/70">Parent Name</label>
                      <div className="flex items-center gap-1 mt-1">
                        <User className="h-4 w-4 text-[#FE7743]" />
                        <p className="font-medium text-[#000000]">
                          {booking.userId.firstName} {booking.userId.lastName || ""}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-[#273F4F]/70">Phone Number</label>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-[#FE7743]" />
                          <p className="font-medium text-[#000000]">{booking.userId.phoneNumber}</p>
                        </div>
                        <Link 
                          href={`https://wa.me/${booking.userId.phoneNumber}`}
                          className="bg-[#FE7743] text-white hover:bg-[#e66a3a] py-1 px-3 gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Contact Parent
                        </Link>
                      </div>
                    </div>
                  </>
                )}

                {booking.paymentMethod && (
                  <div>
                    <label className="text-xs font-medium text-[#273F4F]/70">Payment Method</label>
                    <div className="flex items-center gap-1 mt-1">
                      <CreditCard className="h-4 w-4 text-[#FE7743]" />
                      <p className="font-medium text-[#000000]">
                        {booking.paymentMethod.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-[#273F4F]/70">Created At</label>
                  <p className="font-medium text-[#000000]">{formatDate(booking.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Children Details */}
          <div className="bg-[#273F4F]/10 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-[#273F4F] mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[#FE7743]" />
              Children Details ({Array.isArray(booking.childrenIds) ? booking.childrenIds.length : 1})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{renderChildren()}</div>
          </div>

          {/* Emergency Contact */}
          {booking.emergencyContact && (
            <div className="bg-[#FE7743]/10 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#273F4F] mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#FE7743]" />
                Emergency Contact
              </h3>

              <div className="bg-white p-4 rounded-lg border border-[#273F4F]/10 shadow-sm">
                <p className="font-medium text-[#273F4F]">{booking.emergencyContact.name}</p>
                <p className="text-sm text-[#000000]/70">
                  Relationship: <span className="font-medium">{booking.emergencyContact.relationship[0].toLocaleUpperCase() + booking.emergencyContact.relationship.slice(1)}</span>
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex gap-4">
                    <Link 
                      href={`https://wa.me/${booking.emergencyContact.phone}`}
                      className="bg-[#FE7743] text-white hover:bg-[#e66a3a] py-1 px-3 gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                      Contact {booking.emergencyContact.phone}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="bg-[#273F4F]/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#273F4F] mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#FE7743]" />
                Notes
              </h3>

              <div className="bg-white p-4 rounded-lg border border-[#273F4F]/10 shadow-sm">
                <p className="text-[#000000] whitespace-pre-wrap">{booking.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

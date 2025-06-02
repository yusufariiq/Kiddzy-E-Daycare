"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BookingData {
  startDate: Date
  endDate: Date
  childrenCount: number
  notes?: string
}

interface Provider {
  _id: string
  name: string
  price: number
}

interface BookingDetailsStepProps {
  onSubmit: (data: BookingData) => void
  initialData?: BookingData | null
  provider: Provider
  childrenCount: number // Auto-calculated from children added
}

export default function BookingDetailsStep({ 
  onSubmit, 
  initialData, 
  provider, 
  childrenCount 
}: BookingDetailsStepProps) {
  const [formData, setFormData] = useState<BookingData>({
    startDate: initialData?.startDate || new Date(),
    endDate: initialData?.endDate || new Date(),
    childrenCount: childrenCount, // Always use passed childrenCount
    notes: initialData?.notes || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const calculateDays = () => {
    const diffTime = Math.abs(formData.endDate.getTime() - formData.startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const calculateTotal = () => {
    return calculateDays() * childrenCount * provider.price // Use childrenCount prop
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
  
    const today = new Date()
    today.setHours(0, 0, 0, 0)
  
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)
  
    if (startDate < today) {
      newErrors.startDate = "Start date cannot be in the past"
    }
    if (endDate < startDate) {
      newErrors.endDate = "End date must be after start date"
    }
  
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Always submit with the correct childrenCount
      onSubmit({
        ...formData,
        childrenCount: childrenCount
      })
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#273F4F] mb-2">Booking Details</h2>
        <p className="text-gray-600">Select your preferred dates and provide any additional information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="startDate"
                type="date"
                value={formatDateForInput(formData.startDate)}
                onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                className={errors.startDate ? "border-red-500" : ""}
              />
            </div>
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <Label htmlFor="endDate">End Date <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="endDate"
                type="date"
                value={formatDateForInput(formData.endDate)}
                onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                className={errors.endDate ? "border-red-500" : ""}
              />
            </div>
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>

        {/* Display children count as read-only info */}
        <div className="bg-[#273F4F]/5 border border-[#273F4F]/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-[#273F4F]">Number of Children</Label>
              <p className="text-xl font-bold text-[#273F4F]">{childrenCount}</p>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any special requests or additional information..."
            rows={3}
          />
        </div>

        {/* Booking Summary */}
        <div className="bg-[#FFF8F5] rounded-xl p-6 border border-[#FE7743]/20">
          <h3 className="font-semibold text-[#273F4F] mb-4">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>
                {calculateDays()} day{calculateDays() > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Children:</span>
              <span>{childrenCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Rate per child per day:</span>
              <span>Rp {provider.price.toLocaleString("id-ID")}</span>
            </div>
            <div className="border-t border-[#FE7743]/20 pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount:</span>
                <span className="text-[#FE7743]">Rp {calculateTotal().toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6">
          <Button type="submit" className="bg-[#FE7743] hover:bg-[#e56a3a] text-white px-8 py-3 rounded-xl">
            Continue to Emergency Contact
          </Button>
        </div>
      </form>
    </div>
  )
}
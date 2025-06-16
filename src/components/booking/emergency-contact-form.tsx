"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { EmergencyContact } from "@/lib/types/booking"


interface EmergencyContactFormProps {
  onSubmit: (data: EmergencyContact) => void
  initialData?: EmergencyContact | null
}

export default function EmergencyContactForm({ onSubmit, initialData }: EmergencyContactFormProps) {
  const [formData, setFormData] = useState<EmergencyContact>({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    relationship: initialData?.relationship || "",
    isAuthorizedForPickup: initialData?.isAuthorizedForPickup || false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const relationshipOptions = [
    { value: "", label: "Select relationship" },
    { value: "parent", label: "Parent" },
    { value: "grandparent", label: "Grandparent" },
    { value: "aunt_uncle", label: "Aunt/Uncle" },
    { value: "sibling", label: "Sibling" },
    { value: "friend", label: "Friend" },
    { value: "neighbor", label: "Neighbor" },
    { value: "other", label: "Other" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Contact name is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^(62|0)8[1-9][0-9]{6,9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Indonesian phone number"
    }

    if (!formData.relationship) {
      newErrors.relationship = "Relationship is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#273F4F] mb-2">Emergency Contact</h2>
        <p className="text-gray-600">Please provide details for an emergency contact person.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Enter full name"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            placeholder="e.g. +62 812 3456 7890"
          />
        </div>

        <div>
          <Label htmlFor="relationship">Relationship to Child <span className="text-red-500">*</span></Label>
          <Select
            id="relationship"
            options={relationshipOptions}
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            error={errors.relationship}
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="isAuthorizedForPickup"
            checked={formData.isAuthorizedForPickup}
            onChange={(e) => setFormData({ ...formData, isAuthorizedForPickup: e.target.checked })}
            className="mt-1"
          />
          <Label htmlFor="isAuthorizedForPickup" className="font-normal cursor-pointer">
            This person is authorized to pick up the child
          </Label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Important</p>
            <p>
              Emergency contacts will be contacted if we cannot reach the primary guardian. Please ensure their contact
              information is accurate and up-to-date.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-[#FE7743] hover:bg-[#e56a3a] text-white px-8 py-3 rounded-xl">
            Save Emergency Contact
          </Button>
        </div>
      </form>
    </div>
  )
}
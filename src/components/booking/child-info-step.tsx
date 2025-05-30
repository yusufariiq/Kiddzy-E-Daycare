"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, type SelectOption } from "@/components/ui/select"
import { X, Plus, User, Trash2, ArrowRight } from "lucide-react"
import LoadingSpinner from "../ui/loading-spinner"

interface ChildData {
  _id?: string
  fullname: string
  nickname: string
  age: number
  gender: "male" | "female" | "other"
  specialNeeds?: string
  allergies: string[]
}

interface ChildInfoStepProps {
  onSubmit: (childrenData: ChildData[]) => void
  initialData?: ChildData[] | null
  isProcessing?: boolean
}

const genderOptions: SelectOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
]

export default function ChildInfoStep({ 
  onSubmit, 
  initialData,
  isProcessing 
}: ChildInfoStepProps) {
  const [childrenData, setChildrenData] = useState<ChildData[]>(initialData || [])
  const [formData, setFormData] = useState<ChildData>({
    fullname: "",
    nickname: "",
    age: 0,
    gender: "male",
    specialNeeds: "",
    allergies: [],
  })
  const [newAllergy, setNewAllergy] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showForm, setShowForm] = useState(childrenData.length === 0)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required"
    if (!formData.nickname.trim()) newErrors.nickname = "Nickname is required"
    if (!formData.age || formData.age < 1 || formData.age > 18) {
      newErrors.age = "Age must be between 1 and 18"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitChild = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm() && !isProcessing) {
      // Add child to the list
      setChildrenData([...childrenData, formData])
      
      // Reset form
      setFormData({
        fullname: "",
        nickname: "",
        age: 0,
        gender: "male",
        specialNeeds: "",
        allergies: [],
      })
      setNewAllergy("")
      setErrors({})
      setShowForm(false)
    }
  }

  const handleRemoveChild = (index: number) => {
    const updatedChildren = childrenData.filter((_, i) => i !== index)
    setChildrenData(updatedChildren)
  }

  const handleProceedToBooking = () => {
    if (childrenData.length > 0) {
      onSubmit(childrenData)
    }
  }

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, newAllergy.trim()],
      })
      setNewAllergy("")
    }
  }

  const removeAllergy = (allergy: string) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((a) => a !== allergy),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addAllergy()
    }
  }

  const handleAddAnotherChild = () => {
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Added Children List */}
      {childrenData.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#273F4F]">Added Children ({childrenData.length})</h3>
          </div>
          
          <div className="space-y-3">
            {childrenData.map((child, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFF8F5] rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-[#FE7743]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#273F4F]">
                      {child.fullname} ({child.nickname})
                    </p>
                    <p className="text-sm text-gray-600">
                      {child.age} years old, {child.gender}
                    </p>
                    {child.allergies.length > 0 && (
                      <p className="text-xs text-orange-600">
                        Allergies: {child.allergies.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleRemoveChild(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  disabled={isProcessing}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Child Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#273F4F] mb-2">
              {childrenData.length === 0 ? "Child Information" : "Add Another Child"}
            </h2>
            <p className="text-gray-600">Please provide details about your child to ensure the best care.</p>
          </div>

          <form onSubmit={handleSubmitChild} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullname">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="fullname"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  error={errors.fullname}
                  disabled={isProcessing}
                />
              </div>

              <div>
                <Label htmlFor="nickname">Nickname <span className="text-red-500">*</span></Label>
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  error={errors.nickname}
                  disabled={isProcessing}
                />
              </div>

              <div>
                <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="18"
                  value={formData.age || ""}
                  onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) || 0 })}
                  error={errors.age}
                  disabled={isProcessing}
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
                <Select
                  options={genderOptions}
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" | "other" })}
                  placeholder="Select gender"
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialNeeds">Special Needs</Label>
              <Textarea
                id="specialNeeds"
                value={formData.specialNeeds}
                onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                placeholder="Please describe any special needs or requirements..."
                rows={3}
                disabled={isProcessing}
              />
            </div>

            <div>
              <Label>Allergies</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add an allergy..."
                  onKeyPress={handleKeyPress}
                  disabled={isProcessing}
                />
                <Button 
                  type="button" 
                  onClick={addAllergy} 
                  className="bg-[#FE7743] rounded-lg h-auto"
                  disabled={isProcessing}
                >
                  <Plus className="size-6" />
                </Button>
              </div>

              {formData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-[#FFF8F5] border border-[#FE7743]/20 rounded-full px-3 py-1"
                    >
                      <span className="text-sm">{allergy}</span>
                      <button
                        type="button"
                        onClick={() => removeAllergy(allergy)}
                        className="text-[#FE7743] hover:text-red-600"
                        disabled={isProcessing}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6">
              {childrenData.length > 0 && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                className="bg-[#FE7743] hover:bg-[#e56a3a] text-white px-8 py-3 rounded-xl"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Add Child"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Action Buttons */}
      {!showForm && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button
              onClick={handleAddAnotherChild}
              variant="outline"
              className="border-[#FE7743] text-[#FE7743] hover:bg-[#FE7743] hover:text-white flex items-center gap-2"
              disabled={isProcessing}
            >
              <Plus className="h-4 w-4" />
              Add Another Child
            </Button>
            
            <Button
              onClick={handleProceedToBooking}
              className="bg-[#FE7743] hover:bg-[#e56a3a] text-white px-8 py-3 rounded-xl flex items-center gap-2"
              disabled={childrenData.length === 0 || isProcessing}
            >
              Continue to Booking Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          {childrenData.length === 0 && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Please add at least one child to proceed
            </p>
          )}
        </div>
      )}
    </div>
  )
}
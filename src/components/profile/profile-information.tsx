"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { User2, Mail, Phone, MapPin, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types/user"
import LoadingSpinner from "../ui/loading-spinner"
import toast from "react-hot-toast"

// Form validation schema
const profileSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9+\-\s()]{10,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  address: yup.string().notRequired().default(""),
})

type ProfileFormData = yup.InferType<typeof profileSchema>

interface ProfileInformationProps {
  user: User
  updateUser: (userData: Partial<User>) => Promise<User>
}

export default function ProfileInformation({ user, updateUser }: ProfileInformationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setSuccessMessage(null)

    try {
      await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address || "",
      })

      setSuccessMessage("Profile updated successfully!")
      toast.success("Profile updated successfully!")
      setIsEditMode(false)

      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#273F4F]">Personal Information</h3>
          <p className="mt-1 text-gray-600">Your personal details</p>
        </div>
        {!isEditMode && (
          <Button onClick={handleEditClick} variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {successMessage && (
        <div className="mt-4 rounded-md bg-green-50 p-4 text-green-800 border border-green-200">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-[#273F4F]">
                First Name {isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  {...register("firstName")}
                  disabled={!isEditMode}
                  className={`block w-full rounded-md border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } pl-10 pr-3 py-3 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743] ${
                    !isEditMode ? "bg-gray-50" : ""
                  }`}
                />
              </div>
              {errors.firstName && isEditMode && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-[#273F4F]">
                Last Name {isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="lastName"
                  {...register("lastName")}
                  disabled={!isEditMode}
                  className={`block w-full rounded-md border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } px-3 py-3 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743] ${
                    !isEditMode ? "bg-gray-50" : ""
                  }`}
                />
              </div>
              {errors.lastName && isEditMode && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#273F4F]">
              Email Address
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                disabled // Email is always non-editable
                {...register("email")}
                className="block w-full rounded-md border bg-gray-50 border-gray-300 pl-10 pr-3 py-3 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]"
              />
            </div>
            {errors.email && isEditMode && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#273F4F]">
              Phone Number {isEditMode && <span className="text-red-500">*</span>}
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phoneNumber"
                {...register("phoneNumber")}
                disabled={!isEditMode}
                className={`block w-full rounded-md border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } pl-10 pr-3 py-3 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743] ${
                  !isEditMode ? "bg-gray-50" : ""
                }`}
                placeholder="(123) 456-7890"
              />
            </div>
            {errors.phoneNumber && isEditMode && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-[#273F4F]">
              Address
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="address"
                {...register("address")}
                disabled={!isEditMode}
                className={`block w-full rounded-md border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } pl-10 pr-3 py-3 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743] ${
                  !isEditMode ? "bg-gray-50" : ""
                }`}
                placeholder="123 Main St, City, State, Zip"
              />
            </div>
            {errors.address && isEditMode && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
          </div>

          {isEditMode && (
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
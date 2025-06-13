"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth.context"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ProfileInformation from "@/components/profile/profile-information"
import ProfileSidebar from "@/components/profile/profile-sidebar"
import { User } from "@/lib/types/user"
import toast from "react-hot-toast"
import ProtectedRoute from "@/components/common/ProtectedRoute"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [activeSection, setActiveSection] = useState("personal-info")
  const router = useRouter()
  const params = useParams()
  const { user: currentUser, token, isAuthenticated } = useAuth()
  
  const userId = params.id as string

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile')
        }

        // Map API response fields to match User type
        const userData = {
          ...data.data,
          phone: data.data.phoneNumber || data.data.phone,
        }

        setUser(userData)
      } catch (error: any) {
        console.error('Error fetching profile:', error)
        toast.error(error.message || 'Failed to load profile')
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [userId, token, isAuthenticated, router])

  const updateUserData = async (userData: Partial<User>): Promise<User> => {
    if (!token || !user) {
      throw new Error('User not authenticated')
    }

    try {
      const apiData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      const updatedUser = {
        ...data.data,
        phone: data.data.phoneNumber || data.data.phone,
      }

      setUser(updatedUser)
      
      // Update localStorage if this is the current user's profile
      if (currentUser && currentUser._id === userId) {
        localStorage.setItem("kiddzy_user", JSON.stringify(updatedUser))
      }

      toast.success('Profile updated successfully!')
      return updatedUser
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex flex-1 items-center justify-center py-16">
        <LoadingSpinner size="lg" className="text-orange-400"/>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[90vh] flex flex-1 items-center justify-center py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#273F4F]">Profile not found</h2>
          <p className="mt-2 text-gray-600">The requested profile could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-[90vh]">
        <div className="w-full bg-[#FE7743] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-white gap-4">
              <div>
                <h1 className="text-3xl font-bold ">Profile Settings</h1>
                <p className="mt-1">              Manage your account information and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Mobile View (visible on small screens) */}
            <div className="md:hidden">
              <div className="mb-6 flex overflow-x-auto">
                <button
                  onClick={() => setActiveSection("personal-info")}
                  className={`mr-4 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                    activeSection === "personal-info"
                      ? "bg-[#FE7743]/10 text-[#FE7743]"
                      : "bg-white text-[#273F4F] hover:bg-gray-100"
                  }`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveSection("preferences")}
                  className={`mr-4 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                    activeSection === "preferences"
                      ? "bg-[#FE7743]/10 text-[#FE7743]"
                      : "bg-white text-[#273F4F] hover:bg-gray-100"
                  }`}
                >
                  Preferences
                </button>
                <button
                  onClick={() => setActiveSection("payment")}
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                    activeSection === "payment"
                      ? "bg-[#FE7743]/10 text-[#FE7743]"
                      : "bg-white text-[#273F4F] hover:bg-gray-100"
                  }`}
                >
                  Payment Methods
                </button>
              </div>

              {activeSection === "personal-info" && (
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <ProfileInformation user={user} updateUser={updateUserData} />
                </div>
              )}

              {activeSection === "preferences" && (
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h3 className="text-xl font-bold text-[#273F4F]">Preferences</h3>
                  <p className="mt-1 text-gray-600">Manage your preferences and settings</p>
                  <p className="mt-4 text-gray-500">Preference settings coming soon.</p>
                </div>
              )}

              {activeSection === "payment" && (
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h3 className="text-xl font-bold text-[#273F4F]">Payment Methods</h3>
                  <p className="mt-1 text-gray-600">Manage your payment methods</p>
                  <p className="mt-4 text-gray-500">Payment methods coming soon.</p>
                </div>
              )}
            </div>

            {/* Desktop Layout (visible on medium and larger screens) */}
            <div className="hidden md:grid md:grid-cols-4 md:gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <ProfileSidebar user={user} activeSection={activeSection} setActiveSection={setActiveSection} />
              </div>

              {/* Main content */}
              <div className="h-full w-full md:col-span-3">
                {activeSection === "personal-info" && (
                  <div className="rounded-lg bg-white p-6" id="personal-info">
                    <ProfileInformation user={user} updateUser={updateUserData} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
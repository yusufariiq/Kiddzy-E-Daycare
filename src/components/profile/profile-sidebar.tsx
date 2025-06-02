"use client"

import { User2, Bell, CreditCard, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { User } from "@/lib/types/user"
import { useAuth } from "@/context/auth.context"

interface ProfileSidebarProps {
    user: User
    activeSection: string
    setActiveSection: (section: string) => void
}
  
export default function ProfileSidebar({ user, activeSection, setActiveSection }: ProfileSidebarProps) {
    const router = useRouter()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout
        router.push("/auth/login")
    }
  
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

  return (
    <div className="flex flex-col justify-between rounded-lg p-6 h-full space-y-6">
        <div className="space-y-6">
            <div className="flex flex-col items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FE7743]/10 text-2xl font-bold text-[#FE7743]">
                    {getInitials(user.firstName, user.lastName)}
                </div>
                <h2 className="mt-4 text-xl font-bold text-[#273F4F]">
                    {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
            </div>

            <nav className="flex flex-col space-y-4">
                <button
                    onClick={() => setActiveSection("personal-info")}
                    className={`flex items-center rounded-md px-3 py-2 text-left ${
                    activeSection === "personal-info"
                        ? "bg-[#FE7743]/10 font-medium text-[#273F4F]"
                        : "text-[#273F4F] hover:bg-gray-100"
                    }`}
                >
                    <User2 className="mr-2 h-5 w-5 text-[#FE7743]" />
                    Personal Information
                </button>
            </nav>
        </div>

        <div className="border-t border-gray-200 pt-6">
            <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-red-600 hover:bg-red-50"
            >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
            </button>
        </div>
    </div>
  )
}
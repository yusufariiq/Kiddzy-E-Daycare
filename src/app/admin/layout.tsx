"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Phone,
  Building2,
  UserCheck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    name: "Children",
    href: "/admin/children",
    icon: Users,
  },
  {
    name: "Contacts",
    href: "/admin/contacts",
    icon: Phone,
  },
  {
    name: "Providers",
    href: "/admin/providers",
    icon: Building2,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: UserCheck,
  },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <html>
        <body>
            <div className="min-h-screen bg-gray-50">
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Sidebar */}
                <div
                    className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
                    sidebarCollapsed ? "w-16" : "w-64"
                    } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
                >
                    {/* Sidebar header */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    {!sidebarCollapsed && (
                        <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FE7743] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">K</span>
                        </div>
                        <span className="text-xl font-bold text-[#273F4F]">Kiddzy Admin</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Button
                        variant="ghost"
                                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden lg:flex"
                        >
                        {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                        <X className="h-4 w-4" />
                        </Button>
                    </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigationItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive ? "bg-[#FE7743] text-white" : "text-gray-700 hover:bg-gray-100 hover:text-[#FE7743]"
                            } ${sidebarCollapsed ? "justify-center" : ""}`}
                            title={sidebarCollapsed ? item.name : undefined}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            {!sidebarCollapsed && <span>{item.name}</span>}
                        </Link>
                        )
                    })}
                    </nav>

                    {/* Sidebar footer */}
                    <div className="p-4 border-t border-gray-200">
                    {!sidebarCollapsed && <div className="text-xs text-gray-500 text-center">© 2024 Kiddzy Admin Panel</div>}
                    </div>
                </div>

                {/* Main content */}
                <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
                    {/* Top bar */}
                    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
                    <Button variant="ghost" onClick={() => setSidebarOpen(true)} className="lg:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">Welcome to Kiddzy Admin Dashboard</div>
                    </div>
                    </header>

                    {/* Page content */}
                    <main className="p-4 lg:p-6">{children}</main>
                </div>
            </div>
        </body>
    </html>
  )
}
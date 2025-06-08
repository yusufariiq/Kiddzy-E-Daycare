"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Phone, Building2, UserCheck, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Bookings",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Calendar,
  },
  {
    title: "Active Children",
    value: "856",
    change: "+8%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Emergency Contacts",
    value: "2,341",
    change: "+15%",
    changeType: "positive" as const,
    icon: Phone,
  },
  {
    title: "Providers",
    value: "45",
    change: "+3%",
    changeType: "positive" as const,
    icon: Building2,
  },
  {
    title: "Total Users",
    value: "3,456",
    change: "+18%",
    changeType: "positive" as const,
    icon: UserCheck,
  },
  {
    title: "Revenue",
    value: "Rp 125M",
    change: "+22%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-[#273F4F]">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your Kiddzy platform</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-[#FE7743]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#273F4F]">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#273F4F]">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-[#273F4F]">Emma Johnson</p>
                    <p className="text-sm text-gray-600">Little Stars Daycare</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#FE7743]">Rp 750,000</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#273F4F]">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Server Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Gateway</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email Service</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Warning
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

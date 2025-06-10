"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Eye, User } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface Child {
  _id: string
  fullname: string
  nickname: string
  age: number
  gender: "male" | "female" | "other"
  parentName: string
  parentEmail: string
  allergies: string[]
  specialNeeds?: string
  emergencyContacts: number
  activeBookings: number
  createdAt: string
}

export default function AdminChildren() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGender, setFilterGender] = useState<string>("all")

  useEffect(() => {
    const fetchChildren = async () => {
      const mockChildren: Child[] = [
        {
          _id: "1",
          fullname: "Emma Johnson",
          nickname: "Emmy",
          age: 4,
          gender: "female",
          parentName: "John Johnson",
          parentEmail: "john@example.com",
          allergies: ["Peanuts", "Dairy"],
          specialNeeds: "Requires afternoon nap at 2 PM",
          emergencyContacts: 2,
          activeBookings: 1,
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          _id: "2",
          fullname: "Lucas Smith",
          nickname: "Luke",
          age: 3,
          gender: "male",
          parentName: "Jane Smith",
          parentEmail: "jane@example.com",
          allergies: [],
          emergencyContacts: 1,
          activeBookings: 0,
          createdAt: "2024-01-10T09:00:00Z",
        },
      ]

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setChildren(mockChildren)
      setLoading(false)
    }

    fetchChildren()
  }, [])

  const filteredChildren = children.filter((child) => {
    const matchesSearch =
      child.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.parentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGender = filterGender === "all" || child.gender === filterGender
    return matchesSearch && matchesGender
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#273F4F]">Children</h1>
          <p className="text-gray-600 mt-1">Manage children profiles and information</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search children..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:border-[#FE7743] focus:outline-none"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </Card>

      {/* Children Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Children ({filteredChildren.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Child</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Age</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Gender</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Parent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Allergies</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Emergency Contacts</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Active Bookings</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChildren.map((child) => (
                    <tr key={child._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#FE7743] rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-[#273F4F]">{child.fullname}</div>
                            <div className="text-sm text-gray-600">"{child.nickname}"</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{child.age} years</td>
                      <td className="py-3 px-4 text-gray-600 capitalize">{child.gender}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-[#273F4F]">{child.parentName}</div>
                          <div className="text-sm text-gray-600">{child.parentEmail}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {child.allergies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {child.allergies.map((allergy, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                {allergy}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">{child.emergencyContacts}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            child.activeBookings > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {child.activeBookings}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

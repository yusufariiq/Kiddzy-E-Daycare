"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useAuth } from "@/context/auth.context"
import toast from "react-hot-toast"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: "user" | "admin" 
  createdAt: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const { token } = useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile')
        }

        setUsers(data.data)
        console.log(data.data)
      } catch (error: any) {
        toast.error(error.message || 'Failed to load profile')
      } finally {
        setLoading(false);
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "user":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#273F4F]">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {/* <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:border-[#FE7743] focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">user</option>
            <option value="admin">Admin</option>
          </select> */}
        </div>
      </Card>

      {/* Users Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" className="text-[#FE7743]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">First Name</th>
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">Last Name</th>
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">Email</th>
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">Phone</th>
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">Role</th>
                    <th className="text-left py-3 px-4 font-bold text-[#273F4F]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-[#273F4F]">{user.firstName}</td>
                      <td className="py-3 px-4 text-[#273F4F]">{user.lastName}</td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-gray-600">{user.phoneNumber}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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

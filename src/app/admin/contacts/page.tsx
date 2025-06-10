"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Eye, Phone } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface Contact {
  _id: string
  name: string
  phone: string
  email?: string
  relationship: string
  childName: string
  parentName: string
  isAuthorizedForPickup: boolean
  createdAt: string
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchContacts = async () => {
      const mockContacts: Contact[] = [
        {
          _id: "1",
          name: "Sarah Johnson",
          phone: "+62 812 3456 7890",
          email: "sarah@example.com",
          relationship: "grandmother",
          childName: "Emma Johnson",
          parentName: "John Johnson",
          isAuthorizedForPickup: true,
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          _id: "2",
          name: "Mike Smith",
          phone: "+62 813 4567 8901",
          relationship: "uncle",
          childName: "Lucas Smith",
          parentName: "Jane Smith",
          isAuthorizedForPickup: false,
          createdAt: "2024-01-10T09:00:00Z",
        },
      ]

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setContacts(mockContacts)
      setLoading(false)
    }

    fetchContacts()
  }, [])

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.parentName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#273F4F]">Emergency Contacts</h1>
          <p className="text-gray-600 mt-1">Manage emergency contacts and communication</p>
        </div>
        <Button className="bg-[#FE7743] hover:bg-[#e56a3a] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts ({filteredContacts.length})</CardTitle>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Contact Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Relationship</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Child</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Parent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Pickup Auth</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-[#273F4F]">{contact.name}</td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 capitalize">{contact.relationship}</td>
                      <td className="py-3 px-4 text-gray-600">{contact.childName}</td>
                      <td className="py-3 px-4 text-gray-600">{contact.parentName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            contact.isAuthorizedForPickup ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {contact.isAuthorizedForPickup ? "Authorized" : "Not Authorized"}
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

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  MessageSquare,
  Clock,
  Download,
  User,
  X,
  Mail,
  Archive,
} from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useAuth } from "@/context/auth.context"
import toast from "react-hot-toast"
import { Select } from "@/components/ui/select"

interface ContactMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: "read" | "unread" | "archived"
  isRead: boolean
  isArchived: boolean
  createdAt: string
}

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof ContactMessage>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [statusFilter, setStatusFilter] = useState<"all" | "read" | "unread" | "archived">("all")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [timeFrame, setTimeFrame] = useState<"all" | "today" | "week" | "month">("all")
  const [filterSubject, setFilterSubject] = useState("")
  const messageDetailRef = useRef<HTMLDivElement>(null)
  const { token } = useAuth()

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/contact', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch messages')
        }
        
        // Map the messages to include computed status
        const mappedMessages = data.data.map((msg: any) => ({
          ...msg,
          status: msg.isArchived ? 'archived' : (msg.isRead ? 'read' : 'unread')
        }))
        
        setMessages(mappedMessages)
      } catch (error: any) {
        toast.error(error.message || 'Failed to load messages')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [token])

  // Handle sorting
  const handleSort = (field: keyof ContactMessage) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filterTimeOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 days" },
  ]

  const filterSubjectOptions = [
    { value: "", label: "All Subject" },
    { value: "General Inquiry", label: "General Inquiry" },
    { value: "Payment Issue", label: "Payment Issue" },
    { value: "Feedback", label: "Feedback" },
    { value: "Technical Support", label: "Technical Support" },
    { value: "Other", label: "Other" },
  ]

  // Filter by time frame
  const filterByTimeFrame = (message: ContactMessage) => {
    if (timeFrame === "all") return true

    const messageDate = new Date(message.createdAt)
    const today = new Date()

    if (timeFrame === "today") {
      return messageDate.toDateString() === today.toDateString()
    }

    if (timeFrame === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(today.getDate() - 7)
      return messageDate >= weekAgo
    }

    if (timeFrame === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(today.getMonth() - 1)
      return messageDate >= monthAgo
    }

    return true
  }

  // Apply all filters and sorting
  const filteredAndSortedMessages = messages
    .filter((message) => {
      const matchesSearch = searchTerm === "" ||
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubject = filterSubject === "" || message.subject === filterSubject;
      
      const matchesTimeFrame = filterByTimeFrame ? filterByTimeFrame(message) : true;
      
      const matchesStatus = statusFilter === "all" || message.status === statusFilter;
      
      return matchesSearch && matchesTimeFrame && matchesSubject && matchesStatus;
      }
    )
    .sort((a, b) => {
      if (sortField === "createdAt") {
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }

      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Handle message view - with API call to mark as read
  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message)

    // Scroll to message detail section
    setTimeout(() => {
      if (messageDetailRef.current) {
        messageDetailRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)

    // Mark as read if it was unread
    if (message.status === "unread") {
      try {
        const response = await fetch(`/api/admin/contact/${message._id}/read`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to mark message as read')
        }

        const data = await response.json()
        
        // Update the message in state
        setMessages(messages.map((m) => 
          m._id === message._id 
            ? { ...m, status: "read" as const, isRead: true } 
            : m
        ))
        
        // Update selected message
        setSelectedMessage({ ...message, status: "read" as const, isRead: true })
        
        toast.success('Message marked as read')
      } catch (error: any) {
        toast.error(error.message || 'Failed to mark message as read')
      }
    }
  }

  // Handle message delete - with API call
  const handleDeleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete message')
      }

      // Remove from state
      setMessages(messages.filter((message) => message._id !== id))
      
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null)
      }
      
      toast.success('Message deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete message')
    }
  }

  // Handle message archive - with API call
  const handleArchiveMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contact/${id}/archive`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to archive message')
      }

      const data = await response.json()
      
      // Update the message in state
      setMessages(messages.map((message) => 
        message._id === id 
          ? { ...message, status: "archived" as const, isArchived: true } 
          : message
      ))
      
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status: "archived" as const, isArchived: true })
      }
      
      toast.success('Message archived successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to archive message')
    }
  }

  // Get counts for tabs
  const getStatusCount = (status: "all" | "read" | "unread" | "archived") => {
    if (status === "all") return messages.length
    return messages.filter((message) => message.status === status).length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#273F4F]">Contact Messages</h1>
          <p className="text-gray-600 mt-1">Manage and respond to contact form submissions</p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, subject or message content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="sm:w-48">
            <Select
              id="contactMessages"
              options={filterTimeOptions}
              placeholder="All Time"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as any)}
              className="py-3 px-5 border-gray-300 rounded-md focus:border-[#FE7743] focus:outline-none"
            />
          </div>
          <div className="sm:w-48">
            <Select
              id="contactMessages"
              options={filterSubjectOptions}
              placeholder="All Subjects"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value as any)}
              className="py-3 px-5 border-gray-300 rounded-md focus:border-[#FE7743] focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Messages Table with Tabs */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <CardTitle>Contact Messages</CardTitle>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                  statusFilter === "all" ? "bg-white text-[#273F4F] shadow-sm" : "text-gray-600 hover:text-[#273F4F]"
                }`}
              >
                All
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    statusFilter === "all" ? "bg-[#273F4F]/10 text-[#273F4F]" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {getStatusCount("all")}
                </span>
              </button>
              <button
                onClick={() => setStatusFilter("unread")}
                className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                  statusFilter === "unread" ? "bg-white text-[#FE7743] shadow-sm" : "text-gray-600 hover:text-[#FE7743]"
                }`}
              >
                Unread
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    statusFilter === "unread" ? "bg-[#FE7743]/10 text-[#FE7743]" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {getStatusCount("unread")}
                </span>
              </button>
              <button
                onClick={() => setStatusFilter("read")}
                className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                  statusFilter === "read" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-green-600"
                }`}
              >
                Read
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    statusFilter === "read" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {getStatusCount("read")}
                </span>
              </button>
              <button
                onClick={() => setStatusFilter("archived")}
                className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                  statusFilter === "archived" ? "bg-white text-gray-700 shadow-sm" : "text-gray-600 hover:text-gray-700"
                }`}
              >
                Archived
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    statusFilter === "archived" ? "bg-gray-200 text-gray-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {getStatusCount("archived")}
                </span>
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>{renderMessagesTable()}</CardContent>
      </Card>

      {/* Message Detail View (instead of Dialog) */}
      {selectedMessage && (
        <Card ref={messageDetailRef} className="border-2 border-[#FE7743]/20 animate-fadeIn">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-semibold text-[#273F4F]">{selectedMessage.subject}</CardTitle>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Calendar className="h-4 w-4" />
                {formatDate(selectedMessage.createdAt)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => setSelectedMessage(null)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[#273F4F]/5 rounded-lg">
              <div className="bg-[#273F4F] text-white rounded-full p-2">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-[#273F4F]">{selectedMessage.name}</p>
                <p className="text-sm text-gray-600">{selectedMessage.email}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              {selectedMessage.status !== "archived" && (
                <Button
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => handleArchiveMessage(selectedMessage._id)}
                >
                  <Archive className="h-4 w-4" />
                  Archive
                </Button>
              )}
              <Button
                className="bg-[#FE7743] hover:bg-[#FE7743]/90 flex items-center gap-1"
                onClick={() => {
                  window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`
                }}
              >
                <Mail className="h-4 w-4" />
                Reply via Email
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  function renderMessagesTable() {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" className="text-[#FE7743]" />
        </div>
      )
    }

    if (filteredAndSortedMessages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No messages found</h3>
          <p className="text-gray-500 max-w-sm mt-1">
            {searchTerm
              ? "Try adjusting your search or filters to find what you're looking for."
              : "There are no messages in this category yet."}
          </p>
        </div>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                <button className="flex items-center gap-1 hover:text-[#273F4F]" onClick={() => handleSort("status")}>
                  Status
                  {sortField === "status" && (
                    <span>
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                <button className="flex items-center gap-1 hover:text-[#273F4F]" onClick={() => handleSort("name")}>
                  Sender
                  {sortField === "name" && (
                    <span>
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                <button className="flex items-center gap-1 hover:text-[#273F4F]" onClick={() => handleSort("subject")}>
                  Subject
                  {sortField === "subject" && (
                    <span>
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                <button
                  className="flex items-center gap-1 hover:text-[#273F4F]"
                  onClick={() => handleSort("createdAt")}
                >
                  Date
                  {sortField === "createdAt" && (
                    <span>
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedMessages.map((message) => (
              <tr
                key={message._id}
                className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  message.status === "unread" ? "font-medium bg-[#FE7743]/5" : ""
                }`}
                onClick={() => handleViewMessage(message)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    {message.status === "unread" ? (
                      <span className="flex items-center text-[#FE7743]">
                        <span className="h-2 w-2 bg-[#FE7743] rounded-full mr-2"></span>
                        New
                      </span>
                    ) : message.status === "archived" ? (
                      <span className="flex items-center text-gray-500">
                        <span className="h-2 w-2 bg-gray-400 rounded-full mr-2"></span>
                        Archived
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        Read
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className={message.status === "unread" ? "text-[#273F4F]" : "text-gray-700"}>{message.name}</p>
                    <p className="text-xs text-gray-500">{message.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className={`line-clamp-1 ${message.status === "unread" ? "text-[#273F4F]" : "text-gray-700"}`}>
                    {message.subject}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span className="text-sm">{formatDate(message.createdAt)}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewMessage(message)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteMessage(message._id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  }
}
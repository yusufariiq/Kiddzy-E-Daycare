"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Eye, X, MapPin, Star } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ChildcareCard from "@/components/common/childcare-card"

interface Provider {
  _id: string
  name: string
  description: string
  address: string
  location: string
  whatsapp: string
  email: string
  images: string[]
  price: number
  features: string[]
  ageGroups: Array<{ min: number; max: number }>
  availability: boolean
  isActive: boolean
  capacity: number
  operatingHours: Array<{
    day: string
    open: string
    close: string
  }>
  rating?: number
  totalBookings?: number
  createdAt: string
}

interface ProviderFormData {
  name: string
  description: string
  address: string
  location: string
  whatsapp: string
  email: string
  images: string[]
  price: number
  features: string[]
  ageGroups: Array<{ min: number; max: number }>
  availability: boolean
  isActive: boolean
  capacity: number
  operatingHours: Array<{
    day: string
    open: string
    close: string
  }>
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function AdminProviders() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [newFeature, setNewFeature] = useState("")
  const [newImage, setNewImage] = useState("")

  const [formData, setFormData] = useState<ProviderFormData>({
    name: "",
    description: "",
    address: "",
    location: "",
    whatsapp: "",
    email: "",
    images: [],
    price: 0,
    features: [],
    ageGroups: [{ min: 0, max: 5 }],
    availability: true,
    isActive: true,
    capacity: 0,
    operatingHours: daysOfWeek.map((day) => ({
      day,
      open: "08:00",
      close: "17:00",
    })),
  })

  useEffect(() => {
    const fetchProviders = async () => {
      const mockProviders: Provider[] = [
        {
          _id: "1",
          name: "Little Stars Daycare",
          description: "A nurturing environment for children to learn and grow with experienced staff.",
          address: "123 Rainbow Street, Jakarta Selatan, DKI Jakarta 12345",
          location: "Jakarta Selatan",
          whatsapp: "+62 812 3456 7890",
          email: "info@littlestars.com",
          images: ["/placeholder.svg?height=200&width=300"],
          price: 150000,
          features: ["Indoor Playground", "Outdoor Area", "Learning Center", "Meals Included"],
          ageGroups: [{ min: 2, max: 6 }],
          availability: true,
          isActive: true,
          capacity: 30,
          operatingHours: [
            { day: "Monday", open: "07:00", close: "18:00" },
            { day: "Tuesday", open: "07:00", close: "18:00" },
            { day: "Wednesday", open: "07:00", close: "18:00" },
            { day: "Thursday", open: "07:00", close: "18:00" },
            { day: "Friday", open: "07:00", close: "18:00" },
            { day: "Saturday", open: "08:00", close: "16:00" },
            { day: "Sunday", open: "Closed", close: "Closed" },
          ],
          rating: 4.8,
          totalBookings: 156,
          createdAt: "2024-01-01T08:00:00Z",
        },
        {
          _id: "2",
          name: "Sunshine Kids Center",
          description: "Modern childcare facility with focus on early childhood development.",
          address: "456 Happy Lane, Jakarta Pusat, DKI Jakarta 10110",
          location: "Jakarta Pusat",
          whatsapp: "+62 813 4567 8901",
          email: "contact@sunshinekids.com",
          images: ["/placeholder.svg?height=200&width=300"],
          price: 175000,
          features: ["CCTV Monitoring", "Educational Programs", "Healthy Meals", "Art Classes"],
          ageGroups: [{ min: 1, max: 5 }],
          availability: true,
          isActive: true,
          capacity: 25,
          operatingHours: [
            { day: "Monday", open: "06:30", close: "19:00" },
            { day: "Tuesday", open: "06:30", close: "19:00" },
            { day: "Wednesday", open: "06:30", close: "19:00" },
            { day: "Thursday", open: "06:30", close: "19:00" },
            { day: "Friday", open: "06:30", close: "19:00" },
            { day: "Saturday", open: "08:00", close: "15:00" },
            { day: "Sunday", open: "Closed", close: "Closed" },
          ],
          rating: 4.6,
          totalBookings: 89,
          createdAt: "2024-01-15T10:00:00Z",
        },
      ]

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProviders(mockProviders)
      setLoading(false)
    }

    fetchProviders()
  }, [])

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      location: "",
      whatsapp: "",
      email: "",
      images: [],
      price: 0,
      features: [],
      ageGroups: [{ min: 0, max: 5 }],
      availability: true,
      isActive: true,
      capacity: 0,
      operatingHours: daysOfWeek.map((day) => ({
        day,
        open: "08:00",
        close: "17:00",
      })),
    })
    setEditingProvider(null)
    setShowForm(false)
  }

  const handleEdit = (provider: Provider) => {
    setFormData({
      name: provider.name,
      description: provider.description,
      address: provider.address,
      location: provider.location,
      whatsapp: provider.whatsapp,
      email: provider.email,
      images: provider.images,
      price: provider.price,
      features: provider.features,
      ageGroups: provider.ageGroups,
      availability: provider.availability,
      isActive: provider.isActive,
      capacity: provider.capacity,
      operatingHours: provider.operatingHours,
    })
    setEditingProvider(provider)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    resetForm()
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    })
  }

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()],
      })
      setNewImage("")
    }
  }

  const removeImage = (image: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img !== image),
    })
  }

  const addAgeGroup = () => {
    setFormData({
      ...formData,
      ageGroups: [...formData.ageGroups, { min: 0, max: 5 }],
    })
  }

  const removeAgeGroup = (index: number) => {
    setFormData({
      ...formData,
      ageGroups: formData.ageGroups.filter((_, i) => i !== index),
    })
  }

  const updateAgeGroup = (index: number, field: "min" | "max", value: number) => {
    const updatedAgeGroups = [...formData.ageGroups]
    updatedAgeGroups[index][field] = value
    setFormData({
      ...formData,
      ageGroups: updatedAgeGroups,
    })
  }

  const updateOperatingHours = (index: number, field: "open" | "close", value: string) => {
    const updatedHours = [...formData.operatingHours]
    updatedHours[index][field] = value
    setFormData({
      ...formData,
      operatingHours: updatedHours,
    })
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#273F4F]">
              {editingProvider ? "Edit Provider" : "Add New Provider"}
            </h1>
            <p className="text-gray-600 mt-1">
              {editingProvider ? "Update provider information" : "Create a new childcare provider"}
            </p>
          </div>
          <Button onClick={resetForm} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Provider Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+62 812 3456 7890"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Daily Price (Rp) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                  />
                  <span>Available for booking</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active provider</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="Image URL" />
                <Button type="button" onClick={addImage} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Provider image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        onClick={() => removeImage(image)}
                        variant="outline"
                        size="sm"
                        className="absolute top-1 right-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-[#FFF8F5] border border-[#FE7743]/20 rounded-full px-3 py-1"
                    >
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-[#FE7743] hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Age Groups */}
          <Card>
            <CardHeader>
              <CardTitle>Age Groups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.ageGroups.map((ageGroup, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label>Min Age:</Label>
                    <Input
                      type="number"
                      value={ageGroup.min}
                      onChange={(e) => updateAgeGroup(index, "min", Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>Max Age:</Label>
                    <Input
                      type="number"
                      value={ageGroup.max}
                      onChange={(e) => updateAgeGroup(index, "max", Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                  {formData.ageGroups.length > 1 && (
                    <Button type="button" onClick={() => removeAgeGroup(index)} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={addAgeGroup} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Age Group
              </Button>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.operatingHours.map((hours, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <Label className="font-medium">{hours.day}</Label>
                  <div>
                    <Label className="text-sm">Open</Label>
                    <Input
                      type="time"
                      value={hours.open}
                      onChange={(e) => updateOperatingHours(index, "open", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Close</Label>
                    <Input
                      type="time"
                      value={hours.close}
                      onChange={(e) => updateOperatingHours(index, "close", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" onClick={resetForm} variant="outline">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#FE7743] hover:bg-[#e56a3a] text-white">
              {editingProvider ? "Update Provider" : "Create Provider"}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#273F4F]">Providers</h1>
          <p className="text-gray-600 mt-1">Manage childcare providers and facilities</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-[#FE7743] hover:bg-[#e56a3a] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Providers Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <ChildcareCard
              key={provider._id}
              id={provider._id}
              image={provider.images[0] || "/placeholder.svg"}
              name={provider.name}
              location={provider.address}
              price={provider.price}
              // availability={provider.operatingHours[]}
            />
          ))}
        </div>
      )}

      {filteredProviders.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">No providers found matching your search criteria.</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

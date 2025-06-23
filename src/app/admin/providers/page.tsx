"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, X } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useAuth } from "@/context/auth.context"
import { useForm } from "react-hook-form"
import { ProviderData } from "@/lib/types/providers"
import toast from "react-hot-toast"
import ProviderCard from "@/components/common/provider-card"
import { ImageUpload } from "@/components/ui/image-upload"
import { Select } from "@/components/ui/select"

const providerSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  address: yup.string().required('Address is required'),
  location: yup.string().url('Must be a valid URL').required('Location is required'),
  whatsapp: yup
    .string()
    .matches(/^[0-9]+$/, 'Whatsapp number must be only digits')
    .required('Whatsapp number is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  images: yup
    .array()
    .of(yup.string().required('Image URL is required'))
    .min(1, 'At least one image is required'),
  price: yup.number().typeError('Price must be a number').positive('Price must be a positive number').required('Price is required'),
  features: yup.array().of(yup.string()).min(1, 'At least one feature is required'),
  ageGroups: yup
    .array()
    .of(
      yup.object().shape({
        min: yup.number().typeError('Minimum age must be a number').min(0, 'Minimum age cannot be negative').required('Minimum age is required'),
        max: yup
          .number()
          .typeError('Maximum age must be a number')
          .positive('Maximum age must be a positive number')
          .moreThan(yup.ref('min'), 'Maximum age must be greater than minimum age')
          .required('Maximum age is required'),
      })
    )
    .min(1, 'At least one age group is required'),
  capacity: yup.number().typeError('Capacity must be a number').integer('Capacity must be an integer').min(1, 'Capacity must be at least 1').required('Capacity is required'),
  operatingHours: yup
    .array()
    .of(
      yup.object().shape({
        day: yup.string().required('Day is required'),
        open: yup.string().required('Opening time is required'),
        close: yup.string().required('Closing time is required'),
      })
    )
    .min(1, 'At least one operating hour is required'),
})

type ProviderFormData = yup.InferType<typeof providerSchema>

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const filterOptions = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" }
]

export default function AdminProviders() {
  const [providers, setProviders] = useState<ProviderData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProvider, setEditingProvider] = useState<ProviderData | null>(null)
  const [newFeature, setNewFeature] = useState("")
  const { token } = useAuth()

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues
  } = useForm<ProviderFormData>({
    resolver: yupResolver(providerSchema),
    defaultValues: {
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
      capacity: 0,
      operatingHours: daysOfWeek.map((day, index) => ({
        day,
        open: index >= 5 ? "CLOSED" : "08:00",
        close: index >= 5 ? "CLOSED" : "17:00",
      })),
    }
  })

  const formData = watch()

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/providers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setProviders(data.data)
      } else {
        toast.error('Failed to fetch providers')
      }
    } catch (error) {
      toast.error('Failed to fetch providers')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ProviderFormData) => {
    if (!data.images || data.images.length === 0) {
      toast.error('At least one image is required')
      return
    }
    
    try {
      setLoading(true)
      
      const currentFormData = getValues()
      
      const url = editingProvider ? `/api/admin/providers/${editingProvider._id}` : '/api/admin/providers'
      const method = editingProvider ? 'PUT' : 'POST'
      
      const requestBody = {
        ...currentFormData,
        availability: true,
        isActive: true,
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        
        let errorMessage = `HTTP error! status: ${response.status}`
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error || errorData?.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        throw new Error(errorMessage)
      }
  
      const result = await response.json()
      toast.success(result.message || `Provider ${editingProvider ? 'updated' : 'created'} successfully`)
      resetForm()
      await fetchProviders()
    } catch (error: any) {
      console.error('Provider operation error:', error)
      toast.error(error.message || 'Operation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/providers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed')
      }

      toast.success('Provider deleted successfully')
      fetchProviders()
    } catch (error: any) {
      toast.error(error.message || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      (provider?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (provider?.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (provider?.address || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "" || 
      (filterStatus === "active" && provider?.isActive) ||
      (filterStatus === "inactive" && !provider?.isActive)

    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    reset()
    setEditingProvider(null)
    setShowForm(false)
  }

  const handleEdit = (provider: ProviderData) => {
    setEditingProvider(provider)
    setValue('name', provider.name)
    setValue('description', provider.description)
    setValue('address', provider.address)
    setValue('location', provider.location)
    setValue('whatsapp', provider.whatsapp)
    setValue('email', provider.email)
    setValue('images', provider.images)
    setValue('price', provider.price)
    setValue('features', provider.features)
    setValue('ageGroups', provider.ageGroups)
    setValue('capacity', provider.capacity)
    setValue('operatingHours', provider.operatingHours)

    setShowForm(true)
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setValue('features', [...formData.features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setValue('features', formData.features?.filter((f) => f !== feature))
  }

  const addAgeGroup = () => {
    setValue('ageGroups', [...formData.ageGroups, { min: 0, max: 5 }])
  }

  const removeAgeGroup = (index: number) => {
    setValue('ageGroups', formData.ageGroups?.filter((_, i) => i !== index))
  }

  const updateAgeGroup = (index: number, field: "min" | "max", value: number) => {
    const updatedAgeGroups = [...formData.ageGroups]
    updatedAgeGroups[index][field] = value
    setValue('ageGroups', updatedAgeGroups)
  }

  const updateOperatingHours = (index: number, field: "open" | "close", value: string) => {
    const currentHours = getValues('operatingHours')
    const updatedHours = [...currentHours]
    updatedHours[index][field] = value
    setValue('operatingHours', updatedHours)
  }

  const toggleDayStatus = (index: number, isClosed: boolean) => {
    const currentHours = getValues('operatingHours')
    const updatedHours = [...currentHours]
    
    if (isClosed) {
      updatedHours[index] = {
        ...updatedHours[index],
        open: "CLOSED",
        close: "CLOSED"
      }
    } else {
      updatedHours[index] = {
        ...updatedHours[index],
        open: "08:00",
        close: "17:00"
      }
    }
    setValue('operatingHours', updatedHours)
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

        <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Childcare Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    {...register('name')}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Input
                    id="location"
                    {...register('location')}
                  />
                  {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div>
                <Label htmlFor="address">Full Address <span className="text-red-500">*</span></Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  rows={2}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="whatsapp"
                    {...register('whatsapp')}
                    placeholder="+62 812 3456 7890"
                  />
                  {errors.whatsapp && <p className="text-sm text-red-500">{errors.whatsapp.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Daily Price (Rp) <span className="text-red-500">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                  />
                  {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity <span className="text-red-500">*</span></Label>
                  <Input
                    id="capacity"
                    type="number"
                    {...register('capacity', { valueAsNumber: true })}
                  />
                  {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                images={formData.images}
                onImagesChange={(newImages) => setValue('images', newImages)}
                maxImages={8}
              />
              {errors.images && <p className="text-sm text-red-500">{errors.images.message}</p>}
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
                <Button type="button" onClick={addFeature} className="text-white rounded-lg h-auto">
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
              {errors.features && <p className="text-sm text-red-500">{errors.features.message}</p>}
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
              <Button type="button" onClick={addAgeGroup} className="text-white rounded-lg h-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Age Group
              </Button>
              {errors.ageGroups && <p className="text-sm text-red-500">{errors.ageGroups.message}</p>}
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.operatingHours.map((hours, index) => {
                const isClosed = hours.open === "CLOSED" || hours.close === "CLOSED"
                
                return (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center">
                    <Label className="font-medium">{hours.day}</Label>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!isClosed}
                        onChange={(e) => toggleDayStatus(index, !e.target.checked)}
                        className="w-4 h-4 text-[#FE7743] border-gray-300 rounded focus:ring-[#FE7743]"
                      />
                      <Label className="text-sm">Open</Label>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Open Time</Label>
                      <Input
                        type="time"
                        value={isClosed ? "" : hours.open}
                        onChange={(e) => updateOperatingHours(index, "open", e.target.value)}
                        disabled={isClosed}
                        className={isClosed ? "bg-gray-100" : ""}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm">Close Time</Label>
                      <Input
                        type="time"
                        value={isClosed ? "" : hours.close}
                        onChange={(e) => updateOperatingHours(index, "close", e.target.value)}
                        disabled={isClosed}
                        className={isClosed ? "bg-gray-100" : ""}
                      />
                    </div>
                  </div>
                )
              })}
              {errors.operatingHours && <p className="text-sm text-red-500">{errors.operatingHours.message}</p>}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" onClick={resetForm} variant="outline">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#FE7743] hover:bg-[#e56a3a] text-white" disabled={loading}>
              {loading ? 'Processing...' : (editingProvider ? "Update Provider" : "Create Provider")}
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

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select
              id="statusFilter"
              options={filterOptions}
              placeholder="All Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Providers Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" className="text-[#FE7743]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider._id}
              provider={provider}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
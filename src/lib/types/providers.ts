export interface ProviderData {
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
    _id: string
    day: string
    open: string
    close: string
  }>
  createdAt: string
}

export interface OperatingHours {
  _id: string
  day: string
  open: string
  close: string
}
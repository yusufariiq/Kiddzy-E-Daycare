import { Children } from "./children"
import { ProviderData } from "./providers"
import { User } from "./user"

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
  isAuthorizedForPickup: boolean
}

export default interface Booking {
  _id: string
  bookingId: string
  childName: string
  providerName: string
  providerAddress: string
  startDate: Date
  endDate: Date
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  totalAmount: number
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
  notes?: string
  childrenIds: Children[]
  childrenCount: number
  emergencyContact: EmergencyContact
  userId: User
  providerId: ProviderData
}
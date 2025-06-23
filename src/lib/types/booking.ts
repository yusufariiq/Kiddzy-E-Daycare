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
  startDate: string
  endDate: string
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  totalAmount: number
  paymentMethod: string
  createdAt: string
  notes?: string
  childrenIds: Children[]
  childrenCount: number
  emergencyContact: EmergencyContact
  userId: User
  providerId: ProviderData
}
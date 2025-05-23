export interface User {
    _id: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    role: 'user' | 'admin'
    createdAt: string
    updatedAt: string
    address?: string
}
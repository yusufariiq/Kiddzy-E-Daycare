export interface OperationalStatus {
    isOpen: boolean
    message: string
    status: 'open' | 'closed'
    nextOpeningTime?: string
}
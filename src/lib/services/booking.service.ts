import { BookingRepository } from '../repositories/booking.repository';
import { ProviderRepository } from '../repositories/provider.repostiroy';
import { IBooking } from '../models/booking.model';

export interface CreateBookingData {
  providerId: string;
  childId: string;
  startDate: Date;
  endDate: Date;
  childrenCount: number;
  paymentMethod: 'debit_card' | 'bank_transfer' | 'e_wallet';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
}

export class BookingService {
  private bookingRepository: BookingRepository;
  private providerRepository: ProviderRepository;
  
  constructor() {
    this.bookingRepository = new BookingRepository();
    this.providerRepository = new ProviderRepository();
  }

  async createBooking(userId: string, bookingData: CreateBookingData): Promise<IBooking> {
    // Check if provider exists
    const provider = await this.providerRepository.findById(bookingData.providerId?.toString() || '');
    
    if (!provider) {
      throw new Error('Provider not found');
    }
    
    if (!provider.availability) {
      throw new Error('Provider is not available for booking');
    }
    
    const startDate = new Date(bookingData.startDate as Date);
    const endDate = new Date(bookingData.endDate as Date);
    
    if (startDate > endDate) {
      throw new Error('End date must be after start date');
    }
    
    const conflictingBookings = await this.bookingRepository.findConflictingBookings(
      bookingData.providerId,
      startDate,
      endDate
    );

    if (conflictingBookings.length > 0) {
      throw new Error('Provider is not available for the selected dates');
    }

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = provider.price * days * (bookingData.childrenCount || 1);
    
    const booking = await this.bookingRepository.create({
      userId,
      providerId: bookingData.providerId,
      childId: bookingData.childId,
      startDate,
      endDate,
      childrenCount: bookingData.childrenCount,
      totalAmount,
      paymentMethod: bookingData.paymentMethod,
      emergencyContact: bookingData.emergencyContact,
      notes: bookingData.notes,
      status: 'pending'
    });

    return booking;
  }

  async getUserBookings(userId: string, filter?: 'active' | 'completed' | 'cancelled'): Promise<IBooking[]> {
    switch (filter) {
      case 'active':
        return await this.bookingRepository.findActiveByUser(userId);
      case 'completed':
        return await this.bookingRepository.findCompletedByUser(userId);
      case 'cancelled':
        return await this.bookingRepository.findCancelledByUser(userId);
      default:
        return await this.bookingRepository.findByUser(userId);
    }
  }

  async getProviderBookings(providerId: string, filter?: 'active' | 'completed' | 'cancelled'): Promise<IBooking[]> {
    switch (filter) {
      case 'active':
        return await this.bookingRepository.findActiveByProvider(providerId);
      case 'completed':
        return await this.bookingRepository.findCompletedByProvider(providerId);
      case 'cancelled':
        return await this.bookingRepository.findCancelledByProvider(providerId);
      default:
        return await this.bookingRepository.findByProvider(providerId);
    }
  }

  async getBookingDetails(bookingId: string, requesterId: string): Promise<IBooking | null> {
    const booking = await this.bookingRepository.findById(bookingId);
    
    if (!booking) {
      return null;
    }
    
    // Check if requester has permission to view this booking
    if (booking.userId.id.toString() !== requesterId) {
      throw new Error('Unauthorized to view this booking');
    }
    
    return booking;
  }

  async updateBookingStatus(
    bookingId: string, 
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled',
  ): Promise<IBooking | null> {
    const booking = await this.bookingRepository.findById(bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Validate status transitions
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['active', 'cancelled'],
      'active': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    };
    
    if (!validTransitions[booking.status].includes(status)) {
      throw new Error(`Cannot change status from ${booking.status} to ${status}`);
    }
    
    return await this.bookingRepository.updateStatus(bookingId, status);
  }

  async cancelBooking(bookingId: string, userId: string, reason?: string): Promise<IBooking | null> {
    const booking = await this.bookingRepository.findById(bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    if (booking.userId.id.toString() !== userId) {
      throw new Error('Unauthorized to cancel this booking');
    }
    
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      throw new Error('Cannot cancel a completed or already cancelled booking');
    }
    
    // Add cancellation reason to notes if provided
    const updatedNotes = reason 
      ? `${booking.notes || ''}\nCancellation reason: ${reason}`.trim()
      : booking.notes;
    
    await this.bookingRepository.updateNotes(bookingId, updatedNotes);
    
    return await this.bookingRepository.updateStatus(bookingId, 'cancelled');
  }

  async getAllBookings(adminId: string): Promise<IBooking[]> {
    return await this.bookingRepository.findAll();
  }

  async getBookingStatistics(providerId?: string) {
    return await this.bookingRepository.getBookingStatistics(providerId);
  }
}
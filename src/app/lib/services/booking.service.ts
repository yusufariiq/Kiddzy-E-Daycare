import { BookingRepository } from '../repositories/booking.repository';
import { ProviderRepository } from '../repositories/provider.repostiroy';
import { IBooking } from '../models/booking.model';

export class BookingService {
  private bookingRepository: BookingRepository;
  private providerRepository: ProviderRepository;
  
  constructor() {
    this.bookingRepository = new BookingRepository();
    this.providerRepository = new ProviderRepository();
  }

  async createBooking(bookingData: Partial<IBooking>): Promise<IBooking> {
    // Check if provider exists
    const provider = await this.providerRepository.findById(bookingData.providerId?.toString() || '');
    
    if (!provider) {
      throw new Error('Provider not found');
    }
    
    if (!provider.availability) {
      throw new Error('Provider is not available for booking');
    }
    
    // Calculate total amount based on provider's price and booking duration
    const startDate = new Date(bookingData.startDate as Date);
    const endDate = new Date(bookingData.endDate as Date);
    
    if (startDate >= endDate) {
      throw new Error('End date must be after start date');
    }
    
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = provider.price * days * (bookingData.childrenCount || 1);
    
    const booking = await this.bookingRepository.create({
      ...bookingData,
      totalAmount
    });
    
    return booking;
  }

  async getUserBookings(userId: string): Promise<IBooking[]> {
    return await this.bookingRepository.findByUser(userId);
  }

  async getUserActiveBookings(userId: string): Promise<IBooking[]> {
    return await this.bookingRepository.findActiveByUser(userId);
  }

  async getUserCompletedBookings(userId: string): Promise<IBooking[]> {
    return await this.bookingRepository.findCompletedByUser(userId);
  }

  async getBookingDetails(bookingId: string): Promise<IBooking | null> {
    return await this.bookingRepository.findById(bookingId);
  }

  async updateBookingStatus(bookingId: string, status: 'pending' | 'active' | 'completed' | 'canceled'): Promise<IBooking | null> {
    return await this.bookingRepository.updateStatus(bookingId, status);
  }

  async processPayment(bookingId: string, paymentId: string): Promise<IBooking | null> {
    return await this.bookingRepository.updatePayment(bookingId, paymentId);
  }
}
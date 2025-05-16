import { Booking, IBooking } from '../models/booking.model';

export class BookingRepository {
    async create(bookingData: Partial<IBooking>): Promise<IBooking> {
        return await Booking.create(bookingData);
    }

    async findById(id: string): Promise<IBooking | null> {
        return await Booking.findById(id).populate('provider').populate('user');
    }

    async findByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ user: userId })
        .populate('provider')
        .sort({ createdAt: -1 });
    }

    async findActiveByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ 
        user: userId,
        status: { $in: ['pending', 'active'] }
        })
        .populate('provider')
        .sort({ startDate: 1 });
    }

    async findCompletedByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ 
        user: userId,
        status: { $in: ['completed', 'canceled'] }
        })
        .populate('provider')
        .sort({ createdAt: -1 });
    }

    async updateStatus(id: string, status: 'pending' | 'active' | 'completed' | 'canceled'): Promise<IBooking | null> {
        return await Booking.findByIdAndUpdate(id, { status }, { new: true });
    }

    async updatePayment(id: string, paymentId: string): Promise<IBooking | null> {
        return await Booking.findByIdAndUpdate(id, { 
        paymentId, 
        paymentStatus: 'completed' 
        }, { new: true });
    }
}
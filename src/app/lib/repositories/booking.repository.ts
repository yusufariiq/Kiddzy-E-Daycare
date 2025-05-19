import { Booking, IBooking } from '../models/booking.model';

export class BookingRepository {
    async create(bookingData: Partial<IBooking>): Promise<IBooking> {
        return await Booking.create(bookingData);
    }

    async findById(id: string): Promise<IBooking | null> {
        return await Booking.findById(id)
            .populate('providerId').populate('userId').populate('childId');
    }
      
    async findByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ userId })
            .populate('providerId')
            .populate('userId')
            .populate('childId')
            .sort({ createdAt: -1 });
    }

    async findByProvider(providerId: string): Promise<IBooking[]> {
        return await Booking.find({ providerId })
            .populate('userId')
            .populate('childId')
            .sort({ startDate: 1 });
    }

    async findActiveByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            userId,
            status: { $in: ['pending', 'confirmed', 'active'] }
        })
        .populate('providerId')
        .populate('childId')
        .sort({ startDate: 1 });
    }

    async findActiveByProvider(providerId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            providerId,
            status: { $in: ['pending', 'confirmed', 'active'] }
        })
        .populate('userId')
        .populate('childId')
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

    async findCompletedByProvider(providerId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            providerId,
            status: { $in: ['completed', 'cancelled'] }
        })
        .populate('userId')
        .populate('childId')
        .sort({ startDate: -1 });
    }

    async updateStatus(id: string, status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'): Promise<IBooking | null> {
        return await Booking.findByIdAndUpdate(id, { status }, { new: true })
            .populate('providerId')
            .populate('userId')
            .populate('childId');
    }

    async updatePayment(id: string, paymentId: string, paymentMethod: string): Promise<IBooking | null> {
        return await Booking.findByIdAndUpdate(id, { 
            paymentId, 
            paymentMethod,
            paymentStatus: 'paid' 
        }, { new: true })
            .populate('providerId')
            .populate('userId')
            .populate('childId');
    }

    async findAll(): Promise<IBooking[]> {
        return await Booking.find({})
            .populate('providerId')
            .populate('userId')
            .populate('childId')
            .sort({ createdAt: -1 });
    }
}
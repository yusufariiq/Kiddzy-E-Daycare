import { Booking, IBooking } from '../models/booking.model';

export class BookingRepository {
    async create(bookingData: Partial<IBooking>): Promise<IBooking> {
        const booking = new Booking(bookingData);
        return await booking.save();
    }

    async findById(id: string): Promise<IBooking | null> {
        return await Booking.findById(id)
            .populate('providerId', 'name email whatsapp address pricePerDay services')
            .populate('userId', 'name email whatsapp')
            .populate('childId', 'fullname nickname age gender specialNeeds allergies');
    }
      
    async findByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ userId })
            .populate('providerId', 'name email whatsapp address pricePerDay services')
            .populate('childId', 'fullname nickname age gender')
            .sort({ createdAt: -1 });
    }

    async findByProvider(providerId: string): Promise<IBooking[]> {
        return await Booking.find({ providerId })
            .populate('userId', 'name email whatsapp')
            .populate('childId', 'fullname nickname age gender specialNeeds allergies')
            .sort({ startDate: 1 });
    }

    async findActiveByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            userId,
            status: { $in: ['pending', 'confirmed', 'active'] }
        })
        .populate('providerId', 'name email whatsapp address')
        .populate('childId', 'fullname nickname age gender')
        .sort({ startDate: 1 });
    }

    async findActiveByProvider(providerId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            providerId,
            status: { $in: ['pending', 'confirmed', 'active'] }
        })
        .populate('userId', 'name email whatsapp')
        .populate('childId', 'fullname nickname age gender specialNeeds allergies')
        .sort({ startDate: 1 });
    }

    async findCompletedByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            userId,
            status: 'completed'
        })
        .populate('providerId', 'name email whatsapp address')
        .populate('childId', 'fullname nickname age gender')
        .sort({ endDate: -1 });
    }

    async findCompletedByProvider(providerId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            providerId,
            status: 'completed'
        })
        .populate('userId', 'name email whatsapp')
        .populate('childId', 'fullname nickname age gender')
        .sort({ endDate: -1 });
    }

    async findCancelledByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            userId,
            status: 'cancelled'
        })
        .populate('providerId', 'name email whatsapp address')
        .populate('childId', 'fullname nickname age gender')
        .sort({ updatedAt: -1 });
    }

    async findCancelledByProvider(providerId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            providerId,
            status: 'cancelled'
        })
        .populate('userId', 'name email whatsapp')
        .populate('childId', 'fullname nickname age gender')
        .sort({ updatedAt: -1 });
    }

    async findConflictingBookings(providerId: string, startDate: Date, endDate: Date): Promise<IBooking[]> {
        return await Booking.find({
            providerId,
            status: { $in: ['pending', 'confirmed', 'active'] },
            $or: [
                {
                    startDate: { $lt: endDate },
                    endDate: { $gt: startDate }
                }
            ]
        });
    }

    async updateStatus(id: string, status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'): Promise<IBooking | null> {
        return await Booking.findByIdAndUpdate(
            id, 
            { status, updatedAt: new Date() }, 
            { new: true }
        )
        .populate('providerId', 'name email whatsapp address')
        .populate('userId', 'name email whatsapp')
        .populate('childId', 'fullname nickname age gender');
    }

    async updateNotes(id: string, notes: string): Promise<IBooking | null> {
        return await Booking.findByIdAndUpdate(
            id, 
            { notes, updatedAt: new Date() }, 
            { new: true }
        );
    }

    async findAll(): Promise<IBooking[]> {
        return await Booking.find({})
            .populate('providerId', 'name email whatsapp address')
            .populate('userId', 'name email whatsapp')
            .populate('childId', 'fullname nickname age gender')
            .sort({ createdAt: -1 });
    }

    async getBookingStatistics(providerId?: string) {
        const matchStage = providerId ? { providerId } : {};
        
        const stats = await Booking.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        const totalBookings = await Booking.countDocuments(matchStage);
        const totalRevenue = await Booking.aggregate([
            { $match: { ...matchStage, status: { $in: ['completed', 'active'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        return {
            totalBookings,
            totalRevenue: totalRevenue[0]?.total || 0,
            statusBreakdown: stats,
            monthlyStats: await this.getMonthlyBookingStats(providerId)
        };
    }

    private async getMonthlyBookingStats(providerId?: string) {
        const matchStage = providerId ? { providerId } : {};
        
        return await Booking.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    bookingCount: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]);
    }

    async findUpcomingBookings(userId: string, days: number = 7): Promise<IBooking[]> {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + days);

        return await Booking.find({
            userId,
            startDate: { $gte: now, $lte: futureDate },
            status: { $in: ['confirmed', 'active'] }
        })
        .populate('providerId', 'name whatsapp address')
        .populate('childId', 'fullname nickname age')
        .sort({ startDate: 1 });
    }

    async findBookingsByDateRange(startDate: Date, endDate: Date, providerId?: string): Promise<IBooking[]> {
        const query: any = {
            $or: [
                {
                    startDate: { $gte: startDate, $lte: endDate }
                },
                {
                    endDate: { $gte: startDate, $lte: endDate }
                },
                {
                    startDate: { $lte: startDate },
                    endDate: { $gte: endDate }
                }
            ]
        };

        if (providerId) {
            query.providerId = providerId;
        }

        return await Booking.find(query)
            .populate('providerId', 'name email whatsapp')
            .populate('userId', 'name email whatsapp')
            .populate('childId', 'fullname nickname age gender')
            .sort({ startDate: 1 });
    }
}
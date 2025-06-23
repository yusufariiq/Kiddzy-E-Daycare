import { Booking, IBooking } from '../models/booking.model';

export interface DateAvailability {
    date: string
    availableSlots: number
    totalCapacity: number
    status: 'available' | 'limited' | 'full' | 'closed'
    bookings: number
  }
  
export interface CalendarAvailability {
providerId: string
dateRange: {
    start: string
    end: string
}
availability: DateAvailability[]
}

export class BookingRepository {
    async create(bookingData: Partial<IBooking>): Promise<IBooking> {
        const booking = new Booking(bookingData);
        return await booking.save();
    }

    async findById(id: string): Promise<IBooking | null> {
        return await Booking.findById(id)
            .populate('providerId', 'name email whatsapp address pricePerDay services')
            .populate('userId', 'firstName lastName email phoneNumber')
            .populate('childrenIds', 'fullname nickname age gender specialNeeds allergies');
    }
      
    async findByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ userId })
            .populate('providerId', 'name email whatsapp address pricePerDay services')
            .populate('childrenIds', 'fullname nickname age gender')
            .sort({ createdAt: -1 });
    }

    async findByProvider(providerId: string): Promise<IBooking[]> {
        return await Booking.find({ providerId })
            .populate('userId', 'firstName lastName email phoneNumber')
            .populate('childrenIds', 'fullname nickname age gender specialNeeds allergies')
            .sort({ startDate: 1 });
    }

    async findActiveByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            userId,
            status: { $in: ['pending', 'confirmed', 'active'] }
        })
        .populate('providerId', 'name email whatsapp address')
        .populate('childrenIds', 'fullname nickname age gender')
        .sort({ startDate: 1 });
    }

    async findActiveByProvider(providerId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            providerId,
            status: { $in: ['pending', 'confirmed', 'active'] }
        })
        .populate('userId', 'firstName lastName email phoneNumber')
        .populate('childrenIds', 'fullname nickname age gender specialNeeds allergies')
        .sort({ startDate: 1 });
    }

    async findCompletedByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            userId,
            status: 'completed'
        })
        .populate('providerId', 'name email whatsapp address')
        .populate('childrenIds', 'fullname nickname age gender')
        .sort({ endDate: -1 });
    }

    async findCompletedByProvider(providerId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            providerId,
            status: 'completed'
        })
        .populate('userId', 'firstName lastName email phoneNumber')
        .populate('childrenIds', 'fullname nickname age gender')
        .sort({ endDate: -1 });
    }

    async findCancelledByUser(userId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            userId,
            status: 'cancelled'
        })
        .populate('providerId', 'name email whatsapp address')
        .populate('childrenIds', 'fullname nickname age gender')
        .sort({ updatedAt: -1 });
    }

    async findCancelledByProvider(providerId: string): Promise<IBooking[]> {
        return await Booking.find({ 
            providerId,
            status: 'cancelled'
        })
        .populate('userId', 'firstName lastName email phoneNumber')
        .populate('childrenIds', 'fullname nickname age gender')
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
        .populate('userId', 'firstName lastName email phoneNumber')
        .populate('childrenIds', 'fullname nickname age gender');
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
            .populate('userId', 'firstName lastName email phoneNumber')
            .populate('childrenIds', 'fullname nickname age gender')
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
        .populate('childrenIds', 'fullname nickname age')
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
            .populate('userId', 'firstName lastName email phoneNumber')
            .populate('childrenIds', 'fullname nickname age gender')
            .sort({ startDate: 1 });
    }

    async getDateRangeAvailability(
        providerId: string,
        startDate: Date,
        endDate: Date,
        providerCapacity: number,
        operatingHours: Array<{ day: string; open: string; close: string }>
      ): Promise<DateAvailability[]> {
        const availability: DateAvailability[] = []
        
        // Get all bookings in the date range
        const bookings = await Booking.find({
          providerId,
          status: { $in: ['confirmed', 'pending'] },
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        })
    
        // Create booking count map by date
        const bookingsByDate = new Map<string, number>()
        
        bookings.forEach(booking => {
          const current = new Date(booking.startDate)
          const end = new Date(booking.endDate)
          
          while (current <= end) {
            const dateKey = current.toISOString().split('T')[0]
            const currentCount = bookingsByDate.get(dateKey) || 0
            bookingsByDate.set(dateKey, currentCount + (booking.childrenCount || 1))
            current.setDate(current.getDate() + 1)
          }
        })
    
        // Generate availability for each date
        const current = new Date(startDate)
        while (current <= endDate) {
          const dateKey = current.toISOString().split('T')[0]
          const dayName = current.toLocaleDateString('en-US', { weekday: 'long' })
          
          // Check if provider is open on this day
          const daySchedule = operatingHours.find(
            schedule => schedule.day.toLowerCase() === dayName.toLowerCase()
          )
          
          const isWeekend = current.getDay() === 0 || current.getDay() === 6
          const isClosed = !daySchedule || daySchedule.open === "CLOSED" || isWeekend
          
          const bookingsCount = bookingsByDate.get(dateKey) || 0
          const availableSlots = Math.max(0, providerCapacity - bookingsCount)
          
          let status: 'available' | 'limited' | 'full' | 'closed'
          if (isClosed) {
            status = 'closed'
          } else if (availableSlots === 0) {
            status = 'full'
          } else if (availableSlots <= providerCapacity * 0.3) { // Less than 30% capacity
            status = 'limited'
          } else {
            status = 'available'
          }
    
          availability.push({
            date: dateKey,
            availableSlots: isClosed ? 0 : availableSlots,
            totalCapacity: providerCapacity,
            status,
            bookings: bookingsCount
          })
          
          current.setDate(current.getDate() + 1)
        }
        
        return availability
    }

    async checkMultipleChildrenAvailability(
        providerId: string,
        startDate: Date,
        endDate: Date,
        childrenCount: number,
        providerCapacity: number,
        operatingHours: Array<{ day: string; open: string; close: string }>
      ): Promise<{
        available: boolean
        unavailableDates: string[]
        reason?: string
      }> {
        const availability = await this.getDateRangeAvailability(
          providerId,
          startDate,
          endDate,
          providerCapacity,
          operatingHours
        )
    
        const unavailableDates: string[] = []
        
        for (const dayAvailability of availability) {
          if (dayAvailability.status === 'closed') {
            unavailableDates.push(dayAvailability.date)
          } else if (dayAvailability.availableSlots < childrenCount) {
            unavailableDates.push(dayAvailability.date)
          }
        }
    
        return {
          available: unavailableDates.length === 0,
          unavailableDates,
          reason: unavailableDates.length > 0 
            ? `Insufficient capacity or closed on ${unavailableDates.length} day(s)`
            : undefined
        }
      }
    
      // Get calendar data for a month view
    async getMonthlyAvailability(
        providerId: string,
        year: number,
        month: number, // 0-based (0 = January)
        providerCapacity: number,
        operatingHours: Array<{ day: string; open: string; close: string }>
    ): Promise<CalendarAvailability> {
        const startDate = new Date(year, month, 1)
        const endDate = new Date(year, month + 1, 0) // Last day of month
        
        const availability = await this.getDateRangeAvailability(
          providerId,
          startDate,
          endDate,
          providerCapacity,
          operatingHours
        )
    
        return {
          providerId,
          dateRange: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
          },
          availability
        }
    }
}
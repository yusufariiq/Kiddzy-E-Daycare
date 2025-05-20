import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { BookingService } from '@/lib/services/booking.service';
import { verifyAuth } from '@/lib/middleware/auth.middleware';

const bookingService = new BookingService();

connectDB();

export async function GET(req: NextRequest) {
    try {
        const authResult = await verifyAuth(req);
        
        if (!authResult.isAuthenticated) {
          return NextResponse.json(
            { error: authResult.error },
            { status: authResult.status || 401 }
          );
        }
        
        const userId = authResult.userId as string;
        const url = new URL(req.url);
        const filter = url.searchParams.get('filter');
        
        let bookings;
        
        if (filter === 'active') {
          bookings = await bookingService.getUserActiveBookings(userId);
        } else if (filter === 'completed') {
          bookings = await bookingService.getUserCompletedBookings(userId);
        } else {
          bookings = await bookingService.getUserBookings(userId);
        }
        
        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to fetch bookings' },
          { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const authResult = await verifyAuth(req);

        if (!authResult.isAuthenticated) {
            return NextResponse.json(
              { error: authResult.error },
              { status: authResult.status || 401 }
            );
        }

        const userId = authResult.userId as string;
        const data = await req.json();

        const requiredFields = ['providerId', 'childId', 'startDate', 'endDate', 'childrenCount'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
              { error: `Missing required fields: ${missingFields.join(', ')}` },
              { status: 400 }
            );
        }

        // Validate dates
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return NextResponse.json(
              { error: 'Invalid date format' },
              { status: 400 }
            );
        }

        const booking = await bookingService.createBooking({
            ...data,
            userId
        });

        return NextResponse.json({ booking }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create booking' },
            { status: error.message?.includes('not found') ? 404 : 500 }
        );
    }
}
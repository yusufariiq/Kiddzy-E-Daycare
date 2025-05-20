import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/middleware/auth.middleware';
import { BookingService } from '@/lib/services/booking.service';
import connectDB from '@/config/db';

const bookingService = new BookingService();

connectDB();

export async function GET(req: NextRequest) {
    try {
        const authResult = await verifyAdmin(req);
        
        if (!authResult.isAuthenticated) {
          return NextResponse.json(
            { error: authResult.error },
            { status: authResult.status || 401 }
          );
        }
        
        const url = new URL(req.url);
        const status = url.searchParams.get('status');
        
        let bookings;
        
        // Get all bookings
        bookings = await bookingService.getAllBookings();
        
        // Filter by status if specified
        if (status) {
          bookings = bookings.filter(booking => booking.status === status);
        }
        
        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching admin bookings:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to fetch bookings' },
          { status: 500 }
        );
    }
}
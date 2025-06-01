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
      const filter = url.searchParams.get('filter') as 'active' | 'completed' | 'cancelled' | undefined;
      
      // Get filtered bookings for the user
      const bookings = await bookingService.getUserBookings(userId, filter);
      
      return NextResponse.json({ 
          bookings,
          count: bookings.length,
          filter: filter || 'all'
      }, { status: 200 });
      
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

        // Validate required fields
        const requiredFields = ['providerId', 'childrenIds', 'startDate', 'endDate', 'childrenCount', 'paymentMethod', 'totalAmount'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        if (!Array.isArray(data.childrenIds) || data.childrenIds.length === 0) {
            return NextResponse.json(
                { error: 'childrenIds must be a non-empty array' },
                { status: 400 }
            );
        }

        if (!Number.isFinite(data.totalAmount) || data.totalAmount <= 0) {
            return NextResponse.json(
                { error: 'Total amount must be a positive number' },
                { status: 400 }
            );
        }

        // Validate payment method
        const validPaymentMethods = ['debit_card', 'bank_transfer', 'e_wallet'];

        if (!validPaymentMethods.includes(data.paymentMethod)) {
            return NextResponse.json(
                { error: 'Invalid payment method' },
                { status: 400 }
            );
        }

        // Validate dates
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return NextResponse.json(
                { error: 'Invalid date format. Please use ISO date format.' },
                { status: 400 }
            );
        }

        // Validate children count
        if (!Number.isInteger(data.childrenCount) || data.childrenCount < 1) {
            return NextResponse.json(
                { error: 'Children count must be a positive integer' },
                { status: 400 }
            );
        }

        if (data.childrenCount !== data.childrenIds.length) {
            return NextResponse.json(
                { error: 'Children count must match the number of children IDs provided' },
                { status: 400 }
            );
        }

        // Create booking
        const booking = await bookingService.createBooking(userId, {
            providerId: data.providerId,
            childrenIds: data.childrenIds,
            startDate,
            endDate,
            childrenCount: data.childrenCount,
            paymentMethod: data.paymentMethod,
            emergencyContact: data.emergencyContact,
            totalAmount: data.totalAmount,
            notes: data.notes
        });

        return NextResponse.json({ 
            booking,
            message: 'Booking created successfully'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating booking:', error);
        
        let statusCode = 500;
        if (error.message?.includes('not found')) {
            statusCode = 404;
        } else if (error.message?.includes('not available')) {
            statusCode = 409;
        } else if (error.message?.includes('future') || error.message?.includes('after')) {
            statusCode = 400;
        }

        return NextResponse.json(
            { error: error.message || 'Failed to create booking' },
            { status: statusCode }
        );
    }
}
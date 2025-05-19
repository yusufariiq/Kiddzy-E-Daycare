import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/config/db';
import { BookingService } from '@/app/lib/services/booking.service';
import { verifyAuth } from '@/app/lib/middleware/auth.middleware';

const bookingService = new BookingService();

connectDB();

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.bookingId || !data.paymentId || !data.paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, paymentId, and paymentMethod' },
        { status: 400 }
      );
    }
    
    const currentBooking = await bookingService.getBookingDetails(data.bookingId);
    
    if (!currentBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    if (currentBooking.userId.toString() !== authResult.userId) {
      return NextResponse.json(
        { error: 'Access denied. You do not have permission to process payment for this booking.' },
        { status: 403 }
      );
    }
    
    if (currentBooking.paymentStatus === 'paid') {
      return NextResponse.json(
        { error: 'Payment has already been processed for this booking' },
        { status: 400 }
      );
    }
    
    const updatedBooking = await bookingService.processPayment(
      data.bookingId, 
      data.paymentId, 
      data.paymentMethod
    );
    
    if (!updatedBooking) {
      return NextResponse.json(
        { error: 'Failed to process payment' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Payment processed successfully',
      booking: updatedBooking
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process payment' },
      { status: 500 }
    );
  }
}
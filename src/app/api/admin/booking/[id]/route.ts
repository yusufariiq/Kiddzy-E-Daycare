import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/middleware/auth.middleware';
import { BookingService } from '@/lib/services/booking.service';
import connectDB from '@/config/db';

const bookingService = new BookingService();
connectDB();

type Context = {
    params: { id: string }
}

export async function PUT(req: NextRequest, context: Context) {
    try {
        const authResult = await verifyAdmin(req);
        
        if (!authResult.isAuthenticated) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status || 401 }
            );
        }
        
        const { status, reason } = await req.json();
        
        if (!['pending', 'confirmed', 'active', 'completed', 'cancelled'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }
        
        const booking = await bookingService.updateBookingStatus(context.params.id, status);
        
        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ booking }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating booking:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update booking' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, context: Context) {
    try {
        const authResult = await verifyAdmin(req);
        
        if (!authResult.isAuthenticated) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status || 401 }
            );
        }
        
        const { reason } = await req.json();
        
        const booking = await bookingService.adminCancelBooking(context.params.id, reason);
        
        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ booking }, { status: 200 });
    } catch (error: any) {
        console.error('Error cancelling booking:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to cancel booking' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest, context: Context) {
    try {
      const authResult = await verifyAdmin(req)
  
      if (!authResult.isAuthenticated) {
        return NextResponse.json(
          { error: authResult.error },
          { status: authResult.status || 401 }
        )
      }
  
      const booking = await bookingService.getBookingDetailsForAdmin(context.params.id)
  
      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      }
  
      return NextResponse.json({ booking }, { status: 200 })
    } catch (error: any) {
      console.error('Error fetching booking details:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch booking details' },
        { status: 500 }
      )
    }
}
  
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { BookingService } from '@/lib/services/booking.service';
import { verifyAdmin, verifyAuth } from '@/lib/middleware/auth.middleware';

const bookingService = new BookingService();

connectDB();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
      const authResult = await verifyAuth(req);
      
      if (!authResult.isAuthenticated) {
          return NextResponse.json(
              { error: authResult.error },
              { status: authResult.status || 401 }
          );
      }
      
      const userId = authResult.userId as string;
      const bookingId = params.id;

      if (!bookingId) {
          return NextResponse.json(
              { error: 'Booking ID is required' },
              { status: 400 }
          );
      }

      // Get specific booking details
      const booking = await bookingService.getBookingDetails(bookingId, userId);
      
      if (!booking) {
          return NextResponse.json(
              { error: 'Booking not found' },
              { status: 404 }
          );
      }
      
      return NextResponse.json({ booking }, { status: 200 });
      
  } catch (error: any) {
      console.error('Error fetching booking details:', error);
      
      let statusCode = 500;
      if (error.message?.includes('not found')) {
          statusCode = 404;
      } else if (error.message?.includes('Unauthorized')) {
          statusCode = 403;
      }

      return NextResponse.json(
          { error: error.message || 'Failed to fetch booking details' },
          { status: statusCode }
      );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
      const authResult = await verifyAdmin(req);

      if (!authResult.isAuthenticated) {
          return NextResponse.json(
              { error: authResult.error },
              { status: authResult.status || 401 }
          );
      }

      const userId = authResult.userId as string;
      const bookingId = params.id;
      const data = await req.json();

      if (!bookingId) {
          return NextResponse.json(
              { error: 'Booking ID is required' },
              { status: 400 }
          );
      }

      const { status, action } = data;
      let updatedBooking;

      // Handle different actions
      if (action === 'cancel') {
          updatedBooking = await bookingService.cancelBooking(
              bookingId, 
              userId, 
              data.cancellationReason
          );
      } else if (status) {
          const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
          if (!validStatuses.includes(status)) {
              return NextResponse.json(
                  { error: 'Invalid booking status' },
                  { status: 400 }
              );
          }

          updatedBooking = await bookingService.updateBookingStatus(
              bookingId, 
              status,
          );
      } else {
          return NextResponse.json(
              { error: 'Either status or action must be provided' },
              { status: 400 }
          );
      }

      if (!updatedBooking) {
          return NextResponse.json(
              { error: 'Booking not found' },
              { status: 404 }
          );
      }

      return NextResponse.json({ 
          booking: updatedBooking,
          message: `Booking ${action || 'status updated'} successfully`
      }, { status: 200 });

  } catch (error: any) {
      console.error('Error updating booking:', error);
      
      let statusCode = 500;
      if (error.message?.includes('not found')) {
          statusCode = 404;
      } else if (error.message?.includes('Unauthorized')) {
          statusCode = 403;
      } else if (error.message?.includes('Cannot change status') || error.message?.includes('Cannot cancel')) {
          statusCode = 400;
      }

      return NextResponse.json(
          { error: error.message || 'Failed to update booking' },
          { status: statusCode }
      );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
      const authResult = await verifyAuth(req);

      if (!authResult.isAuthenticated) {
          return NextResponse.json(
              { error: authResult.error },
              { status: authResult.status || 401 }
          );
      }

      const userId = authResult.userId as string;
      const bookingId = params.id;
      const url = new URL(req.url);
      const reason = url.searchParams.get('reason');

      if (!bookingId) {
          return NextResponse.json(
              { error: 'Booking ID is required' },
              { status: 400 }
          );
      }

      const cancelledBooking = await bookingService.cancelBooking(
          bookingId, 
          userId, 
          reason || undefined
      );

      if (!cancelledBooking) {
          return NextResponse.json(
              { error: 'Booking not found' },
              { status: 404 }
          );
      }

      return NextResponse.json({ 
          booking: cancelledBooking,
          message: 'Booking cancelled successfully'
      }, { status: 200 });

  } catch (error: any) {
      console.error('Error cancelling booking:', error);
      
      let statusCode = 500;
      if (error.message?.includes('not found')) {
          statusCode = 404;
      } else if (error.message?.includes('Unauthorized')) {
          statusCode = 403;
      } else if (error.message?.includes('Cannot cancel')) {
          statusCode = 400;
      }

      return NextResponse.json(
          { error: error.message || 'Failed to cancel booking' },
          { status: statusCode }
      );
  }
}
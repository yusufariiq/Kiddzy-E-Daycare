import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { BookingService } from '@/lib/services/booking.service';
import { verifyAdmin} from '@/lib/middleware/auth.middleware';

const bookingService = new BookingService();
connectDB();


export async function GET(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const authResult = await verifyAdmin(req);
    
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 }
      );
    }
    
    const { userId } = context.params;
    const url = new URL(req.url);
    const filter = url.searchParams.get('filter') as 'active' | 'completed' | 'cancelled' | 'history' | undefined;
  
    const bookings = await bookingService.getUserBookings(userId);
    
    return NextResponse.json({ 
      bookings,
      count: bookings.length,
      filter: filter || 'all',
      userId
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user bookings' },
      { status: 500 }
    );
  }
}
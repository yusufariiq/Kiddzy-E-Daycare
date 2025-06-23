import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { ChildService } from '@/lib/services/child.service';
import { verifyAuth } from '@/lib/middleware/auth.middleware';

const childService = new ChildService();

export async function GET(
    req: NextRequest, 
    context: { params: { id: string } }
){
    try {
      await connectDB();

      const { id } = await context.params;
      const authResult = await verifyAuth(req);
      
      if (!authResult.isAuthenticated) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
      }
      
      const child = await childService.getChildById(id); 
      
      if (!child) {
        return NextResponse.json({ error: 'Child not found' }, { status: 404 });
      }
      
      return NextResponse.json({ child }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch child' }, { status: 500 });
    }
}

// export async function PUT(
//     req: NextRequest, 
//     { params }: { params: { childId: string } }
//   ) {
//     try {
//       await connectDB();
//       const authResult = await verifyAuth(req);
      
//       if (!authResult.isAuthenticated) {
//         return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
//       }
      
//       const userId = authResult.userId;
//       const childId = params.childId;
//       const data = await req.json();
      
//       if (!mongoose.Types.ObjectId.isValid(childId)) {
//         return NextResponse.json({ error: 'Invalid child ID' }, { status: 400 });
//       }
      
//       const child = await Child.findOne({ _id: childId, userId });
      
//       if (!child) {
//         return NextResponse.json({ error: 'Child not found' }, { status: 404 });
//       }
      
//       const updatedChild = await Child.findByIdAndUpdate(
//         childId, 
//         {
//           fullname: data.fullname,
//           nickname: data.nickname,
//           age: data.age,
//           gender: data.gender,
//           specialNeeds: data.specialNeeds,
//           allergies: data.allergies
//         }, 
//         { new: true }
//       );
      
//       return NextResponse.json({ child: updatedChild }, { status: 200 });
//     } catch (error) {
//       return NextResponse.json({ error: 'Failed to update child' }, { status: 500 });
//     }
// }

// export async function DELETE(
//     req: NextRequest, 
//     { params }: { params: { childId: string } }
//   ) {
//     try {
//       await connectDB();
//       const authResult = await verifyAuth(req);
      
//       if (!authResult.isAuthenticated) {
//         return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
//       }
      
//       const userId = authResult.userId;
//       const childId = params.childId;
      
//       if (!mongoose.Types.ObjectId.isValid(childId)) {
//         return NextResponse.json({ error: 'Invalid child ID' }, { status: 400 });
//       }
      
//       // Check if child exists and belongs to user
//       const child = await Child.findOne({ _id: childId, userId });
      
//       if (!child) {
//         return NextResponse.json({ error: 'Child not found' }, { status: 404 });
//       }
      
//       // Check if child is referenced in any bookings before deletion
//       const Booking = mongoose.models.Booking;
//       const bookingsWithChild = await Booking.findOne({ childId });
      
//       if (bookingsWithChild) {
//         return NextResponse.json({ 
//           error: 'Cannot delete child with existing bookings' 
//         }, { status: 400 });
//       }
      
//       await Child.findByIdAndDelete(childId);
      
//       return NextResponse.json({ success: true }, { status: 200 });
//     } catch (error) {
//       return NextResponse.json({ error: 'Failed to delete child' }, { status: 500 });
//     }
// }
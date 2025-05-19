
import connectDB from '@/app/config/db';
import { verifyAdmin } from '@/app/lib/middleware/auth.middleware';
import { ChildService } from '@/app/lib/services/child.service';
import { NextRequest, NextResponse } from 'next/server';

const childService = new ChildService();

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authResult = await verifyAdmin(req);
        
    if (!authResult.isAuthenticated) {
        return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status || 401 }
        );
    }

    const searchParams = req.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const children = await childService.getAllChilds(limit, page);
    
    return NextResponse.json({ children }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 });
  }
}
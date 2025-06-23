import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { ChildService } from '@/lib/services/child.service';
import { verifyAuth } from '@/lib/middleware/auth.middleware';

const childService = new ChildService();

export async function GET(
    req: NextRequest, 
    context: any
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
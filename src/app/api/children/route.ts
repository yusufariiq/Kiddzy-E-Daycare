import { NextRequest, NextResponse } from 'next/server';
import { Child } from '@/app/lib/models/child.model';
import { verifyAuth } from '@/app/lib/middleware/auth.middleware';
import connectDB from '@/app/config/db';
import { ChildService } from '@/app/lib/services/child.service';
import { ChildRepository } from '@/app/lib/repositories/child.repostiory';

const childService = new ChildService();


export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authResult = await verifyAuth(req);
    
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
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

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const authResult = await verifyAuth(req);
    
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }
    
    const userId = authResult.userId;
    const body = await req.json();

    const childRepository = new ChildRepository();
    const newChild = new Child({
      userId,
      ...body
    });

    const children = await childRepository.create(newChild)    
    
    return NextResponse.json({ child: newChild }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create child' }, { status: 500 });
  }
}
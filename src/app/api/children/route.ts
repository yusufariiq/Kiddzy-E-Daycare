import { NextRequest, NextResponse } from 'next/server';
import { Child } from '@/app/lib/models/child.model';
import { verifyAuth } from '@/app/lib/middleware/auth.middleware';
import connectDB from '@/app/config/db';
import { ChildRepository } from '@/app/lib/repositories/child.repostiory';

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
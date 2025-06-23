import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { verifyAuth } from '@/lib/middleware/auth.middleware';
import { ChildRepository } from '@/lib/repositories/child.repostiory';
import { Child } from '@/lib/models/child.model';

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
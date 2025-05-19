import connectDB from '@/app/config/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: 'Connected to MongoDB ✅' });
  } catch (error) {
    return NextResponse.json({ error: 'Connection failed ❌', detail: String(error) }, { status: 500 });
  }
}

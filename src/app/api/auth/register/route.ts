import { AuthController } from '@/app/lib/controllers/auth.controller';
import { NextRequest, NextResponse } from 'next/server';

const authController = new AuthController();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user, token } = await authController.registerHandler(body);
    
    // Remove password from response
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    return NextResponse.json({ user: userResponse, token }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
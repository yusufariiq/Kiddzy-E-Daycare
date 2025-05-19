import { verifyAdmin } from '@/app/lib/middleware/auth.middleware';
import { UserService } from '@/app/lib/services/user.service';
import { NextRequest, NextResponse } from 'next/server';

const userService = new UserService();

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAdmin(req);
    
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status || 401 }
      );
    }
    
    const users = await userService.getUsersByRole("user");
    
    const sanitizedUsers = users.map(user => {
      const { password, ...userData } = user.toObject();
      return userData;
    });
    
    return NextResponse.json({ 
      success: true, 
      data: sanitizedUsers,
      count: sanitizedUsers.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching users' },
      { status: 500 }
    );
  }
}
import connectDB from "@/app/config/db";
import { verifyAuth } from "@/app/lib/middleware/auth.middleware";
import { UserService } from "@/app/lib/services/user.service";
import { NextRequest, NextResponse } from "next/server";

const userService = new UserService();

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        await connectDB();
        
        const authResult = await verifyAuth(req);

        if (!authResult.isAuthenticated) {
            return NextResponse.json(
              { success: false, message: authResult.error },
              { status: authResult.status || 401 }
            );
        }
        
        const { id } = await context.params;

        if (authResult.role !== 'admin' && authResult.userId !== id) {
            return NextResponse.json(
              { success: false, message: 'Unauthorized access to this profile' },
              { status: 403 }
            );
        }

        const user = await userService.getUserProfile(id);

        if (!user){
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            )
        }

        const { password, ...userData } = user.toObject();

        return NextResponse.json({ success: true, data: userData });
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching user profile' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const authResult = await verifyAuth(req);

        if (!authResult.isAuthenticated) {
            return NextResponse.json(
                { success: false, message: authResult.error },
                { status: authResult.status || 401 }
            );
        }

        const { id } = await context.params;

        if (authResult.role !== 'admin' && authResult.userId !== id) {
            return NextResponse.json(
              { success: false, message: 'Unauthorized access to this profile' },
              { status: 403 }
            );
        }

        const body = await req.json();
        const { firstName, lastName, phoneNumber, email } = body;

        if (!firstName || !lastName || !phoneNumber) {
            return NextResponse.json(
                { 
                  success: false, 
                  message: 'First name, last name, and phone number are required' 
                },
                { status: 400 }
            );
        }

        const updatedUser = await userService.updateUserProfile(id, {
            firstName,
            lastName,
            phoneNumber,
            email
        });

        if (!updatedUser) {
            return NextResponse.json(
              { success: false, message: 'User not found' },
              { status: 404 }
            );
        }

        const { password, ...userData } = updatedUser.toObject();
    
        return NextResponse.json({ success: true, data: userData });    
    } catch (error: any) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
            { success: false, message: 'Error updating user profile' },
            { status: 500 }
        );
    }
}
import { verifyAdmin } from '@/lib/middleware/auth.middleware';
import { UserService } from '@/lib/services/user.service';
import { NextRequest, NextResponse } from 'next/server';

const userService = new UserService();

export async function DELETE(req: NextRequest, context: any){ 
    try {
        const { userId } = context.params;

        const authResult = await verifyAdmin(req);
        
        if (!authResult.isAuthenticated){
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status || 401}
            );
        }

        const deleted = await userService.deleteUser(userId);

        if (!deleted) {
            return NextResponse.json({ error: 'User not found or already deleted' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User has been deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
    }
}
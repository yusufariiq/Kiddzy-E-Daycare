import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/middleware/auth.middleware';
import connectDB from '@/config/db';
import { ContactService } from '@/lib/services/contact.service';

const contactService = new ContactService();
connectDB();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const authResult = await verifyAdmin(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
        }

        const deleted = await contactService.deleteContact(params.id);

        if (!deleted) {
            return NextResponse.json({ error: 'Contact not found or already deleted' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Contact deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting contact:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete contact' }, { status: 500 });
    }
}

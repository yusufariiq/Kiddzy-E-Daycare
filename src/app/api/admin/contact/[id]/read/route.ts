import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/middleware/auth.middleware';
import connectDB from '@/config/db';
import { ContactService } from '@/lib/services/contact.service';

const contactService = new ContactService();
connectDB();

type Context = {
    params: { id: string }
}

export async function PATCH(req: NextRequest, context: Context) {
    try {
        const authResult = await verifyAdmin(req);
        if (!authResult.isAuthenticated) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
        }

        const updated = await contactService.updateContact(context.params.id, { isRead: true });

        if (!updated) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }

        return NextResponse.json({ contact: updated }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating contact:', error);
        return NextResponse.json({ error: error.message || 'Failed to update contact' }, { status: 500 });
    }
}
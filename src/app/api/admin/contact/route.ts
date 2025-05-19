import connectDB from "@/app/config/db";
import { verifyAdmin } from "@/app/lib/middleware/auth.middleware";
import { ContactService } from "@/app/lib/services/contact.service";
import { NextRequest, NextResponse } from "next/server";

const contactService = new ContactService();

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const authResult = await verifyAdmin(req);
              
        if (!authResult.isAuthenticated) {
              return NextResponse.json(
                { success: false, message: authResult.error },
                { status: authResult.status || 401 }
              );
        }

        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const page = parseInt(url.searchParams.get('page') || '1');
        
        const contactRepo = new contactService['contactRepository'].constructor();
        const contacts = await contactRepo.findAll(limit, page);
        
        return NextResponse.json({ 
            success: true,
            data: contacts,
            pagination: {
                page,
                limit,
            }
        });
      
    } catch (error) {
        console.error('Get contacts API error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch contacts' 
        }, { status: 500 });
    }
}
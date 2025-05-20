import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/db";
import { ContactService } from "@/lib/services/contact.service";

const contactService = new ContactService();

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const contact = await contactService.submitContactForm({
            name: body.name,
            email: body.email,
            subject: body.subject,
            message: body.message
        });

        return NextResponse.json({ 
            success: true,
            data: contact 
        }, { status: 201 });
    } catch (error) {
        console.error('Contact API error:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to submit contact form'
        }, { status: 500 });
    }
}
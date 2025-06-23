import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/db";
import { ProviderService } from "@/lib/services/provider.service";

const providerService = new ProviderService();

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        await connectDB();

        const { id } = await context.params;

        const provider = await providerService.getProviderById(id);

        if (!provider){
            return NextResponse.json(
                { success: false, error: 'Provider not found'},
                { status: 404 }
            );
        }

        if (!provider.isActive) {
            return NextResponse.json(
              { success: false, error: 'Provider not found' },
              { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: provider });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
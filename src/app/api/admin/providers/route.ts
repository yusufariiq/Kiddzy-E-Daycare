import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/app/lib/middleware/auth.middleware";
import { ProviderRepository } from "@/app/lib/repositories/provider.repostiroy";
import connectDB from "@/app/config/db";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const authResult = await verifyAdmin(req);
        if (!authResult.isAuthenticated){
            return NextResponse.json(
                { success: false, error: authResult.error },
                { status: authResult.status || 401 }
            )
        }

        const body = await req.json();
        const providerRepository = new ProviderRepository()
        const provider = await providerRepository.create(body);
        
        return NextResponse.json(
          { success: true, data: provider },
          { status: 201 }
        );
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
}
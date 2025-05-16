import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/db";
import { ProviderService } from "@/app/lib/services/provider.service";
import { verifyAdmin } from "@/app/lib/middleware/auth.middleware";
import { ProviderRepository } from "@/app/lib/repositories/provider.repostiroy";

const providerService = new ProviderService();

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const keyword = searchParams.get('keyword');
        const latitude = searchParams.get('latitude') ? parseFloat(searchParams.get('latitude')!) : null;
        const longitude = searchParams.get('longitude') ? parseFloat(searchParams.get('longitude')!) : null;
        const maxDistance = searchParams.get('maxDistance') ? parseFloat(searchParams.get('maxDistance')!) : 5000;
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
        const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    
        let providers;

        if (keyword) {
            providers = await providerService.searchProviders(keyword, limit, page);
        } else if (latitude && longitude) {
            providers = await providerService.findProvidersByLocation(longitude, latitude, maxDistance);
        } else {
            providers = await providerService.getAllProviders(limit, page);
        }

        return NextResponse.json({ success: true, data: providers });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

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



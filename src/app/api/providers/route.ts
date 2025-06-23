import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/db";
import { ProviderService } from "@/lib/services/provider.service";

const providerService = new ProviderService();

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const keyword = searchParams.get('keyword');
        const location = searchParams.get('location');
        const ageGroup = searchParams.get('ageGroup');
        const maxPrice = searchParams.get('maxPrice');
        const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1')); 
    
        let result;

        const filters: any = {};
        if (keyword?.trim()) filters.keyword = keyword.trim();
        if (location?.trim()) filters.location = location.trim();
        if (ageGroup?.trim()) filters.ageGroup = ageGroup.trim();
        if (maxPrice && !isNaN(parseInt(maxPrice))) filters.maxPrice = parseInt(maxPrice);

        if (Object.keys(filters).length > 0) {
            result = await providerService.searchProvidersWithFilters(filters, limit, page);
        } else {
            result = await providerService.getActiveProvidersWithPagination(limit, page);
        }

        const { providers, totalCount } = result;
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return NextResponse.json({ 
            success: true, 
            data: providers,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                hasNextPage,
                hasPrevPage,
                limit,
                resultsCount: providers.length
            },
            // Backward compatibility
            totalPages,
            hasNextPage
        });
    } catch (error: any) {
        console.error('Provider API Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
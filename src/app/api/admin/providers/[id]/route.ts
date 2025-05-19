import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/app/lib/middleware/auth.middleware";
import { ProviderRepository } from "@/app/lib/repositories/provider.repostiroy";
import connectDB from "@/app/config/db";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
      await connectDB();

      const { id } = await context.params;

      const authResult = await verifyAdmin(req);
      if (!authResult.isAuthenticated) {
          return NextResponse.json(
              { success: false, error: authResult.error },
              { status: authResult.status || 401 }
          );
      }

      const body = await req.json();
      const providerRepository = new ProviderRepository();
      const provider = await providerRepository.update(id, body);
      
      if (!provider) {
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

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    
    const authResult = await verifyAdmin(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status || 401 }
      );
    }
    
    const providerRepository = new ProviderRepository()
    const updated = await providerRepository.softDelete(id);
    
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Provider not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Provider deactivated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
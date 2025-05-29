"use client"

import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-12 text-center">
        {/* 404 illustration */}
        <div className="space-y-5">
            <h1 className="text-6xl font-bold text-[#273F4F]">Page Not Found</h1>
            <p className="text-gray-600 text-lg">
                Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the
                wrong URL.
            </p>
        </div>

        {/* Action buttons */}
       <div>
        <Link href="/">
                <Button className="mx-auto bg-[#FE7743] hover:bg-[#e56a3a] text-white py-6 rounded-full text-lg font-semibold flex items-center justify-center gap-2">
                    <Home className="h-5 w-5" />
                    Back to Homepage
                </Button>
            </Link>
       </div>

        {/* Search suggestion */}
        <div className="bg-[#FFF8F5] rounded-xl p-6 border border-[#FE7743]/20">
          <h3 className="font-semibold text-[#273F4F] mb-2">Looking for something specific?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Try searching for childcare providers in your area or browse our categories.
          </p>
          <Link href="/childcare">
            <Button variant="outline" className="border-[#FE7743] text-[#FE7743] hover:bg-[#FE7743] hover:text-white">
              Start Your Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
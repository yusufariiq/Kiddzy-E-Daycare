'use client'

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ChildcareCard from "@/components/common/childcare-card"
import SearchBar from "@/components/common/searchbar"
import { Button } from "@/components/ui/button"
import { RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { ProviderData } from "@/lib/types/providers"



function ChildcareContent() {
  const searchParams = useSearchParams()
  const [providers, setProviders] = useState<ProviderData[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<any>({})

  const fetchProviders = async (params?: any, page: number = 1) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...params
      })
      
      const res = await fetch(`/api/providers?${queryParams.toString()}`)
      const json = await res.json()
      
      setProviders(json.data || [])
      setTotalPages(json.totalPages || 1)
      setHasNextPage(json.hasNextPage || false)
      setCurrentPage(page)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (params: any) => {
    const searchParams = {
      ...(params.keyword && { keyword: params.keyword }),
      ...(params.location && { location: params.location }),
      ...(params.ageGroup && { ageGroup: params.ageGroup }),
      ...(params.maxPrice && { maxPrice: params.maxPrice.toString() })
    }
    
    setCurrentFilters(searchParams)
    setCurrentPage(1)
    fetchProviders(searchParams, 1)
  }

  const handleReset = () => {
    setCurrentFilters({})
    setCurrentPage(1)
    fetchProviders({}, 1)
  }

  const handlePageChange = (page: number) => {
    fetchProviders(currentFilters, page)
  }

  useEffect(() => {
    const urlParams = {
      keyword: searchParams.get('keyword') || '',
      location: searchParams.get('location') || '',
      ageGroup: searchParams.get('ageGroup') || '',
      maxPrice: searchParams.get('maxPrice') || ''
    }

    // Check if any URL parameters exist
    const hasUrlParams = Object.values(urlParams).some(value => value !== '')
    
    if (hasUrlParams) {
      const searchFilters = {
        ...(urlParams.keyword && { keyword: urlParams.keyword }),
        ...(urlParams.location && { location: urlParams.location }),
        ...(urlParams.ageGroup && { ageGroup: urlParams.ageGroup }),
        ...(urlParams.maxPrice && { maxPrice: urlParams.maxPrice })
      }
      
      setCurrentFilters(searchFilters)
      fetchProviders(searchFilters, 1)
    } else {
      fetchProviders({}, 1)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen pb-10">
      <main>
        <div className="text-white mt-10 mb-5 max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8 py-16 bg-[#FE7743] rounded-2xl">
          <h1 className="font-hashi uppercase tracking-wider text-3xl text-balance md:text-5xl">
            Discover Trusted Childcare In Your Area!
          </h1>
        </div>

        <div className="py-8">
          <SearchBar onSearch={handleSearch} onReset={handleReset} />
        </div>
        
        <div className="mx-auto max-w-7xl flex justify-end">
          <Button variant="default" onClick={handleReset} className="rounded-full p-3">
            <RefreshCcw className="size-6"/>
          </Button>
        </div>

        {providers.length === 0 && !loading && (
          <div className="py-8 text-center text-gray-500 mt-8">
            No childcare providers match your search. Try adjusting filters or resetting.
          </div>
        )}

        <div className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center text-center">
                <LoadingSpinner size="lg" className="text-[#FE7743]"/>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {providers.map((provider) => (
                    <ChildcareCard
                      key={provider._id}
                      provider={provider}
                      className=""
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            onClick={() => handlePageChange(pageNum)}
                            className="w-10 h-10 p-0"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
  
}

function ChildcarePageFallback(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" className="text-[#FE7743]" />
    </div>
  )
}

export default function ChildcarePage(){
  <Suspense fallback={<ChildcarePageFallback />}>
    <ChildcareContent />
  </Suspense>
}
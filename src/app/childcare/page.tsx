'use client'

import { useEffect, useState } from "react"
import ChildcareCard from "@/components/common/childcare-card"
import SearchBar from "@/components/common/searchbar"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { ProviderData } from "@/lib/types/providers"

export default function ChildcarePage() {
  const [providers, setProviders] = useState<ProviderData[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProviders = async (params?: any) => {
    setLoading(true)
    try {
      const query = params ? new URLSearchParams(params).toString() : ""
      const res = await fetch(`/api/providers?${query}`)
      const json = await res.json()
      setProviders(json.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (params: any) => {
    fetchProviders({ keyword: params.location })
  }

  const handleReset = () => fetchProviders()

  useEffect(() => {
    fetchProviders()
  }, [])

  return (
    <div className="min-h-screen pb-10">
      <main>
        <div className="text-white mt-10 mb-5 max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8 py-16 bg-[#FE7743] rounded-2xl">
          <h1 className="text-3xl text-balance md:text-5xl">
            Discover Trusted Childcare <span className="font-bold">In Your Area!</span>
          </h1>
        </div>

        <div className="py-8">
          <SearchBar onSearch={handleSearch} />
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {providers.map((provider) => (
                  <ChildcareCard
                    key={provider._id}
                    provider={provider}
                    className=""
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
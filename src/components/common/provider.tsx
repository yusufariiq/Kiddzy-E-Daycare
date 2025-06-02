'use client'

import { useEffect, useState } from 'react'
import ChildcareCard from './childcare-card'
import LoadingSpinner from '../ui/loading-spinner'

interface OperatingHours {
  _id: string
  day: string
  open: string
  close: string
}

interface Provider {
  _id: string
  name: string
  address: string
  images: string[]
  price: number
  availability: boolean
  operatingHours: OperatingHours[]
}

export default function Provider() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/providers?limit=6')
      const json = await res.json()
      setProviders(json.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [])


  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#273F4F]">Popular Childcare Services</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#273F4F]">
            Discover the most sought-after childcare options in your area
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center text-center py-40">
            <LoadingSpinner size="lg" className="text-[#FE7743]"/>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => {
              const hours = provider.operatingHours[0]
              const hoursDisplay = hours ? `${hours.open} - ${hours.close}` : undefined

              return (
                <ChildcareCard
                  key={provider._id}
                  id={provider._id}
                  image={provider.images[0] || "/placeholder.svg"}
                  name={provider.name}
                  location={provider.address}
                  price={provider.price}
                  availability={hoursDisplay}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
import { childcareListings } from '@/data/chidlcare'
import React from 'react'
import ChildcareCard from './childcare-card'

export default function Provider() {
  return (
    <div className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-[#273F4F]">Popular Childcare Services</h2>
              <p className="mx-auto mt-4 max-w-2xl font- text-lg text-[#273F4F]">
              Discover the most sought-after childcare options in your area
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {childcareListings.map((listing) => (
                <ChildcareCard key={listing.id} {...listing} />
              ))}
            </div>
          </div>
        </div>
  )
}
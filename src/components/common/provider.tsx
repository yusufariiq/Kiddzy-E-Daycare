import React from 'react'

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
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
                  <div className="h-48 bg-gray-200">
                    <img
                      src={`/hero.webp`}
                      alt={`Childcare Service ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#273F4F]">Childcare Service {i + 1}</h3>
                    <p className="mt-2 text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam
                      ultricies.
                    </p>
                    <div className="mt-4">
                      <a href="#" className="text-[#FE7743] hover:text-[#e66a3a] hover:underline">
                        Learn more →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}
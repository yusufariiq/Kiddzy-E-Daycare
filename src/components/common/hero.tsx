import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="min-h-[90vh] flex justify-center items-center bg-[url('/hero.webp')] bg-cover text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid md:grid-cols-3">
          <div className="w-full col-span-2 space-y-6 md:text-balance text-center md:text-left">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Find the best childcare for your family
            </h1>
            <p className="text-base sm:text-lg text-gray-200 md:text-xl">
              Connect with trusted childcare providers in your area. Kiddzy makes it easy to find the perfect match for
              your family's needs.
            </p>
            <div className="flex flex-wrap justify-center items-center md:justify-start gap-4">
              <Button size="lg" className="bg-[#FE7743] hover:bg-[#e66a3a]">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

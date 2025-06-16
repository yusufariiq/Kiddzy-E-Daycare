"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Parent of two",
    image: "/user.svg",
    quote:
      "Kiddzy made finding a reliable daycare for my twins so much easier! The verified reviews gave me confidence in my choice, and the booking process was seamless.",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Single parent",
    image: "/user.svg",
    quote:
      "As a working single dad, I needed flexible childcare options. Kiddzy helped me find a nanny who could accommodate my changing schedule. It's been a game-changer!",
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Mother of three",
    image: "/user.svg",
    quote:
      "I've tried several childcare platforms, but Kiddzy stands out for its quality providers and user-friendly interface. I found an amazing after-school program for all my kids.",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="bg-white text-[#273F4F] pt-16 pb-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:gap-8 grid-cols-1 md:grid-cols-2">
          {/* Left side with heading */}
          <div className="relative flex flex-col justify-center">   
            <div className="bg-[#273F4F] text-white w-full h-full rounded-xl flex justify-center items-center text-center  px-4 py-24">
                <h2 className="font-hashi uppercase tracking-wider text-xl font-bold lg:text-3xl">What Parents Say About Kiddzy?</h2>
            </div>
          </div>

          {/* Right side with testimonial */}
          <div className="relative">
            <div className="absolute -right-0 md:-right-4 top-0 text-[#FE7743]">
              <Quote className="size-12 md:size-16 rotate-180" />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={currentTestimonial.image || "/user.svg"}
                  alt={currentTestimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">{currentTestimonial.name}</h3>
                <p className="text-[#FE7743]">{currentTestimonial.role}</p>
              </div>
            </div>
            <blockquote className="mt-4 text-lg">"{currentTestimonial.quote}"</blockquote>

            {/* Navigation controls */}
            <div className="mt-8 flex items-center justify-between">
              <div className="text-lg font-medium">
                {String(currentIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={goToPrevious}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#FE7743] transition-colors hover:bg-gray-400/20"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#FE7743] transition-colors hover:bg-gray-400/20"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { Check, Clock, Shield, Star } from "lucide-react"

const features = [
  {
    icon: <Shield className="h-10 w-10 text-[#FE7743]" />,
    title: "Verified Providers",
    description: "All childcare providers undergo thorough background checks and verification processes.",
  },
  {
    icon: <Clock className="h-10 w-10 text-[#FE7743]" />,
    title: "Flexible Scheduling",
    description: "Find childcare that fits your schedule, whether you need full-time, part-time, or occasional care.",
  },
  {
    icon: <Check className="h-10 w-10 text-[#FE7743]" />,
    title: "Easy Booking",
    description: "Book and manage childcare services directly through our platform with just a few clicks.",
  },
]

export default function Features() {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#273F4F] md:text-5xl">Why Choose Kiddzy</h2>
          <p className="mx-auto mt-4 max-w-2xl font- text-lg text-[#273F4F]">
            We're committed to helping families find the best childcare solutions with confidence and ease.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="rounded-lg p-6 text-center bg-white">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#273F4F]">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
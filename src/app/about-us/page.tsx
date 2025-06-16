import Image from "next/image"

// Stats data
const stats = [
  {
    number: "5000+",
    label: "Childcare Providers",
  },
  {
    number: "25000+",
    label: "Registered Parents",
  },
  {
    number: "10000+",
    label: "Successful Bookings",
  },
  {
    number: "500+",
    label: "Cities Covered",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
        <main>
            {/* Hero Section */}
            <div className="text-white my-10 mx-auto max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-7xl px-4 text-center sm:px-6 lg:px-8 py-16 bg-[#FE7743] rounded-2xl">
                <h1 className="font-hashi uppercase tracking-wider text-4xl md:text-5xl">The Story Behind Kiddzy</h1>
            </div>

            {/* About Us Content */}
            <div className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Mission Statement */}
                    <div className="mb-16">
                        <h2 className="font-hashi text-3xl font-bold text-[#273F4F]">Our Mission</h2>
                        <p className="mt-4 text-lg text-gray-700">
                            Kiddzy is a technology company with a mission to increase access to quality childcare services for all
                            families. We believe that reliable childcare is essential for both child development and parental
                            well-being, and we're committed to making it easier to find, book, and manage childcare services.
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="mb-16 grid grid-cols-1 gap-8 border-y border-gray-200 py-12 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                            <div className="font-hashi text-4xl font-bold text-[#FE7743]">{stat.number}</div>
                            <div className="mt-2 text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* First Feature Section */}
                    <div className="mb-16 grid items-center gap-8 md:grid-cols-2">
                        <div className="order-2 md:order-1">
                            <h2 className="font-hashi text-2xl font-bold text-[#273F4F]">Comprehensive Childcare Information</h2>
                            <p className="mt-4 text-gray-700">
                            Kiddzy leverages technology to manage and display detailed childcare provider listings with
                            comprehensive facility descriptions, photos, and details about each service. Our team of Kiddzy
                            Verifiers checks and creates profiles for each provider, ensuring accuracy and quality. Look for the
                            Kiddzy Verified badge to identify providers that have been vetted by our team!
                            </p>
                        </div>
                        <div className="order-1 flex justify-center md:order-2">
                            <div className="relative h-[300px] w-[300px] overflow-hidden rounded-full bg-[#FE7743]/10">
                            <Image
                                src="/image3.webp"
                                alt="Comprehensive Childcare Information"
                                fill
                                className="object-cover"
                            />
                            </div>
                        </div>
                    </div>

                    {/* Second Feature Section */}
                    <div className="grid items-center gap-8 md:grid-cols-2">
                        <div className="flex justify-center">
                            <div className="relative h-[300px] w-[300px] overflow-hidden rounded-full bg-[#FE7743]/10">
                            <Image
                                src="/image4.webp"
                                alt="Connecting Parents and Providers"
                                fill
                                className="object-cover"
                            />
                            </div>
                        </div>
                        <div>
                            <h2 className="font-hashi text-2xl font-bold text-[#273F4F]">Connecting Parents and Providers</h2>
                            <p className="mt-4 text-gray-700">
                            Kiddzy has connected over 25,000 parents with more than 5,000 childcare providers, facilitating
                            10,000+ bookings each month to provide better childcare solutions. Our innovations aim to provide
                            security and convenience for both parents and childcare providers.
                            </p>
                        </div>
                    </div>

                    {/* Our Story Section */}
                    <div className="mt-16">
                        <h2 className="font-hashi text-3xl font-bold text-[#273F4F]">Our Story</h2>
                        <div className="mt-8 space-y-6 text-gray-700">
                            <p>
                            Starting as a platform to help parents find reliable childcare in their neighborhood, Kiddzy has grown
                            into a comprehensive ecosystem that enhances the childcare experience for both parents and providers
                            through our search services, booking platform, and provider verification system.
                            </p>
                            <p>
                            Since our founding in 2018, Kiddzy has been committed to growing and innovating to make childcare more
                            accessible while making the process more enjoyable and stress-free for families.
                            </p>
                            <p>
                            Our team consists of parents, childcare experts, and technology professionals who understand the
                            challenges of finding quality childcare. We're dedicated to creating solutions that address real needs
                            and make a positive impact on families' lives.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  )
}
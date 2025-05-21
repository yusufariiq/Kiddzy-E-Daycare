import Image from "next/image"
import { AccordionItem } from "@/components/ui/accordion"

// FAQ data
const faqItems = [
  {
    question: "How does Kiddzy work?",
    answer:
      "Kiddzy connects parents with trusted childcare providers in their area. Parents can search for providers based on location, child's age, service type, and availability. Once you find a provider that matches your needs, you can view their profile, read reviews, and book their services directly through our platform.",
  },
  {
    question: "Are all childcare providers on Kiddzy verified?",
    answer:
      "Yes, all childcare providers on Kiddzy undergo a thorough verification process. This includes background checks, reference verification, and credential validation. We take the safety and security of families using our platform very seriously.",
  },
  {
    question: "What types of childcare services can I find on Kiddzy?",
    answer:
      "Kiddzy offers a wide range of childcare services including daycare centers, nannies, babysitters, preschools, and after-school care programs. You can filter your search based on the specific type of care you're looking for.",
  },
  {
    question: "How do I book a childcare provider?",
    answer:
      "After finding a provider that meets your needs, you can request a booking through their profile. The provider will then confirm or decline your request. Once confirmed, you can communicate directly with the provider through our messaging system to discuss details.",
  },
  {
    question: "What if I need to cancel a booking?",
    answer:
      "Cancellation policies vary by provider. Each provider sets their own cancellation policy, which is clearly displayed on their profile. We recommend reviewing this policy before making a booking.",
  },
  {
    question: "How does payment work?",
    answer:
      "Payments are processed securely through our platform. You can pay using credit/debit cards or other supported payment methods. Funds are only released to the provider after the service has been completed, ensuring your satisfaction.",
  },
  {
    question: "Can I leave a review for a childcare provider?",
    answer:
      "Yes, after using a provider's services, you'll be prompted to leave a review. Your honest feedback helps other parents make informed decisions and helps providers improve their services.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Yes, Kiddzy is available as a mobile app for both iOS and Android devices. You can download it from the App Store or Google Play Store to manage your childcare needs on the go.",
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <div className="text-white mt-10 mb-5 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 py-16 bg-[#FE7743] rounded-2xl">
            <h1 className="text-4xl font-bold md:text-5xl">Frequently Asked Questions</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg">
            Find answers to common questions about Kiddzy and our childcare services.
            </p>
        </div>


        {/* FAQ Content */}
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row">
              {/* Left side - Image (25% width on desktop) */}
              <div className="mb-8 flex justify-center lg:mb-0 lg:w-1/4 lg:pr-8">
                <div className="relative h-[300px] w-[300px] overflow-hidden rounded-full bg-[#FE7743]/10 lg:h-[400px] lg:w-[400px]">
                  <Image
                    src="/placeholder.svg?height=400&width=400&text=Kiddzy+Support"
                    alt="Kiddzy Support"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right side - Accordion (75% width on desktop) */}
              <div className="lg:w-3/4">
                <div className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      trigger={<span className="text-lg font-semibold">{item.question}</span>}
                    >
                      {item.answer}
                    </AccordionItem>
                  ))}
                </div>

                {/* Additional Help Section */}
                {/* <div className="mt-12 rounded-lg bg-white p-6 shadow-md">
                  <h3 className="text-xl font-bold text-[#273F4F]">Still have questions?</h3>
                  <p className="mt-2 text-gray-600">
                    Our support team is here to help. Contact us and we'll get back to you as soon as possible.
                  </p>
                  <div className="mt-4">
                    <a
                      href="/contact"
                      className="inline-flex items-center rounded-md bg-[#FE7743] px-4 py-2 text-white hover:bg-[#e66a3a]"
                    >
                      Contact Support
                    </a>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

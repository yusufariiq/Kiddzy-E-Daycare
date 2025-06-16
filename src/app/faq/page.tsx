import Image from "next/image"
import { AccordionItem } from "@/components/ui/accordion"
import { faqItems } from "@/data/faq"

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <div className="text-white mt-10 mb-5 mx-auto max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-7xl px-4 text-center sm:px-6 lg:px-8 py-16 bg-[#FE7743] rounded-2xl">
            <h1 className="font-hashi uppercase tracking-wider text-3xl font-bold md:text-5xl">Frequently Asked Questions</h1>
            {/* <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg">
              Find answers to common questions about Kiddzy and our childcare services.
            </p> */}
        </div>

        {/* FAQ Content */}
        <div className="py-10 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full">
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

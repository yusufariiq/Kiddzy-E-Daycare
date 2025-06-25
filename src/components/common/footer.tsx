import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#273F4F] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="col-span-2 flex flex-col justify-center items-center md:items-start">
            <p className="font-hashi text-4xl font-bold">Kiddzy</p>
            <p className="mt-4 text-center md:text-left text-gray-300">
              Connecting families with trusted childcare providers. Find the perfect match for your family's needs.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="YouTube"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col justify-center items-center md:items-start ">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/childcare" className="text-gray-300 hover:text-white">
                  Find Childcare
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col justify-center items-center md:items-start">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-[#FE7743]" />
                <span className="text-gray-300">Jakarta</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-[#FE7743]" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-[#FE7743]" />
                <span className="text-gray-300">support@kiddzy.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <p className="text-sm text-gray-300">© 2025 Kiddzy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
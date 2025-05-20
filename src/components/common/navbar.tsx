"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "../ui/button"

const navLinks = [
    { name: "Find Childcare", href: "/find-childcare" },
    { name: "About us", href: "/for-providers" },
    { name: "How it Works", href: "/how-it-works" },
]

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled)
            }
        }
    
        window.addEventListener("scroll", handleScroll)
        return () => {
        window.removeEventListener("scroll", handleScroll)
        }
    }, [scrolled])

    return (
        <nav className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-300 ${
            scrolled ? "shadow-md" : ""
        }`}>
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#FE7743] flex items-center justify-center text-white">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            >
                                <path d="M9 18h6"></path>
                                <path d="M10 22h4"></path>
                                <path d="m2 2 20 20"></path>
                                <path d="M12 12c-2-2.2-2-4.5-2-6.5C10 3.5 11.5 2 13 2c1.5 0 3 1.5 3 3.5 0 1-.5 2-1 3"></path>
                            </svg>
                        </div>
                        <span className="ml-2 text-xl font-bold text-[#273F4F]">Kiddzy</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <div className="flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                            key={link.name}
                            href={link.href}
                            className="text-[#273F4F] hover:text-[#FE7743] px-3 py-2 text-base font-medium transition-colors"
                            >
                            {link.name}
                            </Link>
                        ))}
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/login">
                                <Button variant="ghost" size="default">
                                Log in
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button variant="default" size="default">
                                Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                        type="button"
                        className="inline-flex items-center justify-center p-2 rounded-md text-[#273F4F] hover:text-[#FE7743]"
                        aria-controls="mobile-menu"
                        aria-expanded="false"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            {isMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
                        {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[#273F4F] hover:text-[#FE7743] block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                        ))}
                            <div className="flex flex-col space-y-2 pt-2">
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="outline" size="default" className="w-full justify-center">
                                Log in
                                </Button>
                            </Link>
                            <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="default" size="default" className="w-full justify-center">
                                Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { Calendar, LogOut, Menu, User, UserCircle, X } from "lucide-react"
import { useAuth } from "@/context/auth.context"

const navLinks = [
  { name: "Find Childcare", href: "/childcare" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact" },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  // Handle scroll effect
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    router.push("/")
  }

  return (
    <nav
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 rounded-full bg-[#FE7743] flex items-center justify-center text-white">
                <User />
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
              {!isLoading && (
                user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                      className="flex items-center space-x-2 text-[#273F4F] hover:text-[#FE7743] px-3 py-2 text-base font-medium transition-colors rounded-md hover:bg-gray-100"
                    >
                      <div className="h-8 w-8 rounded-full bg-[#FE7743]/10 flex items-center justify-center text-[#FE7743]">
                        <UserCircle className="h-5 w-5" />
                      </div>
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-200 ring-opacity-5 py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href={`/profile/${user._id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                          onClick={() => {
                            setIsDropdownOpen(false);
                          }}
                        >
                          <UserCircle className="size-5 text-[#FE7743]" />
                          Profile Settings
                        </Link>
                        <Link
                          href="/bookings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Calendar className="size-5 text-[#FE7743]" />
                          My Bookings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 gap-2"
                        >
                          <LogOut className="size-5" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost" size="default">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button variant="default" size="default">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )
              )}
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
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="backdrop-blur-lg py-5 md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-5 sm:px-3 bg-white">
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
            {!isLoading && (
              user ? (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center px-3 py-2">
                    <div className="h-10 w-10 rounded-full bg-[#FE7743]/10 flex items-center justify-center text-[#FE7743]">
                      <UserCircle className="h-6 w-6" />
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-[#273F4F]">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                      href={`/profile/${user._id}`}
                      className="flex items-center px-3 py-2 text-base font-medium text-[#273F4F] hover:text-[#FE7743] hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircle className="mr-2 h-5 w-5" />
                      Profile Settings
                    </Link>
                    <Link
                      href="/bookings"
                      className="flex items-center px-3 py-2 text-base font-medium text-[#273F4F] hover:text-[#FE7743] hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50 rounded-md"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 pt-2">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="default" className="w-full justify-center">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="default" size="default" className="w-full justify-center">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
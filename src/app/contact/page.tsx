"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { ContactData } from "@/lib/types/contact"
import toast from "react-hot-toast"

const contactSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required"),
})

type ContactFormData = yup.InferType<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
      resolver: yupResolver(contactSchema),
  })

  const sendMessage = async (contactData: ContactData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed sending message')
      }
      
      toast.success("Message has been sent!")
    } catch (error: any) {
      toast.error(error.message || 'Sending message failed. Please try again.')
      throw error
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      await sendMessage({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      })

      setSubmitStatus("success")
    } catch (error) {
      setSubmitStatus("error")
    } finally{
      setIsSubmitting(false)
      reset({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    }

    setTimeout(() => {
      setSubmitStatus("idle")
    }, 5000)
  }

  return (
    <div className="min-h-screen">
        <main>
            {/* Hero Section */}
            <div className="text-white mt-10 mb-5 mx-auto max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-7xl px-4 text-center sm:px-6 lg:px-8 py-16 bg-[#FE7743] rounded-2xl">
                <h1 className="text-4xl md:text-5xl">Ask Anything About <span className="font-bold">Kiddzy</span></h1>
            </div>

            {/* Contact Content */}
            <div className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 md:grid-cols-2">
                        {/* Contact Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-[#273F4F]">Get in Touch</h2>
                            <p className="mt-4 text-gray-600">
                                Our team is here to help with any questions you may have about our childcare services. Fill out the
                                form and we'll get back to you as soon as possible.
                            </p>

                            <div className="mt-8 space-y-6">
                                <div className="flex items-start">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FE7743]/10">
                                        <MapPin className="h-5 w-5 text-[#FE7743]" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-[#273F4F]">Our Location</h3>
                                        <p className="mt-1 text-gray-600">123 Childcare Lane, Family City, FC 12345</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FE7743]/10">
                                        <Mail className="h-5 w-5 text-[#FE7743]" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-[#273F4F]">Email Us</h3>
                                        <p className="mt-1 text-gray-600">support@kiddzy.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FE7743]/10">
                                        <Phone className="h-5 w-5 text-[#FE7743]" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-[#273F4F]">Call Us</h3>
                                        <p className="mt-1 text-gray-600">(123) 456-7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <div className="rounded-xl bg-white p-8 border-2 border-gray-200">
                                <h2 className="text-2xl font-bold text-[#273F4F]">Send Us a Message</h2>
                                <p className="mt-2 text-gray-600">
                                Fill out the form below and we'll get back to you as soon as possible.
                                </p>

                                {submitStatus === "success" && (
                                <div className="mt-4 rounded-md bg-green-50 p-4 text-green-800">
                                    <p className="font-medium">Thank you for your message!</p>
                                    <p className="mt-1 text-sm">We'll get back to you as soon as possible.</p>
                                </div>
                                )}

                                {submitStatus === "error" && (
                                <div className="mt-4 rounded-md bg-red-50 p-4 text-red-800">
                                    <p className="font-medium">Something went wrong!</p>
                                    <p className="mt-1 text-sm">Please try again later or contact us directly.</p>
                                </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-[#273F4F]">
                                        Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                        type="text"
                                        id="name"
                                        {...register("name")}
                                        className={`mt-1 block w-full rounded-md border ${
                                            errors.name ? "border-red-500" : "border-gray-300"
                                        } px-4 py-3 shadow-sm focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]`}
                                        placeholder="John Doe"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-[#273F4F]">
                                        Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                        type="email"
                                        id="email"
                                        {...register("email")}
                                        className={`mt-1 block w-full rounded-md border ${
                                            errors.email ? "border-red-500" : "border-gray-300"
                                        } px-4 py-3 shadow-sm focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]`}
                                        placeholder="john.doe@example.com"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                                    </div>

                                    <div>
                                      <label htmlFor="subject" className="block text-sm font-medium text-[#273F4F]">
                                        Subject <span className="text-red-500">*</span>
                                      </label>
                                      <select
                                        id="subject"
                                        {...register("subject")}
                                        className={`mt-1 block w-full rounded-md border ${
                                          errors.subject ? "border-red-500" : "border-gray-300"
                                        } px-4 py-3 shadow-sm focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]`}
                                      >
                                        <option value="">Select a subject</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Payment Issue">Payment Issue</option>
                                        <option value="Booking Assistance">Booking Assistance</option>
                                        <option value="Feedback">Feedback</option>
                                        <option value="Technical Support">Technical Support</option>
                                        <option value="Other">Other</option>
                                      </select>
                                      {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-[#273F4F]">
                                        Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                        id="message"
                                        {...register("message")}
                                        rows={5}
                                        className={`mt-1 block w-full rounded-md border ${
                                            errors.message ? "border-red-500" : "border-gray-300"
                                        } px-4 py-3 shadow-sm focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]`}
                                        placeholder="Your message here..."
                                        />
                                        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                                    </div>

                                    <div>
                                        <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex w-full items-center justify-center rounded-md bg-[#FE7743] px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#e66a3a] focus:outline-none focus:ring-2 focus:ring-[#FE7743] focus:ring-offset-2 disabled:opacity-70"
                                        >
                                        {isSubmitting ? (
                                            <>
                                              <LoadingSpinner className="mr-2 text-white"/>
                                              Sending...
                                            </>
                                        ) : (
                                            <>
                                              <Send className="mr-2 h-5 w-5" />
                                              Send Message
                                            </>
                                        )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </main>
    </div>
  )
}
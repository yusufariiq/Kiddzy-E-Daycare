"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const registerSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9+\-\s()]{10,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  terms: yup.boolean().oneOf([true], "You must accept the terms and conditions"),
})

type RegisterFormData = yup.InferType<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setRegisterError(null)

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, let's simulate a successful registration
      // In a real app, you would call your registration API here
      console.log("Registration data:", data)

      // Show success message
      setRegistrationComplete(true)

      // Redirect to login page after a delay
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error) {
      setRegisterError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex flex-1 items-center justify-center bg-[#EFEEEA]">
        <div className="w-full max-w-2xl px-4">
            <div className="rounded-lg bg-white p-8 border-2 border-gray-200">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-[#273F4F]">Create Your Account</h1>
                    <p className="mt-2 text-gray-600">Join Kiddzy to find the perfect childcare solution</p>
                </div>

                {registerError && (
                <div className="mb-6 flex items-center rounded-md bg-red-50 p-4 text-red-800">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <p>{registerError}</p>
                </div>
                )}

                {registrationComplete ? (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="mb-4 rounded-full bg-green-100 p-3">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-[#273F4F]">Registration Successful!</h2>
                    <p className="mt-2 text-center text-gray-600">
                        Your account has been created successfully. You will be redirected to the login page shortly.
                    </p>
                    <Link href="/login" className="mt-6">
                        <Button>Go to Login</Button>
                    </Link>
                </div>
                ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-[#273F4F]">
                                First Name
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="firstName"
                                    type="text"
                                    {...register("firstName")}
                                    className={`block w-full rounded-md border ${
                                    errors.firstName ? "border-red-500" : "border-gray-300"
                                    } pl-10 pr-3 py-3 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]`}
                                    placeholder="John"
                                />
                            </div>
                            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-[#273F4F]">
                                Last Name
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                            <input
                                id="lastName"
                                type="text"
                                {...register("lastName")}
                                className={`block w-full rounded-md border ${
                                errors.lastName ? "border-red-500" : "border-gray-300"
                                } pl-10 pr-3 py-3 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]`}
                                placeholder="Doe"
                            />
                            </div>
                            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#273F4F]">
                            Email Address
                        </label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                            id="email"
                            type="email"
                            {...register("email")}
                            className={`block w-full rounded-md border ${
                                errors.email ? "border-red-500" : "border-gray-300"
                            } pl-10 pr-3 py-3 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]`}
                            placeholder="you@example.com"
                            />
                        </div>
                        errors.email && <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-[#273F4F]">
                            Phone Number
                        </label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                                <input
                                id="phone"
                                type="tel"
                                {...register("phone")}
                                className={`block w-full rounded-md border ${
                                    errors.phone ? "border-red-500" : "border-gray-300"
                                } pl-10 pr-3 py-3 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]`}
                                placeholder="(123) 456-7890"
                            />
                        </div>
                        errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone?.message}</p>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#273F4F]">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className={`block w-full rounded-md border ${
                                    errors.password ? "border-red-500" : "border-gray-300"
                                } pl-10 pr-10 py-3 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#273F4F]">
                            Confirm Password
                        </label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                className={`block w-full rounded-md border ${
                                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                } pl-10 pr-10 py-3 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id="terms"
                                type="checkbox"
                                {...register("terms")}
                                className={`h-4 w-4 rounded border-gray-300 text-[#FE7743] focus:ring-[#FE7743] ${
                                    errors.terms ? "border-red-500" : ""
                                }`}
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="text-gray-600">
                                I agree to the{" "}
                            <Link href="/terms" className="text-[#FE7743] hover:text-[#e66a3a] hover:underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-[#FE7743] hover:text-[#e66a3a] hover:underline">
                                Privacy Policy
                            </Link>
                            </label>
                            {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full py-3" disabled={isLoading}>
                        {isLoading ? (
                        <>
                            <svg
                            className="mr-2 h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                            </svg>
                            Creating Account...
                        </>
                        ) : (
                        "Create Account"
                        )}
                    </Button>
                    </div>
                </form>
                )}

                <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-[#FE7743] hover:text-[#e66a3a] hover:underline">
                    Sign in
                </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

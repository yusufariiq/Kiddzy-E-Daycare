"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as yup from "yup"
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuth } from "@/context/auth.context"
import LoadingSpinner from "@/components/ui/loading-spinner"

const loginSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
})

type LoginFormData = yup.InferType<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/")
    }
  }, [isAuthenticated, authLoading, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setLoginError(null)

    try {
      await login(data.email, data.password)
      router.push("/")
    } catch (error: any) {
      setLoginError(error.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading spinner while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-[90vh] flex flex-1 items-center justify-center bg-[#EFEEEA]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Don't render if already authenticated (will redirect)
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-[90vh] flex flex-1 items-center justify-center bg-[#EFEEEA]">
        <div className="w-full max-w-xl px-4 my-auto">
            <div className="rounded-lg bg-white p-8 border-2 border-gray-200">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-[#273F4F]">Welcome Back</h1>
                    <p className="mt-2 text-gray-600">Log in to your Kiddzy account</p>
                </div>

                {loginError && (
                    <div className="mb-6 flex items-center rounded-md bg-red-50 p-4 text-red-800">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        <p>{loginError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
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

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[#FE7743] focus:ring-[#FE7743]"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href="/forgot-password" className="text-[#FE7743] hover:text-[#e66a3a] hover:underline">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full py-3" disabled={isLoading}>
                            {isLoading ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Logging in...
                            </>
                            ) : (
                            "Log in"
                            )}
                        </Button>
                    </div>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="font-medium text-[#FE7743] hover:text-[#e66a3a] hover:underline">
                    Sign up
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}
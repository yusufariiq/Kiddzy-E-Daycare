"use client"

import { cn } from "@/utils/utils"
import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, icon, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <input
          className={cn(
            "w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-[#273F4F] placeholder-gray-400 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]",
            icon && "pl-10",
            error && "border-red-500",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
})

Input.displayName = "Input"

export { Input }
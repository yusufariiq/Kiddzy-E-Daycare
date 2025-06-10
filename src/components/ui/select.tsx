"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/utils/utils"

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  placeholder?: string
  icon?: React.ReactNode
  error?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, icon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
          <select
            className={cn(
              "w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-3 text-[#273F4F] focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743]",
              icon && "pl-10",
              error && "border-red-500",
              className,
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <ChevronDown className="h-5 w-5" />
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)

Select.displayName = "Select"

export { Select }
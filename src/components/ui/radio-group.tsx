"use client"

import { cn } from "@/utils/utils"
import * as React from "react"

interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface RadioGroupItemProps {
  value: string
  id?: string
  children?: React.ReactNode
  className?: string
}

const RadioGroupContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({})

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange }}>
        <div className={cn("grid gap-2", className)} {...props} ref={ref}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  },
)
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext)
    const isChecked = context.value === value

    return (
      <div className="flex items-center">
        <input
          type="radio"
          id={id || value}
          value={value}
          checked={isChecked}
          onChange={() => context.onValueChange?.(value)}
          className={cn(
            "h-4 w-4 rounded-full border-2 border-gray-300 text-[#FE7743]",
            isChecked && "border-[#FE7743] bg-[#FE7743]",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
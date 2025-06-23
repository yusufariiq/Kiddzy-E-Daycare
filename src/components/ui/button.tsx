import * as React from "react"
import { cn } from "@/utils/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-[#FE7743] text-white hover:bg-[#e66a3a]",
      outline: "border border-[#273F4F] text-[#273F4F] bg-transparent hover:bg-[#273F4F]/10",
      ghost: "text-[#273F4F] hover:bg-[#273F4F]/10",
      link: "text-[#273F4F] underline-offset-4 hover:underline",
    }

    const sizeClasses = {
      default: "h-10 px-6 py-2",
      sm: "h-8 px-4",
      lg: "px-8 py-3 text-lg",
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
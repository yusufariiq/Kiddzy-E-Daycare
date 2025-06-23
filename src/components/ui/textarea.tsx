import { cn } from "@/utils/utils"
import * as React from "react"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#273F4F] placeholder:text-gray-400 focus:border-[#FE7743] focus:outline-none focus:ring-1 focus:ring-[#FE7743] disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500",
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
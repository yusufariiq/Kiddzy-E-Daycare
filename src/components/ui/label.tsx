import { cn } from "@/utils/utils"
import * as React from "react"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium leading-none text-[#273F4F] mb-2 block", className)} {...props} />
))
Label.displayName = "Label"

export { Label }
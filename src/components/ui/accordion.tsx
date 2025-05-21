"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/utils/utils"

interface AccordionItemProps {
  value: string
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

const AccordionItem: React.FC<AccordionItemProps> = ({ value, trigger, children, className }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn("border-b border-gray-200", className)}>
      <div className="flex">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full flex-1 items-center justify-between py-4 text-left font-medium text-[#273F4F] transition-all hover:text-[#FE7743]",
          )}
          aria-expanded={isOpen}
        >
          {trigger}
          <ChevronDown
            className={cn("h-5 w-5 shrink-0 text-[#FE7743] transition-transform duration-200", isOpen && "rotate-180")}
          />
        </button>
      </div>
      <div className={cn("overflow-hidden text-gray-600 transition-all duration-300", isOpen ? "max-h-96" : "max-h-0")}>
        <div className="pb-4 pt-0">{children}</div>
      </div>
    </div>
  )
}

export { AccordionItem }

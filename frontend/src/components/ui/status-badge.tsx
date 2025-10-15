import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        approved:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80",
        pending:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
        rejected:
          "border-transparent bg-red-100 text-red-800 hover:bg-red-100/80",
      },
    },
    defaultVariants: {
      variant: "pending",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  label?: string
}

function StatusBadge({ 
  variant, 
  label, 
  className,
  ...props 
}: StatusBadgeProps) {
  const defaultLabel = variant 
    ? variant.charAt(0).toUpperCase() + variant.slice(1)
    : "Pending"

  return (
    <span
      className={cn(statusBadgeVariants({ variant, className }))}
      {...props}
    >
      {label || defaultLabel}
    </span>
  )
}

export { StatusBadge, statusBadgeVariants }
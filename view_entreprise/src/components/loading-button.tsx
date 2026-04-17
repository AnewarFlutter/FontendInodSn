"use client"

import { LucideLoader } from "lucide-react"
import { forwardRef } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

type LoadingButtonProps = React.ComponentProps<"button"> & {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
} & VariantProps<typeof buttonVariants> & {
  asChild?: boolean
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, isLoading = false, loadingText, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <LucideLoader className="h-4 w-4 animate-spin" />
            {loadingText}
          </span>
        ) : (
          children
        )}
      </Button>
    )
  }
)

LoadingButton.displayName = "LoadingButton"

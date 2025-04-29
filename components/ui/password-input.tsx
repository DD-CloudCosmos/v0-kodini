"use client"

import * as React from "react"
import { Input, InputProps } from "./input"
import { cn } from "@/lib/utils"

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  containerClassName?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <Input
          type="password"
          className={cn("pr-10", className)} // Add padding for the icon
          ref={ref}
          data-password="true"
          pb-role="password"
          {...props}
        />
        {typeof window !== 'undefined' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {/* True Key will inject its icon here */}
          </div>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput" 
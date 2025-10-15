import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    helperText,
    id,
    required,
    disabled,
    ...props
  }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId

    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={textareaId}
            className={cn(
              error && "text-destructive"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          required={required}
          disabled={disabled}
          {...props}
        />
        
        {(error || helperText) && (
          <p className={cn(
            "text-sm font-medium",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
TextArea.displayName = "TextArea"

export { TextArea }
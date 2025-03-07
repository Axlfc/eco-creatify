
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  readOnlyMessage?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, readOnlyMessage, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const characterCount = props.value ? String(props.value).length : 0;
    const maxLength = props.maxLength || null;

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-describedby={readOnlyMessage ? "readonly-message" : undefined}
          {...props}
        />
        
        {readOnlyMessage && props.readOnly && (
          <div 
            id="readonly-message"
            className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md text-sm text-muted-foreground"
          >
            {readOnlyMessage}
          </div>
        )}

        {maxLength && isFocused && (
          <div className="absolute bottom-1 right-3 text-xs text-muted-foreground">
            {characterCount}/{maxLength}
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

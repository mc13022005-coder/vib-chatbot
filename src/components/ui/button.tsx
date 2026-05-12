import * as React from "react"

import { cn } from "@/lib/utils"

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon" | "xs"
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const variantClasses: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-muted hover:text-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-muted hover:text-foreground",
    destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizeClasses: Record<string, string> = {
    default: "h-8 gap-1.5 px-3",
    xs: "h-6 gap-1 px-2 text-xs",
    sm: "h-7 gap-1 px-2.5 text-sm",
    lg: "h-9 gap-1.5 px-4",
    icon: "size-8",
  }

  return (
    <button
      data-slot="button"
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export { Button }

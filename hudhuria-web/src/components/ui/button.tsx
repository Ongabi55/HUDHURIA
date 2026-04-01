'use client'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burg-bright/50 disabled:pointer-events-none disabled:opacity-40 text-sm select-none',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-burg to-burg-bright text-white shadow-glow-sm hover:brightness-110 hover:shadow-glow-burg active:brightness-90 active:scale-[0.98]',
        ghost:
          'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)] active:bg-[var(--border-strong)]',
        outline:
          'border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--border)] active:bg-[var(--border-strong)]',
        glass:
          'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text)] hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] backdrop-blur-sm active:scale-[0.98]',
        destructive:
          'bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 active:bg-red-500/30',
      },
      size: {
        sm:      'h-8 px-3 text-xs',
        default: 'h-10 px-5',
        lg:      'h-12 px-8 text-base',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

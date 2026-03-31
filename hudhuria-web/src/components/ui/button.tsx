'use client'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burg-bright/50 disabled:pointer-events-none disabled:opacity-40 text-sm',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-burg to-burg-bright text-white shadow-lg hover:brightness-110 active:brightness-95',
        ghost: 'text-[#8899BB] hover:text-[#F0F4FF] hover:bg-white/5',
        outline: 'border border-white/10 text-[#F0F4FF] hover:bg-white/5',
        glass:
          'bg-white/5 border border-white/10 text-[#F0F4FF] hover:bg-white/10 backdrop-blur-sm',
        destructive:
          'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-5',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
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

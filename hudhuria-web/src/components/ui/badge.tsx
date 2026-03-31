import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-burg/10 border-burg/30 text-burg-bright',
        secondary:
          'bg-white/5 border-white/10 text-[#8899BB]',
        success:
          'bg-green-500/10 border-green-500/20 text-green-400',
        warning:
          'bg-amber-500/10 border-amber-500/20 text-amber-400',
        destructive:
          'bg-red-500/10 border-red-500/20 text-red-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

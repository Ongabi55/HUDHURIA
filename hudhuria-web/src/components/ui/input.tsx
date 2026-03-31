import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2',
          'text-sm text-[#F0F4FF] placeholder:text-[#8899BB]',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-burg-bright/50 focus:border-burg-bright/40 focus:bg-white/8',
          'disabled:cursor-not-allowed disabled:opacity-40',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#F0F4FF]',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }

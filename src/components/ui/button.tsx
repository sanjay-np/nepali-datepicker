import { type ButtonHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/lib/utils'

/**
 * Button Component Props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style variant of the button.
   * @default 'default'
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /**
   * The size of the button.
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * A versatile Button component styled with Tailwind CSS v4.
 * Supports various variants and sizes suitable for a date picker UI.
 *
 * @example
 * <Button variant="outline" onClick={() => console.log('Clicked')}>
 *   Click Me
 * </Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-ndp text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-ndp focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'

    const variants = {
      default: 'bg-primary-ndp text-primary-foreground-ndp hover:bg-primary-ndp/90 shadow-sm',
      destructive:
        'bg-destructive-ndp text-destructive-foreground-ndp hover:bg-destructive-ndp/90 shadow-sm',
      outline:
        'border border-input-ndp bg-background-ndp hover:bg-accent-ndp hover:text-accent-foreground-ndp shadow-sm',
      secondary:
        'bg-secondary-ndp text-secondary-foreground-ndp hover:bg-secondary-ndp/80 shadow-sm',
      ghost: 'hover:bg-accent-ndp hover:text-accent-foreground-ndp',
      link: 'text-primary-ndp underline-offset-4 hover:underline',
    }

    const sizes = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-10 px-8',
      icon: 'h-9 w-9',
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], 'cursor-pointer', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }

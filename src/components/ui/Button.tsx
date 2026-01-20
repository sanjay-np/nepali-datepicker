import { forwardRef, type ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
        const baseStyles = 'ndp-btn'
        const variantStyle = `ndp-btn-${variant}`
        const sizeStyle = `ndp-btn-size-${size}`

        const classes = `${baseStyles} ${variantStyle} ${sizeStyle} ${className}`.trim()

        return (
            <button
                className={classes}
                ref={ref}
                {...props}
            />
        )
    }
)

Button.displayName = 'Button'

export { Button }

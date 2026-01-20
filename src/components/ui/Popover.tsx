import { useState, useRef, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PopoverProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: ReactNode
}

interface PopoverTriggerProps {
    children: ReactNode
    asChild?: boolean
}

interface PopoverContentProps {
    children: ReactNode
    className?: string
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
}

const PopoverContext = {
    open: false,
    setOpen: (_open: boolean) => { },
    triggerRef: { current: null as HTMLElement | null },
}

export function Popover({ open: controlledOpen, onOpenChange, children }: PopoverProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const triggerRef = useRef<HTMLElement>(null)

    const open = controlledOpen ?? internalOpen
    const setOpen = (value: boolean) => {
        if (onOpenChange) {
            onOpenChange(value)
        } else {
            setInternalOpen(value)
        }
    }

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                setOpen(false)
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [open])

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node
            const popoverContent = document.querySelector('[data-popover-content]')
            if (
                open &&
                triggerRef.current &&
                !triggerRef.current.contains(target) &&
                popoverContent &&
                !popoverContent.contains(target)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open])

    return (
        <PopoverContextProvider value={{ open, setOpen, triggerRef }}>
            {children}
        </PopoverContextProvider>
    )
}

// Simple context implementation
let popoverContext = { ...PopoverContext }

function PopoverContextProvider({
    value,
    children
}: {
    value: typeof PopoverContext
    children: ReactNode
}) {
    popoverContext = value
    return <>{children}</>
}

function usePopoverContext() {
    return popoverContext
}

export function PopoverTrigger({ children, asChild }: PopoverTriggerProps) {
    const { open, setOpen, triggerRef } = usePopoverContext()

    const handleClick = () => {
        setOpen(!open)
    }

    if (asChild && children) {
        // Clone the child and add our props
        const child = children as React.ReactElement
        return (
            <span
                ref={triggerRef as React.RefObject<HTMLSpanElement>}
                onClick={handleClick}
                style={{ display: 'inline-block' }}
            >
                {child}
            </span>
        )
    }

    return (
        <button
            ref={triggerRef as React.RefObject<HTMLButtonElement>}
            onClick={handleClick}
            type="button"
        >
            {children}
        </button>
    )
}

export function PopoverContent({
    children,
    className = '',
    align = 'start',
    sideOffset = 4
}: PopoverContentProps) {
    const { open, triggerRef } = usePopoverContext()
    const contentRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

    // Calculate position when opening
    useEffect(() => {
        if (open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            let left = rect.left

            if (align === 'center') {
                left = rect.left + rect.width / 2
            } else if (align === 'end') {
                left = rect.right
            }

            setPosition({
                top: rect.bottom + window.scrollY + sideOffset,
                left: left + window.scrollX,
            })
        } else if (!open) {
            setPosition(null)
        }
    }, [open, align, sideOffset])

    // Don't render if not open or position not yet calculated
    if (!open || position === null) return null

    const alignmentTransform =
        align === 'center' ? 'translateX(-50%)' :
            align === 'end' ? 'translateX(-100%)' :
                'translateX(0)'

    return createPortal(
        <div
            ref={contentRef}
            data-popover-content
            className={`ndp-popover-content ${className}`.trim()}
            style={{
                top: position.top,
                left: position.left,
                transform: alignmentTransform,
            }}
            data-state={open ? 'open' : 'closed'}
        >
            {children}
        </div>,
        document.body
    )
}

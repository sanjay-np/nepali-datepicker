import React, {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

/**
 * Props for the Popover root component.
 */
interface PopoverProps {
  /** Whether the popover is currently open */
  open?: boolean
  /** Callback triggered when the open state changes */
  onOpenChange?: (open: boolean) => void
  /** Trigger and Content components */
  children: ReactNode
}

/**
 * Props for the PopoverTrigger component.
 */
interface PopoverTriggerProps {
  /** The element that triggers the popover */
  children: ReactNode
  /**
   * If true, the trigger will merge its functionality into its immediate child.
   * Note: This implementation uses a wrapper span for simplicity.
   */
  asChild?: boolean
}

/**
 * Props for the PopoverContent component.
 */
interface PopoverContentProps {
  /** Content to display inside the popover */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
  /**
   * Alignment relative to the trigger.
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Distance between the trigger and the content.
   * @default 4
   */
  sideOffset?: number
}

interface PopoverContextType {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined)

/**
 * Root component for the Popover. Manages the open/close state and provides context to sub-components.
 */
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

  // Close on escape key press
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
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  )
}

/**
 * Hook to access the Popover context. Must be used within a Popover component.
 */
function usePopoverContext() {
  const context = useContext(PopoverContext)
  if (!context) {
    throw new Error('Popover components must be used within a Popover')
  }
  return context
}

/**
 * Component that triggers the popover to open.
 */
export function PopoverTrigger({ children, asChild }: PopoverTriggerProps) {
  const { open, setOpen, triggerRef } = usePopoverContext()

  const handleClick = () => {
    setOpen(!open)
  }

  if (asChild && children) {
    const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>
    const childWithClick = React.isValidElement(child)
      ? React.cloneElement(child, {
        onClick: (e: React.MouseEvent) => {
          child.props.onClick?.(e)
          handleClick()
        },
      })
      : child

    return (
      <span ref={triggerRef as React.RefObject<HTMLSpanElement>} className="inline-block">
        {childWithClick}
      </span>
    )
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
      type="button"
      className="cursor-pointer"
    >
      {children}
    </button>
  )
}

/**
 * Component that contains the popover content. Renders into a portal at the body level.
 */
export function PopoverContent({
  children,
  className = '',
  align = 'start',
  sideOffset = 4,
}: PopoverContentProps) {
  const { open, triggerRef } = usePopoverContext()
  const contentRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  const updatePosition = () => {
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
    }
  }

  // Recalculate position on resize or scroll
  useEffect(() => {
    if (open) {
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    } else {
      setPosition(null)
    }
  }, [open, align, sideOffset])

  if (!open || position === null) return null

  const alignmentTransform =
    align === 'center'
      ? 'translateX(-50%)'
      : align === 'end'
        ? 'translateX(-100%)'
        : 'translateX(0)'

  return createPortal(
    <div
      ref={contentRef}
      data-popover-content
      className={cn(
        'animate-ndp-fade-in z-50 w-auto rounded-ndp border border-border-ndp bg-popover-ndp p-4 text-popover-foreground-ndp shadow-md outline-none',
        className
      )}
      style={{
        position: 'absolute',
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

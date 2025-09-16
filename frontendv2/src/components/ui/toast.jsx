import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Toast = ({ variant = 'default', title, description, onClose, ...props }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow animation to complete
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const variantClasses = {
    default: 'bg-white border-gray-200 text-gray-900',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300',
        variantClasses[variant],
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        props.className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && (
            <div className="text-sm font-semibold mb-1">{title}</div>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-4 rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

const ToastProvider = ({ children }) => {
  return <>{children}</>
}

const ToastViewport = ({ children }) => {
  return <>{children}</>
}

const ToastTitle = ({ children, className, ...props }) => (
  <div className={cn("text-sm font-semibold", className)} {...props}>
    {children}
  </div>
)

const ToastDescription = ({ children, className, ...props }) => (
  <div className={cn("text-sm opacity-90", className)} {...props}>
    {children}
  </div>
)

const ToastClose = ({ onClick, className, ...props }) => (
  <button
    onClick={onClick}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
)

const ToastAction = ({ children, onClick, className, ...props }) => (
  <button
    onClick={onClick}
    className={cn(
      "inline-flex h-8 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2",
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

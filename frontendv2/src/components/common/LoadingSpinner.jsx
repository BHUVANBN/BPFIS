import React from 'react'
import { cn } from '@/lib/utils'

const LoadingSpinner = ({ size = 'md', className, ...props }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-green-600',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-lg text-gray-600 font-medium">{message}</p>
    </div>
  )
}

export const LoadingButton = ({ loading, children, disabled, ...props }) => {
  return (
    <button
      disabled={loading || disabled}
      className={cn(
        'flex items-center justify-center gap-2',
        loading && 'opacity-75 cursor-not-allowed'
      )}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
}

export default LoadingSpinner

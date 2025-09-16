import { useState, useCallback } from 'react'

let toastId = 0

function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const id = ++toastId
    const newToast = {
      id,
      title,
      description,
      variant,
    }

    setToasts((prev) => [...prev, newToast])

    return {
      id,
      dismiss: () => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      },
    }
  }, [])

  const dismiss = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId))
  }, [])

  return {
    toasts,
    toast,
    dismiss,
  }
}

// Simple toast function for direct usage
const toast = ({ title, description, variant = 'default' }) => {
  // This is a simplified version for direct usage
  console.log(`Toast: ${title} - ${description}`)
}

export { useToast, toast }

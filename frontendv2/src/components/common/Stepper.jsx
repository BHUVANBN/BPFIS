import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const Stepper = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep
        const isUpcoming = stepNumber > currentStep

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  isCompleted && "bg-green-600 border-green-600 text-white",
                  isCurrent && "bg-green-100 border-green-600 text-green-600",
                  isUpcoming && "bg-gray-100 border-gray-300 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    (isCompleted || isCurrent) && "text-gray-900",
                    isUpcoming && "text-gray-400"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1 max-w-24">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors",
                  stepNumber < currentStep && "bg-green-600",
                  stepNumber >= currentStep && "bg-gray-300"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Stepper

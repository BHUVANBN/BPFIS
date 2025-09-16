/**
 * Button variants for the application
 * These define the different styles of buttons available
 */

export const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white rounded-md px-4 py-2 font-medium transition-colors',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-4 py-2 font-medium transition-colors',
  outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-md px-4 py-2 font-medium transition-colors',
  ghost: 'text-primary-600 hover:bg-primary-50 rounded-md px-4 py-2 font-medium transition-colors',
  danger: 'bg-error hover:bg-red-600 text-white rounded-md px-4 py-2 font-medium transition-colors',
  success: 'bg-success hover:bg-green-600 text-white rounded-md px-4 py-2 font-medium transition-colors',
};

export const buttonSizes = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-2.5',
  xl: 'text-xl px-6 py-3',
};

export const buttonStates = {
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'opacity-80 cursor-wait',
};
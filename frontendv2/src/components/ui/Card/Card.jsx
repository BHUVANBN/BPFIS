import React from 'react';

/**
 * Card component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hoverable - Whether card should have hover effects
 */
export const Card = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  const classes = [
    'bg-white rounded-lg shadow-md overflow-hidden',
    hoverable ? 'transition-shadow hover:shadow-lg' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Header component
 */
Card.Header = ({ children, className = '', ...props }) => {
  const classes = [
    'px-6 py-4 border-b border-gray-200',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Body component
 */
Card.Body = ({ children, className = '', ...props }) => {
  const classes = [
    'px-6 py-4',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Footer component
 */
Card.Footer = ({ children, className = '', ...props }) => {
  const classes = [
    'px-6 py-4 border-t border-gray-200',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
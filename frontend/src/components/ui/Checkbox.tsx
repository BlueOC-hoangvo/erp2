// Checkbox Component - Reusable checkbox component
import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, variant = 'default', size = 'md', onCheckedChange, onChange, ...props }, ref) => {
    const variants = {
      default: 'border border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2',
      outline: 'border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2',
    };

    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };

    return (
      <input
        type="checkbox"
        className={cn(
          'rounded transition-colors focus:outline-none focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };

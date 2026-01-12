import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

/**
 * Icon button size options.
 */
export type IconButtonSize = 'sm' | 'md' | 'lg';

/**
 * Icon button component props.
 */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: IconButtonSize;
  'aria-label': string;
  children: React.ReactNode;
}

/**
 * Reusable icon button component with orange brand theme.
 * Accessible with required aria-label and focus states.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-brand-700 hover:bg-brand-50 focus:ring-brand-500 active:bg-brand-100';

    const sizeStyles: Record<IconButtonSize, string> = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
    };

    const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${className}`.trim();

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';


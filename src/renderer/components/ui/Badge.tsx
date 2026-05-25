import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function Badge({ variant = 'default', children, className = '', ...props }: BadgeProps) {
  return (
    <span className={`badge badge--${variant} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}

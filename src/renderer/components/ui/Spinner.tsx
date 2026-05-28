import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const sizeMap = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
};

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: keyof typeof sizeMap;
  label?: string;
}

export function Spinner({ size = 'md', label = 'Loading…', className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', sizeMap[size], className)}
      {...props}
    >
      <span className="h-full w-full animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

import type { HTMLAttributes } from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 36,
};

export function Spinner({ size = 'md', label = 'Loading…', className = '', ...props }: SpinnerProps) {
  const px = sizeMap[size];
  return (
    <span
      role="status"
      aria-label={label}
      className={`spinner spinner--${size} ${className}`.trim()}
      style={{ width: px, height: px }}
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="10"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

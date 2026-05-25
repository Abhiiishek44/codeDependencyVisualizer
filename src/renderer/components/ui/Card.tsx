import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, glass = false, padding = 'md', className = '', ...props }: CardProps) {
  const classes = [
    'card',
    `card--pad-${padding}`,
    glass ? 'card--glass' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

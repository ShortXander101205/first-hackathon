import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: 'div' | 'section' | 'article' | 'main';
  className?: string;
}

export function Container({
  children,
  as: Component = 'div',
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </Component>
  );
}

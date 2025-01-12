import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeVariants = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={cn(
          'rounded-full border-2 border-primary border-t-transparent',
          sizeVariants[size]
        )}
      />
    </div>
  );
};

export const PageSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <Spinner size="lg" />
  </div>
);

export const ButtonSpinner = () => <Spinner size="sm" />;

export const TableSpinner = () => (
  <div className="flex h-32 items-center justify-center">
    <Spinner />
  </div>
); 
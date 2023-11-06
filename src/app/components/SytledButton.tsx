import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import Sparkles from 'react-sparkle';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sparkle?: boolean;
}

const SytledButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = 'button', sparkle, ...props }, ref) => {
    return (
      <button
        type={type}
        className={twMerge(
          `w-full rounded-full bg-red-500 border border-transparent px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-75 transition`,className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <div className='absolute w-[150px] h-[10px]'>
        {sparkle && <Sparkles count={5} minSize={12} fadeOutSpeed={10} flicker={false} />} {/* Sparkle component */}
        </div>
        {children}
      </button>
    );
  }
);

SytledButton.displayName = 'StyledButton';

export default SytledButton;

import React, { forwardRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Sparkles from 'react-sparkle';
import {ActivityIndicator} from 'react-native-paper'
import { BeatLoader } from 'react-spinners';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sparkle?: boolean;
  sparkleWidth?: number;
  onClick?:any;
}

const SytledButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = 'button', sparkle, sparkleWidth,onClick}, ref, ...props) => {
    const [isLoading, setIsLoading] = useState(false)
    const handlePress = async () => {
      if (onClick.constructor.name === 'AsyncFunction') {
        setIsLoading(true)
        try {
          await onClick()
        } catch (err) {
        //
        } finally {
          setIsLoading(false)
        }
      } else {
        onClick()
      }
    }
    return (
      <button
        type={type}
        className={twMerge(
          `w-full gap-1 flex flex-row rounded-full items-center justify-center bg-red-500 border border-transparent px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-75 transition`,className
        )}
        disabled={disabled ? true : isLoading}
        ref={ref}
        {...props}
        onClick={handlePress}
      >
        <div className={`absolute mb-0 ${sparkleWidth ? 'w-['+sparkleWidth+'px]':'w-[150px]'}  h-[10px]`}>
        {sparkle && <Sparkles count={5} minSize={12} fadeOutSpeed={10} flicker={false} />} {/* Sparkle component */}
        </div>
        {isLoading && <BeatLoader color="#FFFFFF" size={5} />}
        {children}
      </button>
    );
  }
);

SytledButton.displayName = 'StyledButton';

export default SytledButton;

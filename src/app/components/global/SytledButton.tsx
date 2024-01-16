import React, { forwardRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Sparkles from 'react-sparkle';
import { BeatLoader } from 'react-spinners';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sparkle?: boolean;
  sparkleWidth?: number;
  onClick?:any;
  showLoading?:boolean;
}

export const SytledButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = 'button', sparkle, sparkleWidth,onClick, showLoading=true, style}, ref, ...props) => {
    const [isLoading, setIsLoading] = useState(false)
    const handlePress = async () => {
      if (onClick?.constructor.name === 'AsyncFunction' && showLoading) {
        setIsLoading(true)
        try {
          await onClick()
        } catch (err) {
        //
        } finally {
          setIsLoading(false)
        }
      } else {
        onClick && onClick()
      }
    }
    return (
      <button
        type={type}
        className={twMerge(
          `w-full gap-1 flex flex-row rounded-full items-center justify-center bg-primary-purple border border-transparent px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-75 transition`,className
        )}
        disabled={disabled ? true : isLoading}
        ref={ref}
        style={style}
        {...props}
        onClick={handlePress}
      >
        <div className={`relative mb-0 ${sparkleWidth ? 'max-w-['+sparkleWidth+'px]':'max-w-[200px]'}  py-0`}>
        <p className='flex flex-row items-center justify-center gap-1'>{isLoading && <BeatLoader color="#FFFFFF" size={5} />}{children} {sparkle &&  <Sparkles count={5} minSize={12} fadeOutSpeed={10} flicker={false} />}</p>
        </div>
      </button>
    );
  }
);

SytledButton.displayName = 'StyledButton';

export default SytledButton;

<div className='relative h-12 mt-2 text-center max-w-[300px]'>
            <p>
              You are on the <b>premium dancers</b> plan
              <Sparkles count={5} minSize={5} fadeOutSpeed={10} flicker={false} />
            </p>
          </div>
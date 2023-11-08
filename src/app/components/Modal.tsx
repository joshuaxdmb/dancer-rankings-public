import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IoMdClose } from 'react-icons/io';

type Props = {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onChange, title, description, children }: Props) => {
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-neutral-900/90 backdrop-blur-sm fixed inset-0 z-30" />
        <Dialog.Content
          className={`z-40 fixed drop-shadow-md border border-neutral-700 top-[50%] left-[50%] h-auto md:max-h-[85vh] w-[90%] md:w-[90vh] md:max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto scrollbar-hide
          rounded-md bg-neutral-800 p-[25px] focus:outline-none`}
        >
          <Dialog.Title className="text-xl text-center font-bold mb-4">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-md leading-normal text-center">
            {description}
          </Dialog.Description>
          <div className="text-center">{children}</div>
          <Dialog.Close asChild>
            <button className="text-neutral-400 hover:text-white absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none">
              <IoMdClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;

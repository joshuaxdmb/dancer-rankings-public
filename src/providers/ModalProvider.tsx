'use client';
import AuthModal from '@/app/components/Auth/AuthModal';
import { useEffect, useState } from 'react';
import SubscribeModal from '../app/components/Auth/SubscribeModal';
import { ProductWithPrice } from '@/types/types';

interface ModalProviderProps {
  products: ProductWithPrice[]
}

const ModalProvider: React.FC<ModalProviderProps> = ({
  products
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return(
    <>
    <AuthModal/>
    <SubscribeModal products={products}/>
    </>
  );
};

export default ModalProvider

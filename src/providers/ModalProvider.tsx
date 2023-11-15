'use client';
import AuthModal from '@/app/components/Auth/AuthModal';
import { useEffect, useState } from 'react';
import SubscribeModal from '../app/components/Auth/SubscribeModal';
import { ProductWithPrice } from '@/types/types';
import QRCodeModal from '@/app/houseparty/QRCodeModal';

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
    <QRCodeModal/>
    <SubscribeModal products={products}/>
    </>
  );
};

export default ModalProvider

'use client';
import AuthModal from '@/app/components/Auth/AuthModal';
import { useEffect, useState } from 'react';
import SubscribeModal from '../app/components/Auth/SubscribeModal';
import { ProductWithPrice } from '@/types/types';
import QRCodeModal from '@/app/houseparty/QRCodeModal';
import PartyOptionsModal from '@/app/houseparty/PartyOptionsModal';

interface ModalProviderProps {
}

const ModalProvider: React.FC<ModalProviderProps> = ({
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
    <SubscribeModal/>
    <PartyOptionsModal/>
    </>
  );
};

export default ModalProvider

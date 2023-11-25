'use client';
import AuthModal from '@/app/components/auth/AuthModal';
import { useEffect, useState } from 'react';
import SubscribeModal from '../app/components/auth/SubscribeModal';
import { ProductWithPrice } from '@/types/types';
import QRCodeModal from '@/app/houseparty/components/QRCodeModal';
import PartyOptionsModal from '@/app/houseparty/components/PartyOptionsModal';

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

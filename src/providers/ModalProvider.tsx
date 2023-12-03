'use client';
import AuthModal from '@/app/components/authentication/AuthModal';
import { useEffect, useState } from 'react';
import SubscribeModal from '../app/components/authentication/SubscribeModal';
import { ProductWithPrice } from '@/types/types';
import QRCodeModal from '@/app/party-playlist/components/ShowPartyQRCodeModal';
import PartyOptionsModal from '@/app/party-playlist/components/PartyOptionsModal';

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

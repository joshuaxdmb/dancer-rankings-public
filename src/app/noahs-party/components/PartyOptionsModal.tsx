import React, {useEffect, useState} from 'react';
import Modal from '../../components/layout/Modal';
import { useRecoilState } from 'recoil';
import { partyPlaylistAtom, isPartyOwnerAtom } from '@/atoms/partyPlaylistAtom';
import SytledButton from '../../components/global/SytledButton';
import { useSupabase } from '@/hooks/useSupabase';
import usePartyOptionsModal from '@/hooks/usePartyOptionsModal';
import useQrCodeModal from '@/hooks/useQRCodeModal';
import { ProductWithPrice } from '@/types/types';
import toast from '@/lib/toast';
import { postData } from '@/lib/helpers';
import { useUser } from '@/hooks/useUser'
import { Capacitor } from '@capacitor/core';

type Props = {}

const PartyOptionsModal = ({}: Props) => {
  const [partyPlaylistId, setPartyPlaylistId] = useRecoilState(partyPlaylistAtom);
  const [isPartyOwner, setIsPartyOwner] = useRecoilState(isPartyOwnerAtom)
  const { isOpen, onClose } = usePartyOptionsModal();
  const {onOpen:onOpenQRCode} = useQrCodeModal()
  const supabase = useSupabase()
  const [product, setProduct] = useState<ProductWithPrice>()
  const {user} = useUser()
  const isNative = Capacitor.isNativePlatform();

  const getProducts = async () => {
    try{
      const proods = await supabase.getProductsWithPrices('Vote Booster 10x')
      setProduct(proods[0])
    } catch (error){
      console.log(error)
      toast.error('Could not connect to the database', {id: 'get-products-error'})
    } 
  }

  useEffect(()=>{
    getProducts()
  },[])

  const handleBuyVoteBooster = async () => {
    if (!user) {
      return toast.error('Please login to continue');
    }

    console.log('User',user)

    if(!product){
      return toast.error('Could not find product')
    }

    try {
      const { sessionId } = await postData({
        url: 'api/create-checkout-session',
        data: { price:product.prices[0], user, mode: 'payment', isNative },
      });
      console.log('Got session', sessionId);
      //const stripe = await getStripe();
      console.log('Got stripe');
      window.Stripe!(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
      ).redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error('Unable to complete checkout at this time');
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleShowQRCode = () => {
    onClose()
    onOpenQRCode()
  }

  const handleExitParty = async() => {
    setPartyPlaylistId(null)
    setIsPartyOwner(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onChange={onChange}>
      <div className="gap-y-2 flex flex-col mb-4">
            <SytledButton
              onClick={handleShowQRCode}
              className="items-center flex justify-center bg-white"
            >
              Show QR Code
            </SytledButton>
            <SytledButton
              onClick={handleBuyVoteBooster}
              className="items-center flex justify-center bg-primary-purple"
            >
              Buy Vote Booster
            </SytledButton>
            <SytledButton
              className="items-center flex justify-center bg-white mt-4"
              onClick={handleExitParty}
            >
             Exit Party
            </SytledButton>
          </div>
    </Modal>
  );
};

export default PartyOptionsModal;

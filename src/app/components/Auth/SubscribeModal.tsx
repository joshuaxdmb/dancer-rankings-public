'use client';

import { Price, ProductWithPrice } from '@/types/types';
import Modal from '../Modal';
import SytledButton from '../SytledButton';
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { postData } from '@/lib/helpers';
import useSubscribeModal from '@/hooks/useSubscribeModal';
import Box from '../Box';
import { BeatLoader } from 'react-spinners';
import FireAnimation from '../../animations/FireLottie';
import { MdCheckCircle } from 'react-icons/md';


const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price.unit_amount || 0) / 100);

  return priceString;
};
interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  let content = (
    <div className="text-center">No product selected. Try again?</div>
  );
  const { isOpen, onClose } = useSubscribeModal();
  const { user, isLoading } = useUser();
  const [priceId, setPriceId] = useState<string>();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleCheckout = async (price: Price) => {
    setPriceId(price.id);
    if (!user) {
      setPriceId(undefined);
      return toast.error('Please login to continue');
    }

    try {
      const { sessionId } = await postData({
        url: 'api/create-checkout-session',
        data: { price },
      });
      console.log("Got session", sessionId)
      //const stripe = await getStripe();
      console.log('Got stripe')
      window.Stripe!(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '').redirectToCheckout({sessionId})
    } catch (error) {
      toast.error('Unable to complete checkout at this time');
    } finally {
      setPriceId(undefined);
    }
  };

  if (products?.length > 0) {
    content = (
      <div className="text-left items-center justify-center flex-col flex w-full">
        <div className='flex items-center justify-around text-center gap-2 mb-5'>
        <div className='text-[50px] md:text-3xl items-center flex justify-center'>🕺</div>
        <div className="text-3xl font-bold"> Become a VIP Dancer</div>
        <div className='text-[50px] md:text-3xl'>💃</div>
        </div>
        <div className="space-y-2 text-left w-5/6 text-lg">
          <ul className="list-none pl-5">
            <li className="flex items-center">
              <MdCheckCircle className="text-green-400 mr-2" />
              <div className="text-gray-300">Create QR code parties</div>
            </li>
            <li className="flex items-center">
              <MdCheckCircle className="text-green-400 mr-2" />
              <div className="text-gray-300">$0 fees for booking classes</div>
            </li>
            <li className="flex items-center">
              <MdCheckCircle className="text-green-400 mr-2" />
              <div className="text-gray-300">Special discounts on dance gear</div>
            </li>
            <li className="flex items-center">
              <MdCheckCircle className="text-green-400 mr-2" />
              <div className="text-gray-300">Access vote boosters</div>
            </li>
            <li className="flex items-center">
              <MdCheckCircle className="text-green-400 mr-2" />
              <div className="text-gray-300">Cancel anytime</div>
            </li>
          </ul>
        </div>

        <FireAnimation />
        {products
          .filter((p) => p.name === 'Dancers App Premium')
          .map((product) => (
            <div className="w-full" key={product.id}>
              {product?.prices?.length ? (
                product.prices.map((price) => (
                  <SytledButton
                    onClick={() => {
                      handleCheckout(price);
                    }}
                    key={price.id}
                    className="text-2xl font-bold bg-green-400"
                  >
                    {`${formatPrice(price)}/month`}
                  </SytledButton>
                ))
              ) : (
                <SytledButton className="text-2xl font-bold w-full">
                  Contact for Price
                </SytledButton>
              )}
            </div>
          ))}
      </div>
    );
  } else if (isLoading) {
    content = (
      <Box className="h-full flex items-center justify-center flex-col">
        <BeatLoader color="#FFFFFF" size={20} />
        <h1 className="text-lg mt-4">Getting the latest info...</h1>
      </Box>
    );
  }
  return (
    <Modal isOpen={isOpen} onChange={onChange}>
      {content}
    </Modal>
  );
};

export default SubscribeModal;

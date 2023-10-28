'use client';

import { Price, ProductWithPrice } from '@/types/types';
import Modal from './Modal';
import SytledButton from './SytledButton';
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { postData } from '@/lib/helpers';
import { getStripe } from '@/lib/stripeClient';

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format(price.unit_amount || 0 / 100);

  return priceString;
};
interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  let content = (
    <div className="text-center">No product selected. Try again?</div>
  );
  const {user, isLoading, subscription} = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState<string>()
  
  const handleCheckout = async (price:Price) => {
    setPriceIdLoading(price.id)
    if(!user){
      setPriceIdLoading(undefined)
      return toast.error('Please login to continue')
    }

    try {
      const {sessionId} = await postData({
        url: '/api/create-checkout-session',
        data: {price}
      })
      const stripe = await getStripe()
      stripe?.redirectToCheckout({sessionId})
    } catch (error) {
      toast.error('Unable to complete checkout at this time')
    } finally {
      setPriceIdLoading(undefined)
    }
  }

  if (products?.length > 0) {
    content = (
      <div className="text-center">
        {products.map((product) => (
          <div key={product.id}>
            <div className="text-2xl font-bold">{product.name}</div>
            <div className="text-2xl font-bold">{product.description}</div>
            {product?.prices?.length ? (
              product.prices.map((price) => (
                <SytledButton onClick={()=>{handleCheckout(price)}} key={price.id} className="text-2xl font-bold">
                  {formatPrice(price)}
                </SytledButton>
              ))
            ) : (
              <SytledButton className="text-2xl font-bold">
                Contact for Price
              </SytledButton>
            )}
          </div>
        ))}
      </div>
    );
  }
  return (
    <Modal
      title="Become a VIP Dancer"
      description="No fees for booking classes. Special discounts. Cancel anytime."
      isOpen={false}
      onChange={() => {}}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;

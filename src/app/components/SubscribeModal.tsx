'use client';

import { ProductWithPrice } from '@/types/types';
import Modal from './Modal';
interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({
    products
}) => {
  let content = (
    <div className="text-center">No product selected. Try again?</div>
  );

  if(products?.length > 0){
    content = (
      <div className="text-center">
        {products.map((product) => (
          <div key={product.id}>
            <div className="text-2xl font-bold">{product.name}</div>
            <div className="text-2xl font-bold">{(product.prices?.[0]?.unit_amount)?`$${(product.prices?.[0]?.unit_amount)*0.01}` : 'Contact for price'}</div>
            <div className="text-2xl font-bold">{product.description}</div>
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

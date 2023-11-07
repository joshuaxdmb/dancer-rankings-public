'use client';

import { useRouter } from 'next/navigation';
import useSubscribeModal from '@/hooks/useSubscribeModal';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { postData } from '@/lib/helpers';
import Sparkles from 'react-sparkle';
import toast from 'react-hot-toast';
import SytledButton from '../components/SytledButton';

const AccountContent = () => {
  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { isLoading, subscription, user } = useUser();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url } = await postData({
        url: '/api/create-portal-link',
      });
      window.location.assign(url);
    } catch (error) {
      if (error) {
        console.log(error);
        toast.error('Unable to fetch customer portal');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-7 px-6 w-full items-center justify-center flex">
      {!subscription ? (
        <div className="flex items-center flex-col sm:flex-row gap-2 justify-center w-full">
          <p className='hidden sm:flex '>No active plan.</p>
          <SytledButton
            onClick={subscribeModal.onOpen}
            className="bg-green-400 px-6 py-2 max-w-[200px] flex items-center justify-center gap-x-2"
          >
            Go Premium
          </SytledButton>
        </div>
      ) : (
        <div className="relative h-2 text-center max-w-[300px]">
          <p>
            You are on the <b>premium dancers</b> plan
            <Sparkles count={5} minSize={5} fadeOutSpeed={10} flicker={false} />
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountContent;

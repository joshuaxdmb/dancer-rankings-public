import { useSpotify } from '@/hooks/useSpotify';
import { useUser } from '@/hooks/useUser';
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import SytledButton from '../components/SytledButton';
import toast from 'react-hot-toast';
import {useSupabase} from '@/hooks/useSupabase'
import { useRecoilState } from 'recoil';
import { housePartyAtom } from '@/atoms/housePartyAtom';
import useQrCodeModal from '@/hooks/useQRCodeModal';

type Props = {}


const CreateHouseParty = (props: Props) => {
  const { isPremium, isLoading, user } = useUser();
  const { userDetails } = useSpotify();
  const [error, setError] = useState<string | null>(null);
  const [housePartyId, setHousePartyId] = useRecoilState(housePartyAtom)

  const supabase = useSupabase()

  useEffect(() => {
    setError(null);
    if (userDetails?.product !== 'premium') {
      setError('You need Spotify Premium to host a house party :(');
    }
    if (!isPremium) {
      setError('You need to be a premium member to create a house party');
    }

    if(!user?.id){
        setError('You need to be logged in to create a house party')
    }
  }, [userDetails, isPremium, user]);

  const createHousePartyHandler = async() =>{
    if(error || !isPremium || !userDetails?.product || !user?.id){
        toast.error(error || 'Unable to create house party, you need to be a premium user', {id: 'create-house-party-error'}) 
        return   
    }

    try{
        const data = await supabase.getParty(user?.id)
        console.log(data)
        setHousePartyId(data?.id)

    } catch (error){
        console.log(error)
        toast.error('Unable to create house party', {id: 'create-house-party-error'})
    }

  }

  if (isLoading) {
    return <Loading message="Hang on a second..." />;
  }
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="gap-y-2 flex flex-col w-full items-center">
        <SytledButton className="max-w-[300px] bg-white">
          Join a House Party
        </SytledButton>
        <SytledButton onClick={createHousePartyHandler} sparkle sparkleWidth={300} className="max-w-[300px] bg-purple-500">
          Create House Party
        </SytledButton>
      </div>
    </div>
  );
};

export default CreateHouseParty;

import React from 'react';
import StyledButton from '../SytledButton';
import { FaSignOutAlt } from 'react-icons/fa';
import { LocationIdsEnum, Locations } from '@/content';
import { useRecoilState } from 'recoil';
import { locationAtom } from '@/atoms/locationAtom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import useSubscribeModal from '@/hooks/useSubscribeModal';

type Props = {};

const AuthButtons = (props: Props) => {
  const [location, setLocation] = useRecoilState(locationAtom);
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { onOpen: openSubscribe } = useSubscribeModal();

  const handleLocationChange = async (location: LocationIdsEnum) => {
    setLocation(location);
  };

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    await signOut();
    //Add reset any playing songs
    router.push('/');
    if (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-10 w-full flex items-center justify-center flex-col gap-4 pb-5">
      <StyledButton
        onClick={() => {}}
        className="bg-white px-6 py-0 max-w-[200px] flex items-center justify-center gap-x-2"
      >
        <select
          id="location"
          name="location"
          className="w-full p-2 border-none rounded mt-1 bg-white text-center"
          value={location}
          onChange={(e) => {
            handleLocationChange(e.target.value as LocationIdsEnum);
          }}
        >
          {Locations.map((location, index) => (
            <option key={index} value={location.id}>
              {location.label}
            </option>
          ))}
        </select>
      </StyledButton>
      <StyledButton
        onClick={handleLogout}
        className="bg-white px-6 py-2 max-w-[200px] flex items-center justify-center gap-x-2"
      >
        Log Out <FaSignOutAlt />
      </StyledButton>
      <StyledButton
        onClick={openSubscribe}
        className="bg-green-400 px-6 py-2 max-w-[200px] flex items-center justify-center gap-x-2"
      >
        Go Premium
      </StyledButton>
    </div>
  );
};

export default AuthButtons;

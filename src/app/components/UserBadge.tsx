import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
    userDetails: SpotifyApi.CurrentUsersProfileResponse;
};

const UserBadge = ({userDetails}: Props) => {
  const router = useRouter();
  const goToAccountPage = () => {
    router.push('/account');
  };
  return (
    <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-lg flex-shrink-0">
      <Image
        width={25}
        height={25}
        className="rounded-full w-10 h-10"
        src={userDetails?.images?.[0].url || '/assets/icons/spotify.svg'}
        alt="user-image"
      />
      <button onClick={goToAccountPage} className="px-2">
        {userDetails.display_name}
      </button>
    </div>
  );
};

export default UserBadge;

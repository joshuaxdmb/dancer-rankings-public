import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BiSolidParty } from "react-icons/bi";
import usePartyOptionsModal from '@/hooks/usePartyOptionsModal';

type Props = {
    partyId: string;
};

const PartyBadge = ({partyId}: Props) => {
  const { onOpen } = usePartyOptionsModal();
  
  return (
    <div className="flex items-center bg-white space-x-3 opacity-100 hover:opacity-80 cursor-pointer rounded-full p-2 pr-2 text-lg flex-shrink-0">
      <BiSolidParty color="black"
        size={30}
      />
      <button onClick={onOpen} className="pr-2 text-[15px] text-black font-semibold bg-white">
        Party Options
      </button>
    </div>
  );
}

export default PartyBadge;

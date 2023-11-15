'use client';
import Header from '@/app/components/Header';
import { useRecoilState } from 'recoil';
import PlayingBar from '../components/PlayingBar';
import SongsCenter from '../components/SongsCenter';
import { housePartyAtom } from '@/atoms/housePartyAtom';
import CreateHouseParty from './CreateHouseParty';
import SytledButton from '../components/SytledButton';
import useQrCodeModal from '@/hooks/useQRCodeModal';
import useAuthModal from '@/hooks/useAuthModal';

export default function Home() {
  const [housePartyId] = useRecoilState<string | null>(housePartyAtom);
  const {onOpen} = useQrCodeModal()

  const theme = {
    pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
    playingBarBackground:
      'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900',
  };

  const openQRCodeModal = () => {
    console.log('Opening modal')
    onOpen()
  }

  return (
    <div
      className={`
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
        ${theme.pageBackground}
      `}
    >
      <Header
        className="bg-none"
        pageTitle={`What are we dancing to? 🎉`}
      />
      {!housePartyId ? (
        <CreateHouseParty />
      ) : (
        <div className='h-full'>
          <div className=' items-center justify-center rounded-full text-sm flex pb-2 flex-row transition cursor-pointer text-neutral-600 gap-1 '><SytledButton onClick={openQRCodeModal} className='w-11/12 sm:w-5/6 lg:w-1/2 bg-green-400'>Invite Friends</SytledButton></div>
          
          <SongsCenter playlist={housePartyId || ''} />
          <PlayingBar backGroundColor={theme.playingBarBackground} />
        </div>
      )}
    </div>
  );
}

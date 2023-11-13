'use client';
import Header from '@/app/components/Header';
import { useRecoilState } from 'recoil';
import PlayingBar from '../components/PlayingBar';
import SongsCenter from '../components/SongsCenter';
import { housePartyAtom } from '@/atoms/housePartyAtom';
import QRCode from './QRCode';
import CreateHouseParty from './CreateHouseParty';

export default function Home() {
  const [housePartyId] = useRecoilState<string | null>(housePartyAtom);

  const theme = {
    pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
    playingBarBackground:
      'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900',
  };

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
        <div>
          <SongsCenter playlist={housePartyId || ''} />
          <PlayingBar backGroundColor={theme.playingBarBackground} />
        </div>
      )}
    </div>
  );
}

'use client';
import Header from '@/app/components/layout/Header';
import { useRecoilState } from 'recoil';
import PlayingBar from '../components/PlayingBar';
import SongsCenter from '../components/layout/SongsCenter';
import { housePartyAtom } from '@/atoms/housePartyAtom';
import CreateHouseParty from './components/CreateHouseParty';
import HousePartyBadge from './HousePartyBadge';

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
        scrollbar-hide
        ${theme.pageBackground}
      `}
    >
      <Header className="bg-none" pageTitle={`What are we dancing to? 🎉`} pageBadge={housePartyId ? <HousePartyBadge partyId={housePartyId}/> : undefined} />
      {!housePartyId ? (
        <CreateHouseParty />
      ) : (
        <div className="h-full">
          <SongsCenter playlist={housePartyId || ''} />
          <PlayingBar backGroundColor={theme.playingBarBackground} />
        </div>
      )}
    </div>
  );
}

'use client';
import Header from '@/app/components/layout/Header';
import { useRecoilState } from 'recoil';
import PlayingBar from '../components/PlayingBar';
import SongsCenter from '../components/layout/SongsCenter';
import { partyPlaylistAtom } from '@/atoms/partyPlaylistAtom';
import CreatePartyPlaylist from './components/CreatePartyPlaylist';
import PartyBadge from './components/PartyBadge';
import { themes } from '@/lib/themes';

export default function Home() {
  const [partyPlaylistId] = useRecoilState<string | null>(partyPlaylistAtom);

  const theme = {
    pageBackground: 'bg-gradient-to-transparent from-purple-900 via-transparent',
    playingBarBackground:
      'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900 bg- ',
  };

  return (
    <div
      className={`
        rounded-lg 
        h-full 
        w-full
        ${partyPlaylistId ? themes.default.pageBackground : theme.pageBackground}
        z-10
      `}
    >
      <Header className={`z-20 bg-none`} pageTitle={`What are we dancing to? 🎉`} pageBadge={partyPlaylistId ? <PartyBadge partyId={partyPlaylistId}/> : undefined} />
      {!partyPlaylistId ? (
        <CreatePartyPlaylist />
      ) : (
        <div className="h-full">
          <SongsCenter playlist={partyPlaylistId || ''} />
          <PlayingBar backGroundColor={theme.playingBarBackground} />
        </div>
      )}
    </div>
  );
}

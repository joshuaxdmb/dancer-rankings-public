'use client'
import Header from '@/app/components/layout/Header';
import { LocationIdsEnum, LocationLabels, PlaylistEnum, PlaylistLabels } from '../../../content';
import { useRecoilState } from 'recoil';
import { locationAtom } from '@/atoms/locationAtom';
import PlayingBar from '../components/PlayingBar';
import { playlistAtom } from '@/atoms/playlistAtom';
import EventsCenter from '../components/EventsCenter';
import EventsBadge from './components/EventsBadge'


export default function Home() {

  const [playlist] = useRecoilState<PlaylistEnum>(playlistAtom)
  const [location] = useRecoilState<LocationIdsEnum>(locationAtom);

  const themes = {
    [PlaylistEnum.bachata]:{
      pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
      playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900'
    },
    [PlaylistEnum.salsa]:{
      pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
      playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900'
    },
    [PlaylistEnum.zouk]:{
      pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
      playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900'
    }
  }

  return (
    <div
      className={`
        bg-neutral-900 
        rounded-lg 
        h-screen
        flex
        flex-col
        w-full 
        ${themes[playlist].pageBackground}
      `}
    >
      <Header spotifyRequired={false} pageBadge={<EventsBadge/>} className='bg-none'pageTitle={`Top Events | ${LocationLabels[location]}`}>
      </Header>
      <EventsCenter/>
    </div>
  );
}

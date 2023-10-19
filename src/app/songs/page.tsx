'use client'
import Header from '@/app/components/Header';
import Center from '../components/Center';
import { LocationIdsEnum, LocationLabels, PlaylistEnum } from '@/content';
import { useRecoilState } from 'recoil';
import { locationAtom } from '@/atoms/locationAtom';
import Script from 'next/script';
import PlayingBar from '../components/PlayingBar';
import { playlistAtom } from '@/atoms/playlistAtom';


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
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
        ${themes[playlist].pageBackground}
      `}
    >
      <Header className='bg-none'pageTitle={`Top Bachata Songs | ${LocationLabels[location]}`}>
      </Header>
      <Center playlistFilter={PlaylistEnum.bachata}/>
      <PlayingBar backGroundColor={themes[playlist].playingBarBackground}/>
    </div>
  );
}

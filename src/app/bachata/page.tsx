'use client'
import Header from '@/app/components/Header';
import Center from '../components/Center';
import { LocationLabels, PlaylistEnum } from '@/content';
import { useRecoilState } from 'recoil';
import { locationAtom } from '@/atoms/locationAtom';
import Script from 'next/script';
import PlayingBar from '../components/PlayingBar';


export default function Home() {

  const [location] = useRecoilState(locationAtom)
  const songs = []

  return (
    <div
      className="
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
        bg-gradient-to-b from-purple-900 via-black
      "
    >
      <Header className='bg-none'pageTitle={`Top Bachata Songs | ${LocationLabels[location]}`}>
      </Header>
      <Center playlistFilter={PlaylistEnum.bachata}/>
      <PlayingBar backGroundColor='bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900'/>
    </div>
  );
}

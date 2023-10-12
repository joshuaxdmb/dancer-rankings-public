'use client'
import Header from '@/app/components/Header';
import Center from '../components/Center';
import { LocationLabels, PlaylistEnum } from '@/content';
import { useRecoilState } from 'recoil';
import { locationAtom } from '@/atoms/locationAtom';


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
      "
    >
      <Header className='bg-gradient-to-b from-purple-900' pageTitle={`Top Bachata Songs | ${LocationLabels[location]}`}>
      </Header>
      <Center playlistFilter={PlaylistEnum.bachata}/>
    </div>
  );
}

'use client'
import Header from '@/app/components/layout/Header'
import Center from '../components/layout/SongsCenter'
import { LocationIdsEnum, LocationLabels, PlaylistEnum, PlaylistLabels } from '../../../content'
import { useRecoilState } from 'recoil'
import { locationAtom } from '@/atoms/locationAtom'
import PlayingBar from '../components/PlayingBar'
import { playlistAtom } from '@/atoms/playlistAtom'
import { themes } from '@/lib/themes'

export default function Home() {
  const [playlist] = useRecoilState<PlaylistEnum>(playlistAtom)
  const [location] = useRecoilState<LocationIdsEnum>(locationAtom)

  return (
    <div
      className={`
        bg-black
        rounded-lg 
        w-full
        h-screen
        flex
        flex-col
        ${themes[playlist]?.pageBackground || themes.default.pageBackground}
      `}>
      <Header
        className='bg-none'
        pageTitle={`Top ${PlaylistLabels[playlist]} Songs | ${LocationLabels[location]}`}></Header>
      <Center playlist={playlist || PlaylistEnum.bachata} />
      <PlayingBar backGroundColor={themes[playlist].playingBarBackground} />
    </div>
  )
}

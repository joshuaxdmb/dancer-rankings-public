'use client'
import Header from '@/app/components/layout/Header'
import Center from '../components/layout/SongsCenter'
import { LocationIdsEnum, LocationLabels, PlaylistEnum, PlaylistLabels } from '../../../content'
import { useRecoilState } from 'recoil'
import { locationAtom } from '@/atoms/locationAtom'
import PlayingBar from '../components/PlayingBar'
import { playlistAtom } from '@/atoms/playlistAtom'

export default function Home() {
  const [playlist] = useRecoilState<PlaylistEnum>(playlistAtom)
  const [location] = useRecoilState<LocationIdsEnum>(locationAtom)

  const themes = {
    [PlaylistEnum.bachata]: {
      pageBackground: 'bg-gradient-to-b from-purple-900 via-black',
      playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900',
    },
    [PlaylistEnum.salsa]: {
      pageBackground: 'bg-gradient-to-b from-red-950 via-black',
      playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-red-950 via-red-950',
    },
    [PlaylistEnum.zouk]: {
      pageBackground: 'bg-gradient-to-b from-blue-900 via-black',
      playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-blue-900 via-blue-900',
    },
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
        scrollbar-hide
        ${themes[playlist].pageBackground}
      `}>
      <Header
        className='bg-none'
        pageTitle={`Top ${PlaylistLabels[playlist]} Songs | ${LocationLabels[location]}`}></Header>
      <Center playlist={playlist || PlaylistEnum.bachata} />
      <PlayingBar backGroundColor={themes[playlist].playingBarBackground} />
    </div>
  )
}

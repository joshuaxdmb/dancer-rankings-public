'use client'
import Header from '@/app/components/layout/Header'
import Center from '../components/layout/SongsCenter'
import { LocationIdsEnum, LocationLabels, PlaylistEnum, PlaylistLabels } from '../../../content'
import { useRecoilState } from 'recoil'
import { locationAtom } from '@/atoms/locationAtom'
import PlayingBar from '../components/PlayingBar'
import { playlistAtom } from '@/atoms/playlistAtom'
import { themes } from '@/lib/themes'
import PageWrapper from '../party-playlist/components/PageWrapper'
import SongsBadge from './SongsBadge'

export default function Home() {
  const [playlist] = useRecoilState<PlaylistEnum>(playlistAtom)
  const [location] = useRecoilState<LocationIdsEnum>(locationAtom)

  return (
    <PageWrapper playlist={playlist}>
      <Header
        className='z-20 bg-none'
        pageTitle={`Top ${PlaylistLabels[playlist]} Songs | ${LocationLabels[location]}`}
        pageBadge={<SongsBadge/>}></Header>
      <Center playlist={playlist || PlaylistEnum.bachata} />
      <PlayingBar backGroundColor={themes[playlist].playingBarBackground} />
    </PageWrapper>
  )
}

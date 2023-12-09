'use client'
import Header from '@/app/components/layout/Header'
import Center from '../components/layout/SongsCenter'
import { LocationIdsEnum, LocationLabels, PlaylistEnum, PlaylistLabels } from '../../../content'
import { useRecoilState } from 'recoil'
import { locationAtom } from '@/atoms/locationAtom'
import PlayingBar from '../components/PlayingBar'
import { playlistAtom } from '@/atoms/playlistAtom'
import { themes } from '@/lib/themes'
import PageWrapper, { BachataPageWrapper, SalsaPageWrapper } from '../party-playlist/components/PageWrapper'
import { useEffect } from 'react'

export default function Home() {
  const [playlist] = useRecoilState<PlaylistEnum>(playlistAtom)
  const [location] = useRecoilState<LocationIdsEnum>(locationAtom)

  useEffect(() => {
    
  },[playlist])

  return (
    <PageWrapper playlist={playlist}>
      <Header
        className='bg-none'
        pageTitle={`Top ${PlaylistLabels[playlist]} Songs | ${LocationLabels[location]}`}></Header>
      <Center playlist={playlist || PlaylistEnum.bachata} />
      <PlayingBar backGroundColor={themes[playlist].playingBarBackground} />
    </PageWrapper>
  )
}

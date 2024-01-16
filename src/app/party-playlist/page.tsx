'use client'
import React, { useEffect } from 'react'
import Header from '@/app/components/layout/Header'
import { useRecoilState } from 'recoil'
import PlayingBar from '../components/PlayingBar'
import SongsCenter from '../components/layout/SongsCenter'
import { partyPlaylistAtom } from '@/atoms/partyPlaylistAtom'
import CreatePartyPlaylist from './components/CreatePartyPlaylist'
import PartyBadge from './components/PartyBadge'
import { themes } from '@/lib/themes'
import { Capacitor } from '@capacitor/core'
import { App, URLOpenListenerEvent } from '@capacitor/app'
import { useSupabase } from '@/hooks/useSupabase'
import toast from '@/lib/toast'

export default function Home() {
  const isNative = Capacitor.isNativePlatform()
  const [partyPlaylistId, setPartyPlaylistId] = useRecoilState<string | null>(partyPlaylistAtom)
  const supabase = useSupabase()

  useEffect(() => {
    if (!isNative) return
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const url = new URL(event.url)
      console.log('Got url', url)
      handleUrl(url)
    })

    return () => {
      App.removeAllListeners()
    }
  }, [])

  useEffect(() => {
    if (isNative) return
    const url = window.location.href
    console.log('Got URL', url)
    handleUrl(new URL(url))
  }, [])

  const handleUrl = async (url: URL) => {
    const partyId = url.searchParams.get('id')
    if (partyId) {
      handleJoinParty(partyId)
    }
  }

  const handleJoinParty = async (partyId?: string) => {
    const partyIdToJoin = partyId
    const partyExists = await supabase.checkPartyExists(partyIdToJoin)
    if (!partyExists) {
      toast.error('No parties found. You can create one!', {
        id: 'party-does-not-exist',
        icon: '⚠️',
      })
    } else {
      console.log('Setting party id:', partyIdToJoin)
      setPartyPlaylistId(partyIdToJoin)
    }
  }

  const theme = {
    pageBackground: 'bg-gradient-to-transparent from-purple-900 via-transparent',
    playingBarBackground: 'bg-opacity-80 bg-gradient-to-t from-purple-900 via-purple-900 bg- ',
  }

  return (
    <div
      className={`
        rounded-lg 
        h-full 
        w-full
        ${partyPlaylistId ? themes.default.pageBackground : theme.pageBackground}
        z-10
      `}>
      <Header
        className={`z-20 bg-none`}
        pageTitle={`What are we dancing to? 🎉`}
        pageBadge={partyPlaylistId ? <PartyBadge partyId={partyPlaylistId} /> : undefined}
      />
      {!partyPlaylistId ? (
        <CreatePartyPlaylist />
      ) : (
        <div className='h-full'>
          <SongsCenter playlist={partyPlaylistId || ''} isParty={true} />
          <PlayingBar backGroundColor={theme.playingBarBackground} />
        </div>
      )}
    </div>
  )
}

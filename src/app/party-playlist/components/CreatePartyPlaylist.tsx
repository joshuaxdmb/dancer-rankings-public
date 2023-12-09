import { useSpotify } from '@/hooks/useSpotify'
import { useUser } from '@/hooks/useUser'
import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import SytledButton from '../../components/global/SytledButton'
import toast from '@/lib/toast'
import { useSupabase } from '@/hooks/useSupabase'
import { useRecoilState } from 'recoil'
import { partyPlaylistAtom } from '@/atoms/partyPlaylistAtom'
import { BarcodeScanner, CameraDirection } from '@capacitor-community/barcode-scanner'
import { didUserGrantPermission, getPartyIdFromQRCodeLink } from '../party-playlist-utils'
import StyledTextInput from '@/app/components/StyledTextInput'

type Props = {}

const CreatePartyPlaylist = (props: Props) => {
  const { isPremium, isLoading, user } = useUser()
  const { userDetails } = useSpotify()
  const [error, setError] = useState<string | null>(null)
  const [partyPlaylistId, setPartyPlaylistId] = useRecoilState(partyPlaylistAtom)
  const [isPartyOwner, setIsPartyOwner] = useState(false)
  const [enteredPartyId, setEnteredPartyId] = useState('')

  const supabase = useSupabase()

  const handleJoinParty = async (partyId?: string) => {
    const partyIdToJoin = partyId || enteredPartyId
    const partyExists = await supabase.checkPartyExists(partyIdToJoin)
    if (!partyExists) {
      toast.error('No parties found. You can create one!', {
        id: 'party-does-not-exist',
        icon: '⚠️',
      })
    } else {
      setPartyPlaylistId(partyIdToJoin)
    }
  }

  const startScan = async () => {
    try {
      const hasPermission = await didUserGrantPermission()
      const result = await BarcodeScanner.startScan({
        cameraDirection: CameraDirection.BACK,
      })

      // if the result has content
      if (result.hasContent) {
        const id = getPartyIdFromQRCodeLink(result.content)
        setPartyPlaylistId(id)
        toast.success('Joining ' + id, { id: 'party-found' })
      }

      if(partyPlaylistId){
        console.log('Stopping scan. Party playlist id found elsewhere')
        stopScan()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const stopScan = () => {
    try {
      BarcodeScanner.stopScan()
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    setError(null)
    if (userDetails?.product !== 'premium') {
      setError('You need Spotify Premium to host a house party :(')
    }
    if (!isPremium) {
      setError('You need to be a premium member to create a house party')
    }

    if (!user?.id) {
      setError('You need to be logged in to create a house party')
    }
  }, [userDetails, isPremium, user.action_link])

  useEffect(() => {
    if (!partyPlaylistId) {
     startScan()
    } else {
      stopScan()
    }

    return () => {
      stopScan()
    }

  }, [partyPlaylistAtom])

  const createPartyPlaylistHandler = async () => {
    if (error || !isPremium || !userDetails?.product || !user?.id) {
      toast.error(error || 'Unable to create house party, you need to be a premium user', {
        id: 'create-house-party-error',
      })
      return
    }

    try {
      const data = await supabase.getParty(user?.id)
      setPartyPlaylistId(data?.id)
      setIsPartyOwner(true)
    } catch (error) {
      console.log(error)
      toast.error('Unable to create house party', { id: 'create-house-party-error' })
    }
  }

  if (isLoading) {
    return <Loading message='Hang on a second...' />
  }
  return (
    <div className='flex flex-col justify-end items-center w-full top-0 right-0 h-3/4'>
      <div className='gap-y-2 flex flex-col w-full items-center'>
        <StyledTextInput
          id='partyId'
          value={enteredPartyId}
          setValue={setEnteredPartyId}
          placeholder={'Enter Party ID or Scan QR Code'}
          className='max-w-[300px] z-20 text-center bg-white mb-2'
        />

        <SytledButton
          showLoading={false}
          onClick={handleJoinParty}
          className='max-w-[300px] bg-white z-20'>
          Join a Party
        </SytledButton>
        <SytledButton
          onClick={createPartyPlaylistHandler}
          sparkle
          sparkleWidth={300}
          className='max-w-[300px] bg-purple-500 z-20'>
          Create a Party Playlist
        </SytledButton>
      </div>
    </div>
  )
}

export default CreatePartyPlaylist

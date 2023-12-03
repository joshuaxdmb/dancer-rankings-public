import React, { useState } from 'react'
import Modal from '../../components/layout/Modal'
import useQrCodeModal from '@/hooks/useQRCodeModal'
import { useRecoilState } from 'recoil'
import { partyPlaylistAtom } from '@/atoms/partyPlaylistAtom'
import QRCode from './QRCode'
import { useSupabase } from '@/hooks/useSupabase'
import toast from 'react-hot-toast'
import SytledButton from '@/app/components/global/SytledButton'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner'


type Props = {}

const QRCodeModal = ({}: Props) => {
  const [partyPlaylistId, setPartyPlaylistId] = useRecoilState(partyPlaylistAtom)
  const [enteredPartyId, setEnteredPartyId] = useState('')
  const { isOpen, onClose } = useQrCodeModal()
  const supabase = useSupabase()
  const onChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  const handleJoin = async () => {
    const partyExists = await supabase.checkPartyExists(enteredPartyId)
    if (!partyExists) {
      toast.error('No parties found. You can create one!', {
        id: 'party-does-not-exist',
        icon: '⚠️',
      })
    }
    setPartyPlaylistId(enteredPartyId)
    onClose()
  }
  return (
    <Modal isOpen={isOpen} onChange={onChange}>
      <div className='flex items-center justify-center flex-col gap-y-4'>
        <QRCode partyId={partyPlaylistId} />
        <input
                type="name"
                value={enteredPartyId}
                onChange={(e) => setEnteredPartyId(e.target.value)}
                placeholder="Or enter Party ID"
                className="w-full p-2 mx-2 border rounded text-center"
              />
        <SytledButton onClick={handleJoin} className="bg-green-400">Join</SytledButton>
        <div>Or enter party id: {partyPlaylistId}</div>
      </div>
    </Modal>
  )
}

export default QRCodeModal

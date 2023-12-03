import React from 'react'
import Modal from '../../components/layout/Modal'
import useQrCodeModal from '@/hooks/useQRCodeModal'
import { useRecoilState } from 'recoil'
import { partyPlaylistAtom } from '@/atoms/partyPlaylistAtom'
import QRCode from './QRCode'
import { useSupabase } from '@/hooks/useSupabase'

type Props = {}

const QRCodeModal = ({}: Props) => {
  const [partyPlaylistId, setPartyPlaylistId] = useRecoilState(partyPlaylistAtom)
  const { isOpen, onClose } = useQrCodeModal()
  const supabase = useSupabase()
  const onChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onChange={onChange}>
      <div className='flex items-center justify-center flex-col gap-y-4'>
        <QRCode partyId={partyPlaylistId} />
      </div>
    </Modal>
  )
}

export default QRCodeModal

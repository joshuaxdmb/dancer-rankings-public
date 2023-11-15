import React, {useState} from 'react';
import Modal from '../components/Modal';
import useQrCodeModal from '@/hooks/useQRCodeModal';
import { useRecoilState } from 'recoil';
import { housePartyAtom } from '@/atoms/housePartyAtom';
import QRCode from './QRCode';
import SytledButton from '../components/SytledButton';
import { useSupabase } from '@/hooks/useSupabase';
import toast from 'react-hot-toast';

type Props = {};

const QRCodeModal = ({}: Props) => {
  const [housePartyId, setHousePartyId] = useRecoilState(housePartyAtom);
  const [enteredPartyId, setEnteredPartyId] = useState('');
  const { isOpen, onClose } = useQrCodeModal();
  const supabase = useSupabase()
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleJoin = async() => {
    const partyExists = await supabase.checkPartyExists(enteredPartyId)
    if(!partyExists){
      toast.error('No parties found. You can create one!', {id: 'party-does-not-exist', icon: '⚠️'})
    }
    setHousePartyId(enteredPartyId);
    onClose();
  }
  return (
    <Modal isOpen={isOpen} onChange={onChange}>
      <div className='flex items-center justify-center flex-col gap-y-4'>
        <QRCode partyId={housePartyId} />
        <input
                type="name"
                value={enteredPartyId}
                onChange={(e) => setEnteredPartyId(e.target.value)}
                placeholder="Or enter Party ID"
                className="w-full p-2 mx-2 border rounded text-center"
              />
        <SytledButton onClick={handleJoin} className="bg-green-400">Join</SytledButton>
      </div>
    </Modal>
  );
};

export default QRCodeModal;

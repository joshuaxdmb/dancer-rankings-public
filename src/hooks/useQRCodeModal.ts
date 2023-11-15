import { create } from 'zustand'

interface QRCodeModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useQrCodeModal = create<QRCodeModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => {
        set({ isOpen: false })
    },
}))


export default useQrCodeModal;
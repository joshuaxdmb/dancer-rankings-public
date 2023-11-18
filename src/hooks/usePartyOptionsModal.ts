import { create } from 'zustand'

interface PartyOptionseModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const usePartyOptionsModal = create<PartyOptionseModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => {
        set({ isOpen: false })
    },
}))


export default usePartyOptionsModal;
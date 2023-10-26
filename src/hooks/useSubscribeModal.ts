import { create } from 'zustand'

interface SubscribeModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    authOption: 'signup'|'login';
    setAuthOption: (authOption: 'signup'|'login') => void;
}

const useSubscribeModal = create<SubscribeModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => {
        set({ isOpen: false })
    },
    authOption: 'signup',
    setAuthOption: (authOption: 'signup'|'login') => set({ authOption })
}))


export default useSubscribeModal;
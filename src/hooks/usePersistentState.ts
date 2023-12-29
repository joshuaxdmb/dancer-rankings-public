import { useEffect } from 'react'
import { RecoilState, useRecoilState } from 'recoil'
import Cookies from 'js-cookie'
import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'


export const usePersistentRecoilState = (atom: RecoilState<any>,) => {
    const cookieName = 'latindancers' + atom.key
    const isNative = Capacitor.isNativePlatform()
    const [state, setState] = useRecoilState(atom)

    const getFromStorage = async () => {
        try {
            const { value } = await Preferences.get({ key: atom.key })
            return JSON.parse(value)
        } catch (e) {
            console.log('Error loading storage', e)
        }
    }

    const setInStorage = async (newState?: any) => {
        const localState = newState || state
        try {
            await Preferences.set({ key: atom.key, value: JSON.stringify(localState) })
        } catch (e) {
            console.log('Error setting storage', e)
        }
    }

    const getCookie = () => {
        try {
            const cookieValue = Cookies.get(cookieName)
            const parsedCookie = cookieValue ? JSON.parse(cookieValue) : {}
            return parsedCookie[atom.key]
        } catch (e) {
            console.log('Error loading cookie', e)
        }
    }

    const setCookie = (newState?: any) => {
        const localState = newState || state
        try {
            const cookieValue = Cookies.get(cookieName)
            const parsedCookie = cookieValue ? JSON.parse(cookieValue) : {}
            Cookies.set(cookieName, JSON.stringify({ ...parsedCookie, [atom.key]: localState }))
        } catch (e) {
            console.log('Error setting cookie', e)
        }
    }

    useEffect(() => {
        async function loadState() {
            try {
                const storedState = await persistentState()
                console.log('Setting up persistent state', cookieName,storedState)
                if (!!storedState && storedState !== state) {
                    setState(storedState)
                }
            } catch (e) {
                console.error('Error loading state:', e)
            }
        }

        // Only load if this state has not been loaded yet
        if (state === null) loadState()

    }, [isNative])

    const persistentState = async () => {
        const storedState = isNative ? await getFromStorage() : await getCookie()
        return storedState
    }

    const setPersistentState = async (newState: any) => {
        console.log('Setting in storage/cookie ', cookieName, newState)
        if (isNative) {
            await setInStorage(newState)
        } else {
            setCookie(newState)
        }
    }

    // Update cookie whenever state changes
    useEffect(() => {
        const syncStorage = async () => {
            try {
                const storedState = isNative ? await getFromStorage() : await getCookie()
                // State might be null initially, so we need to check for that
                if (state !== null && (JSON.stringify(storedState) !== JSON.stringify(state))) {
                    console.log('Updating cookie', atom.key, 'from', storedState, 'to', state)
                    if (isNative) {
                        setInStorage()
                    } else {
                        setCookie()
                    }

                }
            } catch (e) {
                console.error('Error loading state:', e)
            }
        }
        syncStorage()
    }, [state, atom.key])

    return [state, setState, persistentState, setPersistentState]
}

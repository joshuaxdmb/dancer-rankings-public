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
            if (value !== null) {
                setState(JSON.parse(value))
            }
        } catch (e) {
            console.log('Error loading storage', e)
        }
    }

    const setInStorage = async () => {
        try {
            await Preferences.set({ key: atom.key, value: JSON.stringify(state) })
        } catch (e) {
            console.log('Error setting storage', e)
        }
    }

    const getCookie = () => {
        try {
            const cookieValue = Cookies.get(cookieName)
            const parsedCookie = cookieValue ? JSON.parse(cookieValue) : {}
            if (parsedCookie[atom.key] !== undefined) {
                setState(parsedCookie[atom.key])
            }
        } catch (e) {
            console.log('Error loading cookie', e)
        }
    }

    const setCookie = () => {
        try {
            const cookieValue = Cookies.get(cookieName)
            const parsedCookie = cookieValue ? JSON.parse(cookieValue) : {}
            Cookies.set(cookieName, JSON.stringify({ ...parsedCookie, [atom.key]: state }))
        } catch (e) {
            console.log('Error setting cookie', e)
        }
    }

    useEffect(() => {
        async function loadState() {
            try {
                const storedState = isNative ? await getFromStorage() : await getCookie()
                if (storedState !== undefined) {
                    setState(storedState)
                }
            } catch (e) {
                console.error('Error loading state:', e)
            }
        }
        loadState()
    }, [isNative]);;

    // Update cookie whenever state changes
    useEffect(() => {
        if (state === undefined || state === null) return
        if (isNative) {
            setInStorage()
        } else {
            setCookie()
        }

    }, [state, atom.key])

    return [state, setState]
}

'use client'
import { Toaster, ToastOptions } from 'react-hot-toast'
import DeviceSafeArea from '../classes/DeviceSafeArea'

const getTopInsets = ()=> {
  const insets = DeviceSafeArea.safeAreaInsets // Assuming this is a static getter
  return `${insets.top}px`
}

const ToasterProvider = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          marginTop: getTopInsets(),
        },
      }}
    />
  )
}

export default ToasterProvider

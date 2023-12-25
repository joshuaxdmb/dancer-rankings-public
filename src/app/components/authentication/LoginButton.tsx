import React from 'react'
import useAuthModal from '@/hooks/useAuthModal'
import StyledButton from '../global/SytledButton'
import { SpotifyProfile } from 'next-auth/providers/spotify'
import { BeatLoader } from 'react-spinners'

type Props = {
  isLoading: boolean
}

const LoginButton = ({ isLoading }: Props) => {
  const authModal = useAuthModal()

  if (isLoading) {
    return (
      <div className='flex flex-row items-center'>
        <div>
          <StyledButton onClick={() => {}} className='bg-white px-6 py-3 min-w-[100px]'>
            <BeatLoader size={10} />
          </StyledButton>
        </div>
      </div>
    )
  }
  return (
    <div className='flex flex-row items-center'>
      <div>
        <StyledButton
          onClick={() => {
            authModal.setAuthOption('login')
            authModal.onOpen()
          }}
          className='bg-white px-6 py-2 min-w-[100px]'>
          Log In
        </StyledButton>
      </div>
    </div>
  )
}

export default LoginButton

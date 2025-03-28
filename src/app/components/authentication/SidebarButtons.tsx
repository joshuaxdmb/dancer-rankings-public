import React from 'react'
import StyledButton from '../global/SytledButton'
import { FaSignOutAlt } from 'react-icons/fa'
import { LocationIdsEnum, Locations } from '../../../../content'
import { useRecoilState } from 'recoil'
import { locationAtom } from '@/atoms/locationAtom'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import useSubscribeModal from '@/hooks/useSubscribeModal'

type Props = {
  isPremiumUser: boolean
}

const AuthButtons = ({ isPremiumUser }: Props) => {
  const [location, setLocation] = useRecoilState(locationAtom)
  const supabaseClient = useSupabaseClient()
  const { onOpen: openSubscribe } = useSubscribeModal()
  const router = useRouter()
  const goToAccountPage = () => {
    router.push('/account')
  }

  const handleLocationChange = async (location: LocationIdsEnum) => {
    setLocation(location)
  }

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut()
    await signOut()
    //Add reset any playing songs
    //router.push('/');
    if (error) {
      console.log(error)
    }
  }

  return (
    <div className='mt-10 w-full flex items-center justify-center flex-col gap-4 pb-5'>
      <StyledButton
        onClick={() => {}}
        className='bg-white px-6 py-0 max-w-[200px] flex items-center justify-center gap-x-2'>
        <select
          id='location'
          name='location'
          className='w-full p-2 border-none rounded bg-white text-center h-10 min-h-[30px]'
          value={location}
          onChange={(e) => {
            handleLocationChange(e.target.value as LocationIdsEnum)
          }}>
          {Locations.map((location, index) => (
            <option key={index} value={location.id}>
              {location.label}
            </option>
          ))}
        </select>
      </StyledButton>
      <StyledButton
        onClick={handleLogout}
        className='bg-white px-6 py-2 max-w-[200px] flex items-center justify-center gap-x-2'>
        Log Out <FaSignOutAlt />
      </StyledButton>
      {isPremiumUser ? (
        <StyledButton
          sparkle={true}
          onClick={goToAccountPage}
          className='bg-primary-purple px-6 py-2 max-w-[200px] flex items-center justify-center gap-x-2'>
          Premium
        </StyledButton>
      ) : (
        <StyledButton
          sparkle={true}
          onClick={openSubscribe}
          className='bg-primary-purple px-6 py-2 max-w-[200px] flex items-center justify-center gap-x-2'>
          Go Premium
        </StyledButton>
      )}
    </div>
  )
}

export default AuthButtons

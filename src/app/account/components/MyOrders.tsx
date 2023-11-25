import { useUser } from '@/hooks/useUser'
import React from 'react'
import Box from '../../components/global/Box'
import { toBeautifulDateTime } from '@/utils/utils'

type Props = {}

const MyOrders = (props: Props) => {
  const { userOrders } = useUser()
  return (
    <Box className='padding-2 drop-shadow-sm bg-white bg-opacity-10 px-5 py-5 rounded-md'>
      {userOrders.map((order) => (
        <div key={order.id} className='flex-row flex justify-between items-center'>
          <div>
            <div>{order.product_name}</div>
            <div className=''>{toBeautifulDateTime(order.created)}</div>
          </div>

          <div>{order.consumed_at ? 'Used' : 'Available'}</div>
        </div>
      ))}
    </Box>
  )
}

export default MyOrders

import React from 'react'
import {BsFillArrowUpCircleFill} from 'react-icons/bs'

type Props = {}

const UpVote = (props: Props) => {
  return (
    <div className='transition opacity-70 rounded-full flex items-center justify-center drop-shadow-md group-hover:opacity-100 hover:scale-110'><BsFillArrowUpCircleFill size={24} className='text-neutral-500'/></div>
  )
}

export default UpVote
import React from 'react'

type Props = {
    titleContent: any
}

const Title = ({titleContent}: Props) => {
  return (
    
    <p
    className='w-full text-center text-xl font-bold max-w-[260px] sm:w-[260px]'>
    {titleContent.map((c:any, index:number)=><a key={index}
    style={{color: c.color || ''}}>
        {c.content}
    </a>)}
    </p>
  )
}

export default Title
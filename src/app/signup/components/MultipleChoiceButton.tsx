import React from 'react'
import StyledButton from '@/app/components/global/SytledButton'
import Image from 'next/image'

type Props = {
    selected?:boolean
    title:string
    onClick:Function
    image:string
}

const MultipleChoiceButton = ({selected, title, onClick, image}: Props) => {
    const unselectedStyle = {backgroundColor:'rgba(255,255,255,0.45)', color:'white', fontWeight:'lighter'}
    const selectedStyle = {backgroundColor:'#F7F3FA', color:'#0E194D', fontWeight:'bold', borderColor:'#8250E6'}
  return (
        <StyledButton
        onClick={onClick}
        style={selected? selectedStyle : unselectedStyle}
        className={`rounded-lg sm:min-w-[260px] ${image? 'h-[60px]' : 'h-[50px]'} text-left items-center justify-start pl-3 text-sm`}
        >{image && <Image className='mr-2' width={35} height={35} alt={'icon-'+image} src={image}/> }{title}</StyledButton>
  )
}

export default MultipleChoiceButton
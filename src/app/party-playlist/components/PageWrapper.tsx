import React from 'react'
import { PlaylistEnum } from '../../../lib/content'
import { themes } from '@/lib/themes'

type Props = {
  playlist?: PlaylistEnum
  children: React.ReactNode
}

export const BachataPageWrapper = ({ children }: Props) => {
  return (
    <div
      className={`
        rounded-lg 
        w-full
        h-screen
        flex
        flex-col
        ${themes.bachata.pageBackground}
      `}>
      {children}
    </div>
  )
}

export const SalsaPageWrapper = ({ children }: Props) => {
  return (
    <div
      className={`
            rounded-lg 
            w-full
            h-screen
            flex
            flex-col
            ${themes.salsa.pageBackground}
          `}>
      {children}
    </div>
  )
}

export const ZoukPageWrapper = ({ children }: Props) => {
  return (
    <div
      className={`
            rounded-lg 
            w-full
            h-screen
            flex
            flex-col
            ${themes.zouk.pageBackground}
          `}>
      {children}
    </div>
  )
}

export const DefaultPageWrapper = ({ children }: Props) => {
  return (
    <div
      className={`
            rounded-lg 
            w-full
            h-screen
            flex
            flex-col
            ${themes.default.pageBackground}
          `}>
      {children}
    </div>
  )
}

const PageWrapper = ({ playlist, children }: Props) => {
  switch (playlist) {
    case PlaylistEnum.bachata:
      return BachataPageWrapper({children })
    case PlaylistEnum.salsa:
      return SalsaPageWrapper({children })
    case PlaylistEnum.zouk:
      return ZoukPageWrapper({children })
    default:
      return (
        <div
          className={`
            rounded-lg 
            w-full
            h-screen
            flex
            flex-col
            ${themes.default.pageBackground}
          `}>
          {children}
        </div>
      )
  }
}

export default PageWrapper

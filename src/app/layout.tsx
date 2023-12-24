/*
This is the main layout component that wraps all pages. It contains all the providers and the sidebar.
*/

import Sidebar from '@/app/components/layout/Sidebar'
import './globals.css'
import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import SupabaseProvider from '@/providers/SupabaseProvider'
import UserProvider from '@/providers/UserProvider'
import ModalProvider from '@/providers/ModalProvider'
import RecoilProvider from '../providers/RecoilProvider'
import ToasterProvider from '../providers/ToasterProvider'
import SpotifyProvider from '../providers/SpotifyProvider'
import Script from 'next/script'
import AppUrlListener from '@/providers/AppUrlListener'
import UseCustomWebView from 'enable-webview-music-play'

const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '💃🕺 Latin Dancers App',
  description: 'The best music and events ranked by dancers',
  icons: {
    icon: 'icon.svg',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className='scrollbar-hide overflow-x-hidden overflow-y-hidden max-scale' lang='en' >
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={font.className}>
        <Script src='https://js.stripe.com/v3/' />
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <RecoilProvider>
              <SpotifyProvider>
                <AppUrlListener />
                <ModalProvider />
                <Sidebar>{children}</Sidebar>
              </SpotifyProvider>
            </RecoilProvider>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}

/* 
  Coded by: Joshua Madero
  Free License for Non-Commercial use

  J   OOO  SSS  H   H U   U   A       M   M   A   DDD   EEEEE RRR    OOO 
  J  O   O S    H   H U   U  A A      MM MM  A A  D  D  E     R   R O   O
  J  O   O SSS  HHHHH U   U AAAAA     M M M AAAAA D   D EEE   RRR   O   O
  J  O   O    S H   H U   U A    A    M   M A   A D  D  E     R  R  O   O
JJJ   OOO  SSS  H   H  UUU A      A   M   M A   A DDD   EEEEE R   R  OOO 

*/
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
    <html className='scrollbar-hide overflow-x-hidden overflow-y-hidden' lang='en'>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      <body className={font.className}>
        <Script src='https://js.stripe.com/v3/' />
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <RecoilProvider>
              <SpotifyProvider>
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

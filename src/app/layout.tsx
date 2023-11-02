import Sidebar from '@/app/components/Sidebar';
import './globals.css';
import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import SupabaseProvider from '@/providers/SupabaseProvider';
import UserProvider from '@/providers/UserProvider';
import ModalProvider from '@/providers/ModalProvider';
import RecoilProvider from '../providers/RecoilProvider';
import ToasterProvider from '../providers/ToasterProvider';
import PlayingBar from './components/PlayingBar';
import SpotifyProvider from '../providers/SpotifyProvider';
import Script from 'next/script';
import getActiveProductsWithPrices from '@/utils/productUtils';
import { ProductWithPrice } from '@/types/types';

const font = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '💃🕺 Dancers Rankings App',
  description: 'The best music and events ranked by dancers',
  icons: {
    icon: 'icon.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const products:ProductWithPrice[] = await getActiveProductsWithPrices()

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <RecoilProvider>
              <SpotifyProvider>
                <ModalProvider products={products}/>
                <Sidebar>{children}</Sidebar>
              </SpotifyProvider>
            </RecoilProvider>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

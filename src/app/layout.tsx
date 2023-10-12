import Sidebar from '@/app/components/Sidebar';
import './globals.css';
import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import SupabaseProvider from '@/app/providers/SupabaseProvider';
import UserProvider from '@/app/providers/UserProvider';
import ModalProvider from '@/app/providers/ModalProvider';
import RecoilProvider from './providers/RecoilProvider';
import ToasterProvider from './providers/ToasterProvider';

const font = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '💃🕺 Dancers Rankings App',
  description: 'The best music and events ranked by dancers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <RecoilProvider>
              <ModalProvider />
              <Sidebar>{children}</Sidebar>
            </RecoilProvider>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

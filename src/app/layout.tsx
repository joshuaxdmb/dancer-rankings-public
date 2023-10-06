import Sidebar from '@/app/components/Sidebar';
import './globals.css';
import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import SupabaseProvider from '@/app/providers/SupabaseProvider';
import UserProvider from '@/app/providers/UserProvider';
import ModalProvider from '@/app/providers/ModalProvider';
import { getProviders, signIn } from 'next-auth/react';

export async function getServerSideProps() {
  const providers = await getProviders();
  console.log('Providers', providers)

  return {
    props: { providers },
  };
}

const font = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '💃🕺 Dancers Rankings App',
  description: 'The best music and events ranked by dancers',
};

export default function RootLayout({
  children,
  providers
}: {
  children: React.ReactNode;
  providers: any;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider/>
            <Sidebar>{children}</Sidebar>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

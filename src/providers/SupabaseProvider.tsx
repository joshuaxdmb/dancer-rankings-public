'use client';

import SupabaseWrapper from '@/classes/SupabaseWrapper';
import { SupabaseWrapperContext } from '@/hooks/useSupabase';
import { Database } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';

interface SupabaseProviderProps {
  children: React.ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [supabaseClient] = useState(() =>
    createClientComponentClient<Database>()
  );

  const [supabaseWrapper] = useState(new SupabaseWrapper(supabaseClient))


  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <SupabaseWrapperContext.Provider value={supabaseWrapper}>
      {children}
      </SupabaseWrapperContext.Provider>
    </SessionContextProvider>
  );
};

export default SupabaseProvider;

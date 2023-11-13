import SupabaseWrapper from '@/classes/SupabaseWrapper';
import { createContext, useContext } from 'react';

// Create the context
export const SupabaseWrapperContext = createContext<SupabaseWrapper | null>(null);

export const useSupabase = () => {
    const context = useContext(SupabaseWrapperContext);
    if (context === null) {
        throw new Error('useSupabase must be used within a SupabaseWrapperContextProvider');
    }
    return context;
}
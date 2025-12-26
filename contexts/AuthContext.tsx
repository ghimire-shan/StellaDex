import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

interface AuthContextProps {
    session: Session | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
    session: null,
    loading: true,
});

export function AuthProvider({ children }: {children: React.ReactNode}) {
    const [session, setSession] = useState<Session | null> (null);
    const [loading, setLoading] = useState(true);

    // Get initial session
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session }}) => {
        setSession(session);
        setLoading(false);
      })
      
      // Be on the listen for any auth change
      const {data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      })

      return () => subscription.unsubscribe();
    }, []);

    return(
        <AuthContext.Provider value={{session, loading}}>
            {children}
        </AuthContext.Provider>
    );

}

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    };
    return context;
}
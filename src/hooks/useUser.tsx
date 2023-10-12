import {
  SubscriptionType,
  UserDetailsType,
} from '@/types/types';
import { User } from '@supabase/auth-helpers-nextjs';
import {
  useSessionContext,
  useUser as useSupaUser,
} from '@supabase/auth-helpers-react';
import React, { useContext, useEffect } from 'react';
import { createContext, useState } from 'react';
import toast from 'react-hot-toast';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetailsType | null;
  isLoading: boolean;
  subscription: SubscriptionType | null;
  spotifySession: any;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();

  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetailsType | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionType | null>(
    null
  );
  const [spotifySession, setSpotifySession] = useState<any>(null);

  const getSpotifySession = async() =>{
    const response = await fetch('/api/auth/session');
    const session = await response.json();
    console.log('Fetched spotify session')
    return session;
  }
  
  const getUserDetails = () => supabase.from('users').select('*').single();
  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();

  useEffect(() => {
    if ((user || !userDetails) && !isLoadingData) {
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()])
        .then((results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];
          if (userDetailsPromise.status === 'fulfilled') {
            setUserDetails(userDetailsPromise.value.data as UserDetailsType);
          }

          if (subscriptionPromise.status === 'fulfilled') {
            setSubscription(subscriptionPromise.value.data as SubscriptionType);
          }

          setIsLoadingData(false);
        })
        .catch((e) => {
          console.log('Error fetching user data:', e);
        });
    } else if (!user && !userDetails && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }

  }, [user, isLoadingUser]); //eslint-disable-line

  useEffect(() => {
    if(!spotifySession){
      getSpotifySession().then((session)=>{
        if(session.error==='RefreshAccessTokenError'){
          toast.error('Failed to log into Spotify',{id:'spotify-error'})
          return
        }
        setSpotifySession(session);
        toast.success('Logged into Spotify',{id:'spotify success'})
      }).catch((e)=>{
        console.log('Failed to fetch Spotify session',e)
      })
    } else {
      console.log('Spotify session already fetched')
    }
  },[spotifySession])//eslint-disable-line

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingData || isLoadingUser,
    subscription,
    spotifySession,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within MyUserContextProvider');
  }

  return context;
};

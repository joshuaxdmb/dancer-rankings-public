
import { UserDetailsType } from '@/types/types';

export const shouldUpdateFromSpotify = (userDetails: UserDetailsType, userDetailsSpotify: SpotifyApi.CurrentUsersProfileResponse) => {
  const insertData = {} as UserDetailsType;
  if (!userDetails.email) {
    insertData['email'] = userDetailsSpotify.email;
  }
  if (!userDetails.birthdate && userDetailsSpotify.birthdate) {
    insertData['birthdate'] = userDetailsSpotify.birthdate;
  }
  if (insertData.email || insertData.birthdate) {
    return insertData
  }
  return false
}

export const shouldUpdateUser = (insertData: UserDetailsType, userDetails: UserDetailsType): boolean => {
  // Get the keys of UserDetailsType
  const keys = Object.keys(insertData) as Array<keyof UserDetailsType>;

  // Iterate over the keys
  for (const key of keys) {
    // Check if the values are different
    if (insertData[key] !== userDetails[key]) {
      return true;
    }
  }
  return false;
};


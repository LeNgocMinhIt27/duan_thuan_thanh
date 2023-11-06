// export interface editProfile  {
//   // editProfile: (data: any | name : String | avatar_url : String | id : String ) => sdk.put(`me/editProfile/${id}`, data)
//   name : String ,
//   avatar_url : String ,
//   group : String

import { sdk } from "./axios";

// };
export const apiEditProfile = {
  edit: (value: any) => sdk.put(`edit/profile`, value)
};

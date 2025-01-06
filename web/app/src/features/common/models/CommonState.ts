import { Models } from "appwrite";

export interface CommonState {
  user: Models.User<Models.Preferences> | null;
}

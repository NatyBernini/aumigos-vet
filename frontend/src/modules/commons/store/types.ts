import { UserDataResponse } from '@/modules/commons/services/auth';

export interface AppState {
  loading: boolean;
  isAuthorized: boolean;
  userData: UserDataResponse | null;
}
export interface AppActions {
  login(): Promise<void>;
  logout(): Promise<void>;
}

export interface PersistentState {
  jwtToken: string | null;
  darkTheme: boolean;
}

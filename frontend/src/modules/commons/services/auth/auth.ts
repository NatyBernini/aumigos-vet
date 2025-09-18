import { httpClient } from '@/modules/commons/services';
import { TokenRequestParams, TokenResponse, UserDataResponse } from './types';

export function getTokenRequest(params: TokenRequestParams): Promise<TokenResponse> {
  return httpClient.get('/auth-backend/token', params);
}

export function getUserDataRequest(): Promise<UserDataResponse> {
  return httpClient.get('/auth-backend/token/user');
}

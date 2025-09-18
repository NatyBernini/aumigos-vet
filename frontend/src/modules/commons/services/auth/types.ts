export interface TokenRequestParams {
  code: string;
}
export interface TokenResponse {
  access_token: string;
  expires_in: string;
  id_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserDataUnidadeResponse {
  id: number;
  nome: string;
  codigo: string;
}
export interface UserDataResponse {
  nome: string;
  email: string;
  login: string;
  unidade: UserDataUnidadeResponse;
  roles: string[];
  temMultiplasUnidades: boolean;
}

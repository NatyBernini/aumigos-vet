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

export interface DataPeople {
  id: number;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
}

export interface UserPlano {
  id: number;
  nome: string;
  preco_mensal: string;
  preco_anual: string;
  usuarios_simultaneos: string;
}

export interface UserDataClinica {
  id: number;
  nome: string;
  cnpj: string;
  plano: UserPlano;
  criado_em: string;
  modificado_em: string;
}
export interface UserDataResponse {
  email: string;
  pessoa: DataPeople;
  roles: string[];
  tipo_usuario: string;
  clinicas: UserDataClinica[]
}

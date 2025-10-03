// src/modules/commons/services/auth.ts
import { API } from "@/modules/commons/services";

export interface Pessoa {
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
}

export interface Telefone {
  numero: string;
}

export interface Contato {
  email: string;
  telefones: Telefone[];
}

export interface RegistroUsuarioPayload {
  email: string;
  senha: string;
  tipo_usuario: string;
  pessoa: Pessoa;
  contato: Contato;
  first_name: string;
  last_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RedefinirSenha {
  senha_atual: string;
  nova_senha: string;
}

async function registerUser(payload: RegistroUsuarioPayload) {
  try {
    const response = await API.post("/usuarios/registro/", payload);
    return response;
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
}

async function loginUser(payload: LoginPayload) {
  try {
    const response = await API.post("/usuarios/login/", payload);
    return response;
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}

async function getMe() {
  try {
    const response = await API.get("/usuarios/me/");
    return response;
  } catch (error: any) {
    console.error('Erro ao buscar dados do usuário logado:', error);
    throw error;
  }
}

async function redefinirSenha(params: RedefinirSenha) {
  return await API.put("/usuarios/redefinir-senha/", params)
}

export {
  loginUser,
  getMe,
  registerUser,
  redefinirSenha
}
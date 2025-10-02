// src/modules/commons/services/auth.ts
import { API } from "@/modules/commons/services";

export interface Clinica {
    nome: string;
    telefone: string;
    whatsapp: string;
    email: string;
    cnpj: string;
    tipo_assinatura: string;
    estado?: string;
    cidade?: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento: string;
    cep: string
}

export interface Pessoa {
    nome_completo: string;
    cpf: string;
    data_nascimento: string
}

export interface Contato {
    email: string
}

export interface UserClinica {
    email: string;
    senha: string;
    tipo_usuario: string;
    pessoa: Pessoa;
    contato: Contato;
    first_name: string;
    last_name: string
}

async function salvarClinica(payload: Clinica) {
    return API.post("/usuarios/clinicas/", payload);
}

async function usuariosClinica() {
    return await API.get('/usuarios/clinica/usuarios/')
}

async function cadastrarUsuarioClinica(payload: UserClinica) {
    return API.post("/usuarios/clinica/cadastrar-usuario/", payload);
}

export {
    salvarClinica,
    usuariosClinica,
    cadastrarUsuarioClinica
}
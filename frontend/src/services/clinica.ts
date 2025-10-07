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
    email?: string;
    senha?: string;
    tipo_usuario?: string;
    pessoa: Pessoa;
    contato: Contato;
    first_name: string;
    last_name: string
}

export interface Password {
    nova_senha: string
}

async function salvarClinica(payload: Clinica) {
    return await API.post("/usuarios/clinica/", payload);
}

async function usuariosClinica() {
    return await API.get('/usuarios/clinica/usuarios/')
}

async function cadastrarUsuarioClinica(payload: UserClinica) {
    return await API.post("/usuarios/clinica/usuario/", payload);
}

async function editarUsuarioClinica(idUser: number, params: UserClinica) {
    return await API.put(`/usuarios/clinica/usuario/${idUser}/`, params)
}

async function redefinirSenhaUsuarioClinica(idUser: string, params: Password) {
    return await API.post(`/usuarios/clinica/usuario/${idUser}/redefinir-senha/`, params)
}

async function deletarUsuarioClinica(clinica_id: number, usuario_id: number) {
    return await API.del(`/usuarios/clinicas/${clinica_id}/usuario/${usuario_id}/`)
}
export {
    salvarClinica,
    usuariosClinica,
    cadastrarUsuarioClinica,
    editarUsuarioClinica,
    redefinirSenhaUsuarioClinica, 
    deletarUsuarioClinica
}
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

async function salvarClinica(payload: Clinica) {
    return API.post("/usuarios/clinicas/", payload);
}

export {
    salvarClinica
}
import { API } from "@/modules/commons/services";

export interface Contato {
    email: string
    telefones: { numero: string }[]
}

export interface Enderecos {
    cep: string
    estado: string
    cidade: string
    bairro: string
    rua: string
    numero: string
    complemento: string
}

export interface Pessoa {
    nome_completo: string
    cpf: string
    rg?: string
    data_nascimento?: string
    enderecos: Enderecos[]
    contatos: Contato[]
}


export interface Tutor extends Pessoa {
    observacoes: string;
    ativo: boolean
}

async function salvarTutor(payload: Tutor) {
    return await API.post("/pacientes/tutores/", payload);
}

async function editarTutor(id: number, payload: Tutor) {
    return await API.put(`/pacientes/tutores/${id}/`, payload);
}

async function deletarTutor(id: number) {
    return await API.del(`/pacientes/tutores/${id}/`);
}

async function recuperarTutores() {
    return await API.get("/pacientes/tutores/");
}

async function recuperarTutor(id: number) {
    return await API.get(`/pacientes/tutores/${id}`);
}

export {
    salvarTutor,
    editarTutor,
    deletarTutor,
    recuperarTutor,
    recuperarTutores
}
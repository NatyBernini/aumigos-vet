import { API } from "@/modules/commons/services";

export interface Paciente {
    nome: string;
    tipo: string;
    especie: string;
    data_nascimento: string;
    peso?: number;
    raca: string;
    pelagem: string;
    porte: string;
    sexo: string;
    castrado: boolean;
    data_castracao: string;
    observacao: string;
    tutor_id: number;
    clinica: number
}

export interface Protocolo {
    nome: string;
    data_aplicacao: string;
    data_proxima_dose: string;
    fabricante: string;
    lote: string;
    observacao: string;
    dosagem?: string
}

async function salvarPaciente(payload: Paciente) {
    return await API.post("/pacientes/animais/", payload);
}

async function editarPaciente(id: number, payload: Paciente) {
    return await API.put(`/pacientes/animais/${id}/`, payload);
}

async function deletarPaciente(id: number) {
    return await API.del(`/pacientes/animais/${id}/`);
}

async function recuperarPacientes() {
    return await API.get("/pacientes/animais/");
}

async function recuperarPaciente(id: number) {
    return await API.get(`/pacientes/animais/${id}`);
}

async function salvarVacinas(id?: number, payload?: Protocolo) {
    return await API.post(`/pacientes/animais/${id}/vacinas/`, payload);
}

async function editarVacinas(id?: number, payload?: Protocolo) {
    return await API.put(`/pacientes/vacinas/${id}/`, payload);
}

async function deletarVacinas(id: number) {
    return await API.del(`/pacientes/vacinas/${id}/`);
}

async function recuperarVacinas(id: number) {
    return await API.get(`/pacientes/animais/${id}/vacinas/`);
}

async function recuperarVacina(id: number) {
    return await API.get(`/pacientes/vacinas/${id}/`);
}

async function salvarVermifugos(id?: number, payload?: Protocolo) {
    return await API.post(`/pacientes/animais/${id}/vermifugos/`, payload);
}

async function recuperarVermifugos(id: number) {
    return await API.get(`/pacientes/animais/${id}/vermifugos/`);
}

async function recuperarVermifugo(id: number) {
    return await API.get(`/pacientes/vermifugos/${id}/`);
}

async function editarVermifugos(id?: number, payload?: Protocolo) {
    return await API.put(`/pacientes/vermifugos/${id}/`, payload);
}

async function deletarVermifugo(id: number) {
    return await API.del(`/pacientes/vermifugos/${id}/`);
}

export {
    salvarPaciente,
    editarPaciente,
    deletarPaciente,
    recuperarPacientes,
    recuperarPaciente,
    salvarVacinas,
    editarVacinas,
    deletarVacinas,
    recuperarVacinas,
    recuperarVacina,
    salvarVermifugos,
    editarVermifugos,
    deletarVermifugo,
    recuperarVermifugos,
    recuperarVermifugo
}
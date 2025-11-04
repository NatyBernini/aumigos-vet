import { API } from "@/modules/commons/services";
import { Pessoa } from "./tutor";

export interface Veterinario extends Pessoa{
    crmv: string
    especialidade: string
    horario_inicio?: string
    horario_fim?: string  
    dias_atendimento: {
    [dia: string]: {
      inicio: string
      fim: string
    }
  }
    observacao: string
    ativo: boolean
}

async function salvarVeterinario(payload: Veterinario) {
    return await API.post("/funcionarios/veterinarios/", payload);
}

async function recuperarVeterinarios() {
    return await API.get("/funcionarios/veterinarios/")
}

async function recuperarVeterinario(id: number) {
    return await API.get(`/funcionarios/veterinarios/${id}/`)
}

async function editarVeterinario(id: number, payload: Veterinario) {
    return await API.put(`/funcionarios/veterinarios/${id}`, payload);
}

async function deletarVeterinario(id: number) {
    return await API.del(`/funcionarios/veterinarios/${id}/`)
}
export {
    salvarVeterinario,
    recuperarVeterinario,
    recuperarVeterinarios,
    editarVeterinario,
    deletarVeterinario
}
import { API } from "@/modules/commons/services";

export interface Consulta {
  animal_id: number;
  clinica?: number;
  veterinario_id: number;
  queixa_principal?: string;
  suspeita_clinica?: string;
  exames_realizados?: string;
  tratamento_estabelecido?: string;
  prognostico?: string;
  destinacao?: string;
  retorno?: boolean;
  data_retorno?: string;
  motivo_retorno?: string;
  data_consulta: string;
  hora_consulta: string
}

export interface Anamnese {
  digestorio?: string;
  neurologico?: string;
  motor?: string;
  pele?: string;
  urogenital?: string;
  cardiorrespiratorio?: string;
  ambiente?: string;
  ouvido?: string;
  olhos?: string
}

export interface HistoricoClinico {
  usa_medicacao_continua?: boolean,
  medicacao_quais?: string,
  alergia_medicamento?: boolean,
  alergia_quais?: string,
  realizou_cirurgia?: boolean,
  cirurgia_quais?: string,
  usa_suplementacao?: boolean,
  suplementacao_quais?: string,
  fez_exame_recente?: boolean,
  exame_quais?: string,
  alimentacao?: string,
  urina?: string,
  fezes?: string,
  vomito?: string,
  frequencia_cardiaca?: string,
  frequencia_respiratoria?: string,
  temperatura?: string,
  linfonodos?: string,
  outros?: string
}

export interface Produtos {
  produto: number;
  quantidade: string;
  valor_unitario: string
}

export interface Documento {
  titulo: string;
  descricao: string;
  conteudo: string
}

async function salvarConsulta(payload: Consulta) {
    return await API.post("/consultas/consultas/", payload);
}

async function editarConsulta(id: number, payload: Consulta) {
    return await API.patch(`/consultas/consultas/${id}/`, payload);
}

async function deletarConsulta(id: number) {
    return await API.del(`/consultas/consultas/${id}/`);
}

async function recuperarConsultas() {
    return await API.get("/consultas/consultas/");
}

async function recuperarConsulta(id: any) {
    return await API.get(`/consultas/consultas/${id}/`);
}

async function editarAnamnese(id:number, payload: Anamnese) {
    return await API.put(`/consultas/consultas/${id}/anamnese/`, payload);
}

async function recuperarAnamnese(id: any) {
    return await API.get(`/consultas/consultas/${id}/anamnese/`);
}

async function editarHistoricoClinico(id:number, payload: HistoricoClinico) {
    return await API.put(`/consultas/consultas/${id}/historico/`, payload);
}

async function recuperarHistoricoClinicoo(id: any) {
    return await API.get(`/consultas/consultas/${id}/historico/`);
}

async function salvarProdutos(id: any, payload: Produtos) {
    return await API.post(`/consultas/consultas/${id}/produtos/`, payload);
}

async function recuperarProdutos(id: any) {
    return await API.get(`/consultas/consultas/${id}/produtos/`);
}

async function salvarDocumentos(id: any, payload: Documento) {
    return await API.post(`/consultas/consultas/${id}/documentos/`, payload);
}

async function recuperarDocumentos(id: any) {
    return await API.get(`/consultas/consultas/${id}/documentos/`);
}
export {
    salvarConsulta,
    editarConsulta,
    deletarConsulta,
    recuperarConsultas,
    recuperarConsulta,
    editarAnamnese,
    recuperarAnamnese,
    editarHistoricoClinico,
    recuperarHistoricoClinicoo,
    salvarProdutos,
    recuperarProdutos,
    salvarDocumentos,
    recuperarDocumentos
}
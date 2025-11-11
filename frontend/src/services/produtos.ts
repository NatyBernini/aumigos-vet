import { API } from "@/modules/commons/services";

export interface Produto {
    nome: string;
    categoria: string;
    unidade_medida: string;
    observacao: string;
    ativo: boolean;
    valor: string
}

async function salvarProduto(payload: Produto) {
    return await API.post("/produtos/produtos/", payload);
}

async function recuperarProduto() {
    return await API.get("/produtos/produtos/");
}

async function recuperarProdutoPorId(id: any) {
    return await API.get(`/produtos/produtos/${id}`);
}

async function editarProduto(id: any, payload: Produto) {
    return await API.put(`/produtos/produtos/${id}`, payload);
}

async function deletarProduto(id: any) {
    return await API.del(`/produtos/produtos/${id}/`)
}
export {
    salvarProduto,
    recuperarProduto,
    recuperarProdutoPorId,
    deletarProduto,
    editarProduto
}
// src/services/ibge.ts
export async function getEstados() {
  const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
  if (!res.ok) throw new Error('Erro ao buscar estados');
  return await res.json();
}

export async function getCidadesPorEstado(ufCodigoOuSigla: string) {
  const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufCodigoOuSigla}/municipios`);
  if (!res.ok) throw new Error('Erro ao buscar cidades');
  return await res.json();
}

export async function getEnderecoPorCep(cep: string) {
  // Limpa o CEP (remove tudo que não é número)
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) {
    throw new Error('CEP inválido');
  }

  const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  if (!res.ok) throw new Error('Erro ao buscar endereço pelo CEP');

  const data = await res.json();

  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  return data; // Objeto com logradouro, bairro, localidade, uf etc.
}
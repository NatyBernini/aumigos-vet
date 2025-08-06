// src/utils/cepUtils.ts

// Função para formatar o CEP como 00000-000
export function formatCep(value: string): string {
  let v = value.replace(/\D/g, '').slice(0, 8)
  if (v.length > 5) {
    v = v.replace(/^(\d{5})(\d{0,3})/, '$1-$2')
  }
  return v
}

// Função para limpar o CEP (remover tudo que não é número)
export function limparCep(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8)
}

// Função para buscar endereço no ViaCEP
export async function buscarEnderecoViaCep(cep: string) {
  const cepLimpo = limparCep(cep)
  const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)

  if (!res.ok) {
    throw new Error('Erro ao buscar endereço')
  }

  const data = await res.json()
  if (data.erro) {
    throw new Error('CEP não encontrado')
  }

  return data // retorna o objeto com logradouro, bairro, localidade, etc.
}

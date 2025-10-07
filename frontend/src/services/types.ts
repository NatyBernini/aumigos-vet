export interface Clinica {
  id: number
  nome: string
  cnpj: string
}

export interface Contato {
  id: number
  email: string
  telefones: { id: number; numero: string }[]
}

export interface Pessoa {
  id: number
  nome_completo: string
  cpf: string
  data_nascimento: string
  enderecos: any[]
  contato: Contato
}

export interface Usuario {
  id: number
  email: string
  tipo_usuario: string
  foto_perfil: string
  pessoa: Pessoa
  clinicas: Clinica[]
}

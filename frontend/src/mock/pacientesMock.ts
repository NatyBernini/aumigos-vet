export interface Paciente {
  /* ---- lista / identificação ---- */
  id: number
  nome: string
  inicioTratamento: string         // ISO ou dd/MM/yyyy
  tutor: string                    // nome curto p/ exibir na tabela
  status: 'Concluído' | 'Em andamento' | 'Em espera' | 'Cancelado'

  /* ---- informações do paciente ---- */
  especie: 'especieCan' | 'especieFel' | 'especieOutra'
  outraEspecie?: string | null

  idade: number
  peso: number                     // kg
  raca: string
  pelagem: string
  porte: 'porteP' | 'porteM' | 'porteG'

  sexo: 'sexoM' | 'sexoF'

  castrado: 'castradoS' | 'castradoN'
  dataCastrado?: string | null     // ISO

  vermifugado: 'vermifugadoS' | 'vermifugadoN'
  dataVermifugado?: string | null

  vacina: 'vacinadoS' | 'vacinadoN'
  quaisVacinas?: string | null

  observacoes?: string | null

  /* ---- dados completos do tutor ---- */
  tutorRg: string
  tutorCpf: string
  tutorEmail: string
  tutorPhones: string[]            
  estado?: string
  cidade?: string
  bairro?: string
  rua?: string
  numero?: string
  complemento?: string
}



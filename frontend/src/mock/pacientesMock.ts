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

export const pacientesMock: Paciente[] = [
  {
    id: 1,
    nome: 'Juju',
    inicioTratamento: '2025-03-15',
    tutor: 'Natália Bernini',
    status: 'Concluído',

    especie: 'especieCan',
    outraEspecie: null,

    idade: 5,
    peso: 12.4,
    raca: 'Golden Retriever',
    pelagem: 'Dourada',
    porte: 'porteG',

    sexo: 'sexoF',

    castrado: 'castradoS',
    dataCastrado: '2022-08-10',

    vermifugado: 'vermifugadoS',
    dataVermifugado: '2025-02-01',

    vacina: 'vacinadoS',
    quaisVacinas: 'V8, Antirrábica',

    observacoes: 'Paciente saudável após tratamento.',

    tutorRg: '12.345.678-9',
    tutorCpf: '123.456.789-00',
    tutorEmail: 'natalia@exemplo.com',
    tutorPhones: ['(11) 99876‑5432'],
    estado: 'MG',
    cidade: 'Barbacena',
    bairro: 'Campo',
    rua: 'Rua Professor Osvaldo Navarro',
    numero: '22',
    complemento: 'Casa'
  },

  {
    id: 2,
    nome: 'Mel',
    inicioTratamento: '2025-07-03',
    tutor: 'Maria Malta',
    status: 'Em andamento',

    especie: 'especieFel',
    outraEspecie: null,

    idade: 3,
    peso: 4.2,
    raca: 'Siamês',
    pelagem: 'Seal point',
    porte: 'porteP',

    sexo: 'sexoF',

    castrado: 'castradoN',
    dataCastrado: null,

    vermifugado: 'vermifugadoS',
    dataVermifugado: '2025-06-25',

    vacina: 'vacinadoS',
    quaisVacinas: 'Tríplice felina',

    observacoes: null,

    tutorRg: '34.567.890-1',
    tutorCpf: '987.654.321-00',
    tutorEmail: 'maria@exemplo.com',
    tutorPhones: ['(11) 91234‑5678', '(11) 3344‑5566'],
    estado: 'MG',
    cidade: 'Barbacena',
    bairro: 'Campo',
    rua: 'Rua Professor Osvaldo Navarro',
    numero: '22',
    complemento: 'Casa'
  },

  {
    id: 3,
    nome: 'Luck',
    inicioTratamento: '2025-01-01',
    tutor: 'Rodrigo Souza',
    status: 'Em espera',

    especie: 'especieCan',
    outraEspecie: null,

    idade: 2,
    peso: 8.1,
    raca: 'Beagle',
    pelagem: 'Tri‑color',
    porte: 'porteM',

    sexo: 'sexoM',

    castrado: 'castradoS',
    dataCastrado: '2024-12-15',

    vermifugado: 'vermifugadoN',
    dataVermifugado: null,

    vacina: 'vacinadoN',
    quaisVacinas: null,

    observacoes: 'Aguardando espaço para iniciar fisioterapia.',

    tutorRg: '56.789.012-3',
    tutorCpf: '456.789.123-00',
    tutorEmail: 'rodrigo@exemplo.com',
    tutorPhones: ['(21) 99888‑7766'],
    estado: 'MG',
    cidade: 'Barbacena',
    bairro: 'Campo',
    rua: 'Rua Professor Osvaldo Navarro',
    numero: '22',
    complemento: 'Casa'
  },

  {
    id: 4,
    nome: 'Remi',
    inicioTratamento: '2025-02-02',
    tutor: 'Rodrigo Souza',
    status: 'Concluído',

    especie: 'especieOutra',
    outraEspecie: 'Coelho',

    idade: 1,
    peso: 1.8,
    raca: 'Lionhead',
    pelagem: 'Branca',
    porte: 'porteP',

    sexo: 'sexoM',

    castrado: 'castradoN',
    dataCastrado: null,

    vermifugado: 'vermifugadoN',
    dataVermifugado: null,

    vacina: 'vacinadoN',
    quaisVacinas: null,

    observacoes: 'Finalizado o tratamento dentário.',

    tutorRg: '56.789.012-3',
    tutorCpf: '456.789.123-00',
    tutorEmail: 'rodrigo@exemplo.com',
    tutorPhones: ['(21) 99888‑7766'],
    estado: 'MG',
    cidade: 'Barbacena',
    bairro: 'Campo',
    rua: 'Rua Professor Osvaldo Navarro',
    numero: '22',
    complemento: 'Casa'
  },

  {
    id: 5,
    nome: 'Lua',
    inicioTratamento: '2025-03-03',
    tutor: 'Camila Reis',
    status: 'Cancelado',

    especie: 'especieCan',
    outraEspecie: null,

    idade: 6,
    peso: 18.7,
    raca: 'Labrador',
    pelagem: 'Chocolate',
    porte: 'porteG',

    sexo: 'sexoF',

    castrado: 'castradoS',
    dataCastrado: '2021-05-12',

    vermifugado: 'vermifugadoS',
    dataVermifugado: '2025-01-15',

    vacina: 'vacinadoN',
    quaisVacinas: null,

    observacoes: 'Tutor pediu cancelamento por mudança de cidade.',

    tutorRg: '78.901.234-5',
    tutorCpf: '789.012.345-00',
    tutorEmail: 'camila@exemplo.com',
    tutorPhones: ['(31) 91234‑0000'],
    estado: 'MG',
    cidade: 'Barbacena',
    bairro: 'Campo',
    rua: 'Rua Professor Osvaldo Navarro',
    numero: '22',
    complemento: 'Casa'
  },
]


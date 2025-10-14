<template>
  <v-container class="pa-0">
    <p class="title-page">Agenda
      <img src="/./src/assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
    </p>

    <p class="sub-page">Serviços / <span class="aba-atual">Caixa</span>
      <img src="/./src/assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
    </p>
    <v-btn color="accent" @click.stop="showScheduleForm = true" large class="btn-padrao">
      Agendar Consulta
      <v-icon class="icon-close ml-3">mdi-format-align-left</v-icon>
    </v-btn>
    <div class="container-header-agenda" align="center">
      <h2 class="text-h5 font-weight-bold">{{ dataFormatada }}</h2>
      <div class="container-header-agenda">
        <v-btn class="btn-padrao" icon @click="voltar">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <v-btn class="btn-padrao" icon @click="avancar">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>


        <combo v-model="modo" :items="modosAgenda" :extra-items="modosAgenda" label="Modo*" variant="outlined" id="modo"
          :isRequired="false" :isMultipleSelect="false" class="container-combobox-padrao mt-4 mb-4"
          placeholder="modo" />

      </div>


    </div>

    <!-- Visão Diário -->
    <v-sheet class="pa-4 agenda-sheet" v-if="modo === 'diario'">
      <v-row dense>
        <v-col v-for="hora in horarios" :key="hora" class="py-1" cols="12">
          <div class="hora-linha diaria">
            <div class="hora">{{ hora }}</div>
            <div class="consultas">
              <div v-for="consulta in consultasPorHora(hora)" :key="consulta.id" class="consulta">
                <p class="mb-1"><strong>{{ consulta.paciente }}</strong></p>
                <small>Veterinário: {{ consulta.veterinario }}</small><br />
                <small>Horário: {{ consulta.horario }}</small> <br>
                <v-btn text=" Realizar consulta" class="btn-padrao"
                  :to="{ name: 'Consultar', params: { id: consulta.id } }" variant="text">
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <!-- Visão Semanal -->
    <v-sheet class="pa-4 agenda-sheet" v-else-if="modo === 'semanal'">
      <div class="agenda-semanal-grid">
        <!-- Coluna de horários -->
        <div class="hora-coluna">
          <div class="hora-cabecalho"></div> <!-- Cabeçalho vazio -->
          <div v-for="hora in horarios" :key="hora" class="hora-linha">
            {{ hora }}
          </div>
        </div>

        <!-- Colunas dos dias -->
        <div v-for="dia in diasDaSemana" :key="dia.toDateString()" class="dia-coluna">
          <div class="dia-cabecalho">
            {{ dia.getDate() }}<br>
            <small>{{ diasSemana[dia.getDay()] }}</small>
          </div>
          <div v-for="hora in horarios" :key="hora" class="hora-linha">
            <div v-for="c in consultasPorDataHora(dia, hora)" :key="c.id" class="consulta" @click="abrirDia(c.dia)">
              🐾 <strong>{{ c.paciente }}</strong>
            </div>
          </div>
        </div>
      </div>
    </v-sheet>

    <!-- Visão Mensal -->
    <v-sheet v-else class="pa-4 agenda-sheet">
      <div class="agenda-mensal-grid">
        <!-- Cabeçalho dias da semana -->
        <div class="dia-semana-cabecalho" v-for="(ds, i) in diasSemana" :key="i">
          {{ ds }}
        </div>

        <!-- Dias -->
        <template v-for="semana in calendarioMes" :key="semana.join('-')">
          <div v-for="(dia, index) in semana" :key="dia ?? `vazio-${index}`" class="dia-card-container">
            <v-card v-if="dia" class="dia-card" outlined @click="abrirDia(dia)">
              <v-card-title class="dia-titulo">{{ dia }}</v-card-title>
              <v-card-text>
                <div v-if="consultasPorDia(dia).length > 0">
                  <ul class="lista-consultas">
                    <li v-for="c in consultasPorDia(dia)" :key="c.id">
                      🐾 <strong>{{ c.paciente }}</strong> - {{ c.horario }}
                    </li>
                  </ul>
                </div>
                <div v-else>
                  <em class="sem-consulta">Sem consultas</em>
                </div>
              </v-card-text>
            </v-card>
            <div v-else class="dia-vazio"></div>
          </div>
        </template>

      </div>
    </v-sheet>

  </v-container>
  <ModalAgendar :isOpen="showScheduleForm" 
        @update:isOpen="showScheduleForm = $event" />
</template>


<script setup lang="ts">
import { computed, ref } from 'vue'

// COMPONENTES
import combo from '@/components/select.vue'
import ModalAgendar from './ModalAgendar.vue'

interface Consulta {
  id: number
  paciente: string
  veterinario: string
  horario: string
  dia: number      // dia do mês
  mes: number      // 0-11
  ano: number
}

const dataAtual = ref(new Date())

const diaAtual = computed(() => dataAtual.value.getDate())
const mesAtual = computed(() => dataAtual.value.getMonth())
const anoAtual = computed(() => dataAtual.value.getFullYear())
const showScheduleForm = ref(false)

const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const modosAgenda = ['diario', 'semanal', 'mensal'];


const modo = ref<'diario' | 'semanal' | 'mensal'>('diario')

const dataFormatada = computed(() => {
  if (modo.value === 'diario') {
    const diaSemana = diasSemana[dataAtual.value.getDay()]
    return `${diaAtual.value.toString().padStart(2, '0')} de ${meses[mesAtual.value]} de ${anoAtual.value} (${diaSemana})`
  } else if (modo.value === 'semanal') {
    const inicioSemana = getInicioSemana(dataAtual.value)
    const fimSemana = new Date(inicioSemana)
    fimSemana.setDate(inicioSemana.getDate() + 6)

    // Se os dois dias estiverem no mesmo mês
    if (inicioSemana.getMonth() === fimSemana.getMonth()) {
      return `Dia ${inicioSemana.getDate().toString().padStart(2, '0')} ao Dia ${fimSemana.getDate().toString().padStart(2, '0')} de ${meses[inicioSemana.getMonth()]} de ${inicioSemana.getFullYear()}`
    } else {
      // Se os dias forem de meses diferentes
      return `Dia ${inicioSemana.getDate().toString().padStart(2, '0')} de ${meses[inicioSemana.getMonth()]} ao Dia ${fimSemana.getDate().toString().padStart(2, '0')} de ${meses[fimSemana.getMonth()]} de ${fimSemana.getFullYear()}`
    }
  } else {
    return `${meses[mesAtual.value]} de ${anoAtual.value}`
  }
})


// Função para pegar o domingo da semana da data atual
function getInicioSemana(data: Date) {
  const inicio = new Date(data)
  inicio.setDate(data.getDate() - data.getDay()) // domingo
  return inicio
}

function getCalendarioMes(mes: number, ano: number): (number | null)[][] {
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  const semanas: (number | null)[][] = [];
  let semanaAtual: (number | null)[] = Array(primeiroDia.getDay()).fill(null); // preenche os dias anteriores com null

  for (let dia = 1; dia <= ultimoDia; dia++) {
    semanaAtual.push(dia);
    if (semanaAtual.length === 7) {
      semanas.push(semanaAtual);
      semanaAtual = [];
    }
  }

  // preencher o final da última semana com null
  while (semanaAtual.length < 7) semanaAtual.push(null);
  if (semanaAtual.some(d => d !== null)) semanas.push(semanaAtual);

  return semanas;
}


const calendarioMes = computed(() => getCalendarioMes(mesAtual.value, anoAtual.value));


// Para exibir dias da semana
const diasDaSemana = computed(() => {
  const inicio = getInicioSemana(dataAtual.value)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio)
    d.setDate(inicio.getDate() + i)
    return d
  })
})

// Navegação para semanal
function voltar() {
  const novaData = new Date(dataAtual.value)
  if (modo.value === 'diario') {
    novaData.setDate(novaData.getDate() - 1)
  } else if (modo.value === 'semanal') {
    novaData.setDate(novaData.getDate() - 7)
  } else {
    novaData.setMonth(novaData.getMonth() - 1)
  }
  dataAtual.value = novaData
}

function avancar() {
  const novaData = new Date(dataAtual.value)
  if (modo.value === 'diario') {
    novaData.setDate(novaData.getDate() + 1)
  } else if (modo.value === 'semanal') {
    novaData.setDate(novaData.getDate() + 7)
  } else {
    novaData.setMonth(novaData.getMonth() + 1)
  }
  dataAtual.value = novaData
}


const horarios = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00'
]

// TODO MOCK
const consultas = ref<Consulta[]>([
  { id: 1, paciente: 'Tobias', veterinario: 'Dr. João', horario: '09:00', dia: 5, mes: 7, ano: 2025 },
  { id: 2, paciente: 'Luna', veterinario: 'Dra. Ana', horario: '10:00', dia: 5, mes: 7, ano: 2025 },
  { id: 3, paciente: 'Max', veterinario: 'Dra. Ana', horario: '15:00', dia: 12, mes: 7, ano: 2025 },
  { id: 4, paciente: 'Mingau', veterinario: 'Dr. João', horario: '14:00', dia: 22, mes: 7, ano: 2025 },
  { id: 5, paciente: 'Pipoca', veterinario: 'Dra. Ana', horario: '13:00', dia: 5, mes: 7, ano: 2025 }
])

function consultasPorHora(hora: string) {
  return consultas.value.filter(c =>
    c.dia === diaAtual.value &&
    c.mes === mesAtual.value &&
    c.ano === anoAtual.value &&
    c.horario === hora
  )
}

function consultasPorDia(dia: number) {
  return consultas.value.filter(c =>
    c.dia === dia &&
    c.mes === mesAtual.value &&
    c.ano === anoAtual.value
  )
}

function consultasPorDataHora(dia: Date, hora: string) {
  return consultas.value.filter(c =>
    c.dia === dia.getDate() &&
    c.mes === dia.getMonth() &&
    c.ano === dia.getFullYear() &&
    c.horario === hora
  )
}


function abrirDia(dia: number) {
  dataAtual.value = new Date(anoAtual.value, mesAtual.value, dia);
  modo.value = 'diario';
}

function getDiasDoMes(mes: number, ano: number): number[] {
  const ultimoDia = new Date(ano, mes + 1, 0).getDate()
  return Array.from({ length: ultimoDia }, (_, i) => i + 1)
}

const diasDoMes = computed(() => getDiasDoMes(mesAtual.value, anoAtual.value))


</script>

<style lang="scss">
.agenda-sheet {
  background-color: #fdfdfd;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* Linha do horário */
.hora-linha {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 0;
}

.hora {
  width: 70px;
  font-weight: bold;
  color: #5e5e5e;
}

/* Consultas */
.consultas {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.consulta {
  background: #FFE6CC;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.consulta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Cards mensais */
.dia-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: default;
}

.dia-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
}

.dia-titulo {
  font-weight: bold;
  color: #FF6A00;
}

.lista-consultas li {
  margin-bottom: 4px;
}

.sem-consulta {
  color: #999;
  font-style: italic;
}

.agenda-semanal-grid {
  display: flex;
  gap: 4px;
  overflow-x: auto;
}

/* Coluna de horários */
.hora-coluna {
  display: flex;
  flex-direction: column;
  width: 70px;
  /* mesmo tamanho da coluna de horário diário */
  flex-shrink: 0;
}

.hora-cabecalho {
  height: 50px;
  /* altura do cabeçalho */
}

.hora-linha {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e0e0e0;
  font-weight: bold;

  &.diaria {
    height: auto !important;
  }
}

/* Colunas dos dias */
.dia-coluna {
  display: flex;
  flex-direction: column;
  flex: 1 1 calc(100% / 7 - 4px);
  min-width: 120px;
}

.dia-cabecalho {
  height: 50px;
  font-weight: bold;
  text-align: center;
  color: #FF6A00;
  border-bottom: 1px solid #e0e0e0;
}

.agenda-mensal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.dia-semana-cabecalho {
  font-weight: bold;
  text-align: center;
  color: #FF6A00;
}

.dia-card-container {
  min-height: 100px;
}

.dia-vazio {
  height: 100px;
  background-color: transparent;
}

.container-header-agenda {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}
</style>

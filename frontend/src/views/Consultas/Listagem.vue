<template>
  <v-container>
    <!-- Cabeçalho com título e controle -->
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="12" sm="6">
        <h2 class="text-h5">Agenda - {{ dataFormatada }}</h2>
      </v-col>
      <v-col cols="12" sm="6" class="d-flex justify-end align-center">
        <v-btn icon @click="voltar">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <v-btn icon @click="avancar">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>

        <v-btn class="ml-4" @click="modo = modo === 'diario' ? 'mensal' : 'diario'" color="primary" variant="outlined">
          Mudar para {{ modo === 'diario' ? 'Mensal' : 'Diário' }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Visão Diário -->
    <v-sheet class="pa-4 agenda-sheet" height="600" v-if="modo === 'diario'">
      <v-row dense>
        <v-col
          v-for="hora in horarios"
          :key="hora"
          class="py-2"
          cols="12"
        >
          <div class="hora-linha">
            <strong>{{ hora }}</strong>
            <div class="consultas">
              <div
                v-for="consulta in consultasPorHora(hora)"
                :key="consulta.id"
                class="consulta"
              >
                <p class="mb-1"><strong>{{ consulta.paciente }}</strong></p>
                <small>Veterinário: {{ consulta.veterinario }}</small><br />
                <small>Horário: {{ consulta.horario }}</small>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Visão Mensal -->
    <v-sheet v-else class="pa-4 agenda-sheet">
      <v-row dense>
        <v-col
          v-for="dia in diasDoMes"
          :key="dia"
          cols="3"
          class="mb-4"
        >
          <v-card>
            <v-card-title>{{ dia }}/{{ mesAtual + 1 }}</v-card-title>
            <v-card-text>
              <div v-if="consultasPorDia(dia).length > 0">
                <ul>
                  <li v-for="c in consultasPorDia(dia)" :key="c.id">
                    🐾 {{ c.paciente }} - {{ c.horario }}
                  </li>
                </ul>
              </div>
              <div v-else>
                <em>Sem consultas</em>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Consulta {
  id: number
  paciente: string
  veterinario: string
  horario: string
  dia: number      // dia do mês
  mes: number      // 0-11
  ano: number
}

const modo = ref<'diario' | 'mensal'>('diario')
const dataAtual = ref(new Date())

const diaAtual = computed(() => dataAtual.value.getDate())
const mesAtual = computed(() => dataAtual.value.getMonth())
const anoAtual = computed(() => dataAtual.value.getFullYear())

const dataFormatada = computed(() =>
  dataAtual.value.toLocaleDateString('pt-BR', {
    weekday: modo.value === 'diario' ? 'long' : undefined,
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
)

const horarios = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00'
]

// MOCK
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

function getDiasDoMes(mes: number, ano: number): number[] {
  const ultimoDia = new Date(ano, mes + 1, 0).getDate()
  return Array.from({ length: ultimoDia }, (_, i) => i + 1)
}

const diasDoMes = computed(() => getDiasDoMes(mesAtual.value, anoAtual.value))

// NAVEGAÇÃO
function voltar() {
  const novaData = new Date(dataAtual.value)
  if (modo.value === 'diario') {
    novaData.setDate(novaData.getDate() - 1)
  } else {
    novaData.setMonth(novaData.getMonth() - 1)
  }
  dataAtual.value = novaData
}

function avancar() {
  const novaData = new Date(dataAtual.value)
  if (modo.value === 'diario') {
    novaData.setDate(novaData.getDate() + 1)
  } else {
    novaData.setMonth(novaData.getMonth() + 1)
  }
  dataAtual.value = novaData
}
</script>

<style scoped>
.agenda-sheet {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  overflow-y: auto;
}

.hora-linha {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.consultas {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.consulta {
  background-color: #e3f2fd;
  padding: 8px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
</style>

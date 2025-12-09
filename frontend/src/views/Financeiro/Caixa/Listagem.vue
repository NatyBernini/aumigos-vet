<template>
  <v-row>
    <v-col>
      <span class="title-page">Consultas e Serviços</span>
      <br />
      <span class="breadcrumb">
        Caixa / <span class="page-active">Consultas e Serviços</span>
      </span>

      <v-data-table v-if="!isLoading" :headers="headers" :items="paginatedConsultas" :items-per-page="-1" class="pt-15">

        <!-- Colunas personalizadas -->
        <template #item.animal="{ item }">
          {{ item.animal }}
        </template>

        <template #item.dataHora="{ item }">
          {{ item.dataHora }}
        </template>

        <template #item.tutor="{ item }">
          {{ item.tutor }}
        </template>

        <template #item.veterinario="{ item }">
          {{ item.veterinario }}
        </template>

        <template #item.status="{ item }">
          <span class="status" :class="item.status.toLowerCase()">
            {{ item.status }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon @click="visualizar(item)" :to="{ name: 'Pagamento', params: { id: item.id } }" color="#434343" variant="text">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>

        <!-- Rodapé customizado -->
        <template #bottom>
          <div class="custom-footer">
            <span>
              {{ startIndex }} - {{ endIndex }} de {{ consultas.length }}
            </span>

            <div class="container-pagination">
              <v-btn class="btn-pagination" icon @click="prevPage" :disabled="page <= 1">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn class="btn-pagination" icon @click="nextPage" :disabled="page >= pageCount">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>

            <v-select v-model="itemsPerPage" :items="[5, 10, 20]" label="Itens por página" density="compact"
              hide-details variant="outlined" style="max-width: 90px" />
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
      <!-- Spinner -->
  <v-container v-if="isLoading" class="d-flex align-center justify-center">
    <v-progress-circular indeterminate color="#ff8200" size="40" width="5"></v-progress-circular>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { recuperarConsultas } from '@/services/consulta'
import { recuperarVeterinarios } from '@/services/veterinario'
import { recuperarPacientes } from '@/services/paciente'
import { formatarDataLocal } from '@/utils/formaUtils'

defineOptions({
  name: 'ConsultasList',
})

const headers = ref([
  { title: 'Animal', key: 'animal' },
  { title: 'Data e Hora', key: 'dataHora' },
  { title: 'Responsável', key: 'tutor' },
  { title: 'Veterinário', key: 'veterinario' },
  { title: 'Status', key: 'status' },
  { title: 'Ações', key: 'actions', sortable: false },
])

const consultas = ref<any[]>([])
const pacientes = ref<any[]>([])
const veterinarios = ref<any[]>([])
const isLoading = ref(false)

async function loadPacientes() {
  pacientes.value = await recuperarPacientes()
}

async function loadVeterinarios() {
  const list = await recuperarVeterinarios()
  veterinarios.value = list
}

async function loadConsultas() {
  consultas.value = await recuperarConsultas()
}

onMounted(async () => {
  isLoading.value = true
  await loadPacientes()
  await loadVeterinarios()
  await loadConsultas()
  isLoading.value = false
})

// Paginação
const page = ref(1)
const itemsPerPage = ref(5)
watch(itemsPerPage, () => page.value = 1)
const pageCount = computed(() => Math.ceil(consultas.value.length / itemsPerPage.value))
const startIndex = computed(() => consultas.value.length === 0 ? 0 : (page.value - 1) * itemsPerPage.value + 1)
const endIndex = computed(() => Math.min(page.value * itemsPerPage.value, consultas.value.length))

function nextPage() { if (page.value < pageCount.value) page.value++ }
function prevPage() { if (page.value > 1) page.value-- }

// Computed com dados combinados
const paginatedConsultas = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return consultas.value.slice(start, end).map(consulta => {
    const paciente = pacientes.value.find(p => p.id === consulta.animal.id)
    const tutor = paciente?.tutor?.nome_completo ?? '-'

    const veterinario = veterinarios.value.find(v => v.id === consulta.veterinario.id)?.nome_completo ?? '-'

    const dataHora = `${formatarDataLocal(consulta.data_consulta)} ${consulta.hora_consulta?.slice(0,5) ?? ''}`

    const status = consulta.retorno ? 'Retorno' : 'Concluído'

    return {
      id: consulta.id,
      animal: consulta.animal.nome,
      dataHora,
      tutor,
      veterinario,
      status
    }
  })
})

function visualizar(item: any) {
  console.log('Visualizar consulta:', item)
}
</script>


<style lang="scss">
.status {
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  max-width: 100px;
  &.Pago {
    color: rgb(10, 71, 2) !important;
    background-color: rgb(198, 230, 193) !important;
  }

  &.Em.aberto {
    color: rgb(71, 2, 2) !important;
    background-color: rgb(230, 193, 193) !important;
  }
}
</style>

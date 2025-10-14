<template>
  <v-alert v-if="showAlert" :type="alertType" class="mt-3" dismissible @click:close="showAlert = false">
    {{ alertMessage }}
  </v-alert>

  <v-row>
    <v-col>
      <span class="title-page">Pacientes</span><br />
      <span class="breadcrumb">
        Pacientes / <span class="page-active">Lista de Pacientes</span>
      </span>

      <v-data-table v-if="!isLoading" :headers="headers" :items="paginatedPacientes" :items-per-page="-1" class="pt-15">
        <!-- Colunas -->
        <template #item.nome="{ item }">{{ item.nome }}</template>
        <template #item.inicioTratamento="{ item }">{{ item.inicioTratamento }}</template>
        <template #item.tutor="{ item }">{{ item.tutor }}</template>
        <template #item.status="{ item }">{{ item.status }}</template>

        <!-- Botões de ação -->
        <template #item.actions="{ item }">
          <v-btn icon color="#434343" variant="text" @click="visualizar(item.id)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>

          <v-btn icon color="#434343" variant="text" @click="editar(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>

        <!-- Rodapé -->
        <template #bottom>
          <div class="custom-footer">
            <span>{{ startIndex }} - {{ endIndex }} de {{ pacientes.length }}</span>

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
    <v-progress-circular indeterminate color="primary" size="40" width="5" />
  </v-container>
</template>


<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { type Paciente } from '../../mock/pacientesMock'
import { recuperarPacientes } from '@/services/paciente'
import { useRouter } from 'vue-router'

// Estado reativo
const pacientes = ref<Paciente[]>([])

defineOptions({
  name: 'PacientesList',
})

const headers = ref([
  { title: 'Nome do Paciente', key: 'nome' },
  { title: 'Início do Tratamento', key: 'inicioTratamento' },
  { title: 'Tutor', key: 'tutor' },
  { title: 'Status', key: 'status' },
  { title: 'Ações', key: 'actions', sortable: false },
])

// Controle de alertas e mensagens
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error')

const isLoading = ref(false)

const page = ref(1)
const itemsPerPage = ref(5)


const router = useRouter()

// Quando itemsPerPage muda, resetar a página para 1
watch(itemsPerPage, () => {
  page.value = 1
})

const pageCount = computed(() =>
  Math.ceil(pacientes.value.length / itemsPerPage.value)
)

const startIndex = computed(() =>
  pacientes.value.length === 0 ? 0 : (page.value - 1) * itemsPerPage.value + 1
)

const endIndex = computed(() =>
  Math.min(page.value * itemsPerPage.value, pacientes.value.length)
)

const paginatedPacientes = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return pacientes.value.slice(start, end)
})

function nextPage() {
  if (page.value < pageCount.value) {
    page.value++
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--
  }
}

function visualizar(id: number) {
  router.push({ name: 'PacienteVisualizar', params: { id } })
}

function editar(item: any) {
  console.log('Editar:', item)
}

const loadPacientes = async () => {
  try {
    const response = await recuperarPacientes();
    // garante que veio um array
    pacientes.value = Array.isArray(response) ? response : []
  } catch (error: any) {
    if (error.tipo === 'VALIDATION' && error.errors) {
      const firstKey = Object.keys(error.errors)[0]
      alertMessage.value = error.errors[firstKey][0]
    } else if (error.tipo === 'ERROR') {
      alertMessage.value = error.msg
    } else {
      alertMessage.value = 'Ocorreu um erro inesperado carregar os pacientes.'
    }

    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  }
}

onMounted(async () => {
  isLoading.value = true;
  await loadPacientes()
  isLoading.value = false;
})
</script>

<style lang="scss">
.v-btn {
  transition: none !important;

  &:hover>.v-btn__overlay {
    opacity: transparent !important;
    background: transparent !important;
  }

  .v-icon:hover {
    color: #FF8A33 !important;
  }
}

.v-icon {
  color: #676767;
}
</style>

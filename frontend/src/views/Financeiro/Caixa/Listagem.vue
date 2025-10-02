<template>
  <v-row>
    <v-col>
      <span class="title-page">Consultas e Serviços</span>
      <br />
      <span class="breadcrumb">
        Caixa / <span class="page-active">Consultas e Serviços</span>
      </span>

      <v-data-table :headers="headers" :items="paginatedPacientes" :items-per-page="-1" class="pt-15">

        <!-- Colunas personalizadas -->
        <template #item.nome="{ item }">
          {{ item.nome }}
        </template>
        <template #item.inicioTratamento="{ item }">
          {{ item.inicioTratamento }}
        </template>
        <template #item.tutor="{ item }">
          {{ item.tutor }}
        </template>
        <template #item.veterinario="{ item }">
          {{ item.veterinario }}
        </template>
        <template #item.status="{ item }">
          <span class="status" :class="item.status">
            {{ item.status }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon @click="visualizar(item)" :to="{ name: 'Pagamento', params: { id: item.id } }" color="#434343"
            variant="text">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>

        <!-- Rodapé customizado -->
        <template #bottom>
          <div class="custom-footer">
            <!-- Contador -->
            <span>
              {{ startIndex }} - {{ endIndex }} de {{ pacientes.length }}
            </span>

            <!-- Navegação manual -->
            <div class="container-pagination">
              <v-btn class="btn-pagination" icon @click="prevPage" :disabled="page <= 1">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn class="btn-pagination" icon @click="nextPage" :disabled="page >= pageCount">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>

            <!-- Itens por página -->
            <v-select v-model="itemsPerPage" :items="[5, 10, 20]" label="Itens por página" density="compact"
              hide-details variant="outlined" style="max-width: 90px" />
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

defineOptions({
  name: 'VeterinariosList',
})

const headers = ref([
  { title: 'Nome do Paciente', key: 'nome' },
  { title: 'Data e Hora da Consulta', key: 'inicioTratamento' },
  { title: 'Responsável', key: 'tutor' },
  { title: 'Veterinário', key: 'veterinario' },
  { title: 'Status', key: 'status' },
  { title: 'Ações', key: 'actions', sortable: false },
])

const pacientes = ref([
  { id: 1, nome: 'Juju', inicioTratamento: '15/03/2025 13:30', tutor: 'Natália Bernini', veterinario: 'Maria', status: 'Pago' },
  { id: 2, nome: 'Mel', inicioTratamento: '03/07/2025 13:30', tutor: 'Maria Malta', veterinario: 'Grabriela', status: 'Em aberto' },
  { id: 3, nome: 'Luck', inicioTratamento: '01/01/2025 13:30', tutor: 'Rodrigo de Souza', veterinario: 'João', status: 'Pago' },
  { id: 4, nome: 'Remi', inicioTratamento: '02/02/2025 13:30', tutor: 'Rodrigo de Souza', veterinario: 'Bruna', status: 'Em aberto' },
  { id: 5, nome: 'Lua', inicioTratamento: '03/03/2025 13:30', tutor: 'Camila Reis', veterinario: 'Bruna', status: 'Em aberto' },
  { id: 6, nome: 'Toby', inicioTratamento: '04/04/2025 13:30', tutor: 'José Silva', veterinario: 'Maria', status: 'Pago' },
])

const page = ref(1)
const itemsPerPage = ref(5)

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

function visualizar(item: any) {
  console.log('Visualizar:', item)
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

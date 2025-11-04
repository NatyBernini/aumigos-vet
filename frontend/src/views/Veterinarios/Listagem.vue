<template>
  <v-alert v-if="showAlert" :type="alertType" class="mt-3" dismissible @click:close="showAlert = false">
    {{ alertMessage }}
  </v-alert>

  <v-row>
    <v-col>
      <span class="title-page">Veterinários</span>
      <br />
      <span class="breadcrumb">
        Veterinários / <span class="page-active">Lista de Veterinários</span>
      </span>

      <v-data-table v-if="!isLoading" :headers="headers" :items="paginatedVeterinarios" :items-per-page="-1" class="pt-15">

        <!-- Nome -->
        <template #item.nome_completo="{ item }">
          {{ item.nome_completo }}
        </template>

        <!-- Clínica -->
        <template #item.clinica="{ item }">
          {{ item.clinica || 'Não informado' }}
        </template>

        <!-- Especialidade -->
        <template #item.especialidade="{ item }">
          {{ item.especialidade }}
        </template>

        <!-- CRMV -->
        <template #item.crmv="{ item }">
          {{ item.crmv }}
        </template>
        <!-- Telefones -->
        <template #item.telefones="{ item }">
          <span v-if="item.contatos && item.contatos.length">
            {{ formatarTelefones(item.contatos) }}
          </span>
          <span v-else>-</span>
        </template>

        <!-- Status de Atendimento -->
        <template #item.dias_atendimento="{ item }">
          <v-chip :color="estaAtendendo(item) ? 'green' : 'red'" class="text-white" size="small">
            {{ estaAtendendo(item) ? 'Atendendo agora' : 'Fora do horário' }}
          </v-chip>
        </template>

        <!-- Ações -->
        <template #item.actions="{ item }">
          <v-btn icon @click="visualizar(item)" color="#434343" variant="text">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn icon @click="editar(item)" color="#434343" variant="text">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>

        <!-- Rodapé -->
        <template #bottom>
          <div v-if="veterinarios.length > 5" class="custom-footer">
            <span>
              {{ startIndex }} - {{ endIndex }} de {{ veterinarios.length }}
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
    <!-- Spinner de Carregamento -->
  <v-container v-if="isLoading" class="d-flex align-center justify-center">
    <v-progress-circular indeterminate color="#ff8200" size="40" width="5"></v-progress-circular>
  </v-container>
</template>

<script setup lang="ts">
import { recuperarVeterinarios } from '@/services/veterinario'
import { ref, computed, watch, onMounted } from 'vue'
import { formatPhoneNumber } from '@/utils/formaUtils'

defineOptions({
  name: 'VeterinariosList',
})

const headers = ref([
  { title: 'Nome do Veterinário', key: 'nome_completo' },
  { title: 'Clínica', key: 'clinica' },
  { title: 'Especialidade', key: 'especialidade' },
  { title: 'CRMV', key: 'crmv' },
  { title: 'Telefones', key: 'telefones' },
  { title: 'Status', key: 'dias_atendimento' },
  { title: 'Ações', key: 'actions', sortable: false },
])

const veterinarios = ref<any[]>([])

const page = ref(1)
const itemsPerPage = ref(5)
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error')
const isLoading = ref(false)

// Watch para resetar página
watch(itemsPerPage, () => {
  page.value = 1
})

const pageCount = computed(() => Math.ceil(veterinarios.value.length / itemsPerPage.value))
const startIndex = computed(() => veterinarios.value.length === 0 ? 0 : (page.value - 1) * itemsPerPage.value + 1)
const endIndex = computed(() => Math.min(page.value * itemsPerPage.value, veterinarios.value.length))
const paginatedVeterinarios = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return veterinarios.value.slice(start, end)
})

function nextPage() {
  if (page.value < pageCount.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

// Funções auxiliares
function formatarDia(dia: string | number) {
  const mapa: Record<string, string> = {
    'segunda': 'Segunda-feira',
    'terca-feira': 'Terça-feira',
    'quarta': 'Quarta-feira',
    'quinta': 'Quinta-feira',
    'sexta-feira': 'Sexta-feira',
    'sabado': 'Sábado',
    'domingo': 'Domingo'
  }
  return mapa[dia] || dia
}

function formatarTelefones(contatos: any[]) {
  return contatos
    .flatMap(c =>
      c.telefones?.map((t: any) => formatPhoneNumber(t.numero)) || []
    )
    .join(', ')
}

function estaAtendendo(vet: any): boolean {
  if (!vet.dias_atendimento) return false;

  // Nome do dia atual em português no mesmo formato dos dados
  const diasSemana: Record<number, string> = {
    0: 'domingo',
    1: 'segunda-feira',
    2: 'terca-feira',
    3: 'quarta',
    4: 'quinta',
    5: 'sexta-feira',
    6: 'sabado'
  };

  const agora = new Date();
  const diaAtual = diasSemana[agora.getDay()];
  const horarioAtualMinutos = agora.getHours() * 60 + agora.getMinutes();

  const horarioDia = vet.dias_atendimento[diaAtual];
  if (!horarioDia) return false;

  // Converter "HH:mm" em minutos totais
  const [hIni, mIni] = horarioDia.inicio.split(':').map(Number);
  const [hFim, mFim] = horarioDia.fim.split(':').map(Number);
  const inicioMinutos = hIni * 60 + mIni;
  const fimMinutos = hFim * 60 + mFim;

  // Caso o horário ultrapasse a meia-noite (ex: 22:00 - 02:00)
  if (fimMinutos < inicioMinutos) {
    return (
      horarioAtualMinutos >= inicioMinutos || horarioAtualMinutos <= fimMinutos
    );
  }

  return (
    horarioAtualMinutos >= inicioMinutos && horarioAtualMinutos <= fimMinutos
  );
}


function visualizar(item: any) {
  console.log('Visualizar:', item)
}

function editar(item: any) {
  console.log('Editar:', item)
}

const listagemVeterinarios = async () => {
  try {
    const response = await recuperarVeterinarios()
    veterinarios.value = response
  } catch (error: any) {
    alertMessage.value =
      error?.msg || 'Ocorreu um erro ao carregar os veterinários.'
    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  await listagemVeterinarios()
})
</script>

<style lang="scss">
thead {
  background: #FFE9E9;

  th {
    height: 50px !important;
    border-bottom: none !important;

    span {
      color: #434343;
      font-weight: 600;
    }
  }

  tr>th:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  tr>th:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}

.v-btn {
  transition: none !important;

  &:hover>.v-btn__overlay {
    background: transparent !important;
  }

  .v-icon:hover {
    color: #d31b27ca !important;
  }
}

.v-icon {
  color: #434343;
}
</style>

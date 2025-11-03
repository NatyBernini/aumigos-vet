<template>
  <v-dialog v-model="dialogVisible" width="95%" max-width="500px" persistent>
    <v-card v-if="!isLoading" id="card-modal-cadastro">
      <row class="row-close-modal">
        <v-btn id="btn-close-modal" @click="cancel">X</v-btn>
      </row>
      <v-card-title class="mb-5">
        <v-icon color="#ff8200" class="mr-2">mdi-calendar-clock</v-icon>
        Agendar
      </v-card-title>

      <v-card-text class="w-100 d-flex flex-column flex-wrap ga-4">
        <v-alert v-if="showAlert" :type="alertType" class="mt-3" dismissible @click:close="showAlert = false">
          {{ alertMessage }}
        </v-alert>

        <div class="d-flex ga-5 w-100 flex-wrap">
          <inputText  label="Data*" type="date" :ocultaContador="true"
            v-model:valueInput="textInputs['input-data']" />
          <inputText  label="Hora*" type="time" :ocultaContador="true"
            v-model:valueInput="textInputs['input-hora']" />
        </div>
        <!-- Botões de seleção -->
        <v-row>
          <v-col cols="12" md="6">
            <v-btn class="btn-padrao" block @click="dialogPacientes = true" v-if="!pacienteSelecionado">
              Selecionar Paciente
            </v-btn>

            <!-- Exibe paciente selecionado com ações -->
            <v-card v-else class="pa-3 card-pac-vet-selecionado">

              <div class="d-flex">
                <p class="mr-2">Paciente:</p><strong>{{ pacienteSelecionado.nome }}</strong><br />
              </div>
              <div class="d-flex ga-2 mt-3">
                <v-tooltip text="Trocar Paciente" location="bottom" open-delay="300">
                  <template #activator="{ props }">
                    <v-btn class="btn-padrao " v-bind="props" variant="text"
                      @click="dialogPacientes = true">Trocar</v-btn>
                  </template>
                </v-tooltip>


                <v-tooltip text="Remover Paciente" location="bottom" open-delay="300">
                  <template #activator="{ props }">

                    <v-btn class="btn-padrao" v-bind="props" variant="text" @click="removerPaciente">Remover</v-btn>
                  </template>
                </v-tooltip>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-btn class="btn-padrao" block @click="dialogVeterinarios = true" v-if="!veterinarioSelecionado">
              Selecionar Veterinário
            </v-btn>

            <!-- Exibe veterinário selecionado -->
            <v-card v-else class="pa-3 d-flex align-center justify-between" variant="outlined">
              <div>
                👨‍⚕️ <strong>{{ veterinarioSelecionado.nome }}</strong><br />
                <small>CRMV: {{ veterinarioSelecionado.crmv }}</small>
              </div>
              <div class="d-flex ga-2">
                <v-btn size="small" icon="mdi-swap-horizontal" color="primary" variant="text"
                  @click="dialogVeterinarios = true" :title="'Trocar Veterinário'"></v-btn>
                <v-btn size="small" icon="mdi-delete" color="error" variant="text" @click="removerVeterinario"
                  :title="'Remover Veterinário'"></v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="mt-5 pa-0 w-100 d-flex justify-end flex-row">
        <v-spacer />
        <v-btn class="btn-padrao" :loading="loading">Agendar</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Spinner -->
    <v-container v-if="isLoading" class="d-flex align-center justify-center">
      <v-progress-circular indeterminate color="#ff8200" size="40" width="5"></v-progress-circular>
    </v-container>
  </v-dialog>

  <!-- MODAL PACIENTES -->
  <v-dialog v-model="dialogPacientes" max-width="900px">
    <v-card class="pa-5">
      <v-card-title>
        <span class="text-h6">Selecionar Paciente</span>
        <v-spacer></v-spacer>
        <v-btn text @click="dialogPacientes = false">X</v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="searchPaciente" label="Pesquisar por nome" prepend-inner-icon="mdi-magnify" clearable />
        <v-data-table :items="filteredPacientes" :headers="headersPacientes" :items-per-page="5">
          <template #item.acao="{ item }">
            <v-btn class="btn-padrao" size="small" @click="selecionarPaciente(item)">
              Selecionar
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialogPacientes = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- MODAL VETERINÁRIOS -->
  <v-dialog v-model="dialogVeterinarios" max-width="900px">
    <v-card class="pa-5">
      <v-card-title>
        <span class="text-h6">Selecionar Veterinário</span>
        <v-spacer></v-spacer>
        <v-btn text @click="dialogVeterinarios = false">X</v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="searchVeterinario" label="Pesquisar por nome ou CRMV" prepend-inner-icon="mdi-magnify"
          clearable />
        <v-data-table :items="filteredVeterinarios" :headers="headersVeterinarios" :items-per-page="5">
          <template #item.acao="{ item }">
            <v-btn class="btn-padrao" size="small" @click="selecionarVeterinario(item)">
              Selecionar
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialogVeterinarios = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal campos obrigatórios -->
  <modalCamposObrigatorios v-if="!isLoading" :isOpen="showModalConfirmation"
    @update:isOpen="showModalConfirmation = $event" />
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted , watchEffect} from 'vue'
import inputText from '@/components/inputText.vue'
import modalCamposObrigatorios from '@/components/modalCamposObrigatorios.vue'
import { recuperarPacientes } from '@/services/paciente'

const props = defineProps<{
  isOpen: boolean
  dataSelecionada?: Date | null
  horaSelecionada?: string | null
}>()


const emit = defineEmits<{ (e: 'update:isOpen', value: boolean): void }>()

const dialogVisible = ref(props.isOpen)
watch(() => props.isOpen, (val) => (dialogVisible.value = val))
watch(dialogVisible, (val) => emit('update:isOpen', val))

// Estado
const isLoading = ref(false)
const loading = ref(false)
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error')
const textInputs = ref<Record<string, string>>({})
const showModalConfirmation = ref(false)

// Selecionados
const pacienteSelecionado = ref<any>(null)
const veterinarioSelecionado = ref<any>(null)

// Dialogs
const dialogPacientes = ref(false)
const dialogVeterinarios = ref(false)

// ==============================
// 🔹 PACIENTES
// ==============================
const listPacientes = ref<any[]>([])
const searchPaciente = ref('')
const headersPacientes = [
  { title: 'ID', key: 'id' },
  { title: 'Nome', key: 'nome' },
  { title: 'Tutor', key: 'tutor' },
  { title: 'Espécie', key: 'especie' },
  { title: 'Ação', key: 'acao', sortable: false },
]

const filteredPacientes = computed(() => {
  if (!searchPaciente.value) return listPacientes.value
  const term = searchPaciente.value.toLowerCase()
  return listPacientes.value.filter((p) => p.nome.toLowerCase().includes(term))
})

function selecionarPaciente(paciente: any) {
  pacienteSelecionado.value = paciente
  dialogPacientes.value = false
}

function removerPaciente() {
  pacienteSelecionado.value = null
}

// ==============================
// 🔹 VETERINÁRIOS
// ==============================
const listVeterinarios = ref<any[]>([])
const searchVeterinario = ref('')
const headersVeterinarios = [
  { title: 'ID', key: 'id' },
  { title: 'Nome', key: 'nome' },
  { title: 'CRMV', key: 'crmv' },
  { title: 'Clínica', key: 'clinica' },
  { title: 'Ação', key: 'acao', sortable: false },
]

const filteredVeterinarios = computed(() => {
  if (!searchVeterinario.value) return listVeterinarios.value
  const term = searchVeterinario.value.toLowerCase()
  return listVeterinarios.value.filter(
    (v) => v.nome.toLowerCase().includes(term) || v.crmv.toLowerCase().includes(term)
  )
})

function selecionarVeterinario(veterinario: any) {
  veterinarioSelecionado.value = veterinario
  dialogVeterinarios.value = false
}

function removerVeterinario() {
  veterinarioSelecionado.value = null
}

// ==============================
async function loadPacientes() {
  const response = await recuperarPacientes()
  listPacientes.value = response
}

async function loadVeterinarios() {
  listVeterinarios.value = []
}

watchEffect(() => {
  if (props.dataSelecionada) {
    // Converte a data para formato ISO compatível com input type="date"
    const dataFormatada = new Date(props.dataSelecionada).toISOString().split('T')[0]
    textInputs.value['input-data'] = dataFormatada
  }

  if (props.horaSelecionada) {
    // Preenche diretamente o campo de hora
    textInputs.value['input-hora'] = props.horaSelecionada
  }
})

onMounted(async () => {
  isLoading.value = true
  await Promise.all([loadPacientes(), loadVeterinarios()])
  isLoading.value = false
})

function cancel() {
  textInputs.value = {}
  pacienteSelecionado.value = null
  veterinarioSelecionado.value = null
  dialogVisible.value = false
}
</script>

<style lang="scss">
.row-close-modal {
  display: flex;
  width: 100%;
  justify-content: flex-end;

  .v-btn {
    background: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    display: flex;
    justify-content: flex-end;
    color: #b0b0b0 !important;
    font-size: 18px !important;

    &:hover>.v-btn__overlay {
      opacity: 0 !important;
    }
  }
}

#card-modal-cadastro {
  padding-bottom: 21px !important;
  padding: 21px;
  align-items: start;
  justify-content: left;
  min-height: 150px;
  border-radius: 20px;

  .v-card-title {
    padding: 0;
    font-weight: 700;
    font-size: 18px;
    line-height: 16px;
    letter-spacing: 0%;
  }

  .v-card-text {
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0%;
    color: #6c6c6c;
    padding: 0px;
  }

  .card-pac-vet-selecionado {
    border: 1px solid #ff8200;
    border-radius: 10px;
    justify-content: center;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}
</style>

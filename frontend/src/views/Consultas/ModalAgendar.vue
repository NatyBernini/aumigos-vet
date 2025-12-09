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
          <inputText label="Data*" type="date" :ocultaContador="true" v-model:valueInput="textInputs['input-data']" />
          <inputText label="Hora*" type="time" :ocultaContador="true" v-model:valueInput="textInputs['input-hora']" />
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
            <v-btn class="btn-padrao" block @click="openVeterinarioDialog" v-if="!veterinarioSelecionado">
              Selecionar Veterinário
            </v-btn>


            <!-- Exibe veterinário selecionado -->
            <v-card v-else class="pa-3 card-pac-vet-selecionado">

              <div class="d-flex">
               <strong>{{ veterinarioSelecionado.nome_completo }}</strong><br />
              </div>
              <div class="d-flex">
                
                <p class="mr-2">CRMV:</p><strong>{{ veterinarioSelecionado.crmv }}</strong><br />
              </div>
              <div class="d-flex ga-2 mt-3">

                <v-tooltip text="Trocar Veterinário" location="bottom" open-delay="300">
                  <template #activator="{ props }">
                    <v-btn class="btn-padrao " v-bind="props" variant="text"
                      @click="openVeterinarioDialog">Trocar</v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Remover Veterinário" location="bottom" open-delay="300">
                  <template #activator="{ props }">

                    <v-btn class="btn-padrao" v-bind="props" variant="text" @click="removerVeterinario">Remover</v-btn>
                  </template>
                </v-tooltip>
              </div>

            </v-card>

          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="mt-5 pa-0 w-100 d-flex justify-end flex-row">
        <v-spacer />
        <v-btn class="btn-padrao" :loading="loading" @click="salvar">Agendar</v-btn>
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
import { ref, watch, computed, onMounted, watchEffect } from 'vue'
import inputText from '@/components/inputText.vue'
import modalCamposObrigatorios from '@/components/modalCamposObrigatorios.vue'
import { recuperarPacientes } from '@/services/paciente'
import { recuperarVeterinarios } from '@/services/veterinario'
import { salvarClinica } from '@/services/clinica'
import { useAppStore } from '@/modules/commons/store'
import { salvarConsulta } from '@/services/consulta'

const props = defineProps<{
  isOpen: boolean
  dataSelecionada?: Date | null
  horaSelecionada?: string | null
}>()

const appStore = useAppStore()

const emit = defineEmits<{ (e: 'update:isOpen', value: boolean): void }>()

// CONTROLE DE MODAL PRINCIPAL
const dialogVisible = ref(props.isOpen)
watch(() => props.isOpen, (val) => (dialogVisible.value = val))
watch(dialogVisible, (val) => emit('update:isOpen', val))

// ESTADOS GERAIS
const isLoading = ref(false)
const loading = ref(false)
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error')
const textInputs = ref<Record<string, string>>({})
const showModalConfirmation = ref(false)

// SELECIONADOS
const pacienteSelecionado = ref<any>(null)
const veterinarioSelecionado = ref<any>(null)

// DIALOGS INTERNOS
const dialogPacientes = ref(false)
const dialogVeterinarios = ref(false)

// PACIENTES
const listPacientes = ref<any[]>([])
const searchPaciente = ref('')
const headersPacientes = [
  { title: 'ID', key: 'id' },
  { title: 'Nome', key: 'nome' },
  { title: 'Tutor', key: 'tutor.nome_completo' },
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

// VETERINÁRIOS
const listVeterinarios = ref<any[]>([])
const filteredDisponiveis = ref<any[]>([])
const searchVeterinario = ref('')
const headersVeterinarios = [
  { title: 'ID', key: 'id' },
  { title: 'Nome', key: 'nome_completo' },
  { title: 'CRMV', key: 'crmv' },
  { title: 'Clínica', key: 'clinica' },
  { title: 'Ação', key: 'acao', sortable: false },
]

function timeToMinutes(t: string | null | undefined) {
  if (!t) return null
  const parts = t.split(':')
  if (parts.length < 2) return null
  const h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}

function isTimeBetween(target: string, inicio: string | null | undefined, fim: string | null | undefined) {
  const t = timeToMinutes(target)
  const i = timeToMinutes(inicio)
  const f = timeToMinutes(fim)
  if (t === null || i === null || f === null) return false
  return t >= i && t <= f
}

function aplicarFiltroPorDataHora() {
  const data = textInputs.value['input-data']
  const hora = textInputs.value['input-hora']
  console.log("data", data)
  console.log("hora: ", hora)

  if (!data || !hora) {
    filteredDisponiveis.value = []
    return
  }

  // Corrige o fuso para garantir que a data é local (não UTC)
  const [ano, mes, dia] = data.split('-').map(Number)
  const dataLocal = new Date(ano, mes - 1, dia)

  // Gera o nome do dia da semana com acento e hífen
  const diaSemana = dataLocal
    .toLocaleDateString('pt-BR', { weekday: 'long' })
    .toLowerCase()
    .trim()

  console.log("dia da semana (corrigido): ", diaSemana)

  filteredDisponiveis.value = listVeterinarios.value.filter((vet) => {
    const diaInfo = vet.dias_atendimento?.[diaSemana]
    console.log("diaInfo: ", diaInfo)
    if (!diaInfo) return false

    const inicio = diaInfo.inicio
    const fim = diaInfo.fim

    console.log("inicio: ", inicio)
    console.log("fim: ", fim)
    console.log("isTime: ", isTimeBetween(hora, inicio, fim))
    return isTimeBetween(hora, inicio, fim)
  })
}



// Ação ao clicar em "Selecionar Veterinário"
function openVeterinarioDialog() {
  console.log("abrindo modal")
  const data = textInputs.value['input-data']
  const hora = textInputs.value['input-hora']

  if (!data || !hora) {
    showAlert.value = true
    alertType.value = 'warning'
    alertMessage.value = 'Por favor selecione data e hora antes de escolher o veterinário.'
    setTimeout(() => (showAlert.value = false), 3000)
    return
  }

  aplicarFiltroPorDataHora()

  if (filteredDisponiveis.value.length === 0) {
    showAlert.value = true
    alertType.value = 'warning'
    alertMessage.value = 'Nenhum veterinário disponível neste dia e horário.'
    setTimeout(() => (showAlert.value = false), 3000)
    return
  } else {
    showAlert.value = false
  }

  dialogVeterinarios.value = true
}

const filteredVeterinarios = computed(() => {
  const base = filteredDisponiveis.value
  if (!searchVeterinario.value) return base
  const term = searchVeterinario.value.toLowerCase()
  return base.filter(
    (v) =>
      (v.nome_completo && v.nome_completo.toLowerCase().includes(term)) ||
      (v.crmv && v.crmv.toString().toLowerCase().includes(term))
  )
})

function selecionarVeterinario(veterinario: any) {
  veterinarioSelecionado.value = veterinario
  dialogVeterinarios.value = false
}

function removerVeterinario() {
  veterinarioSelecionado.value = null
}

async function loadPacientes() {
  const response = await recuperarPacientes()
  listPacientes.value = response
}

async function loadVeterinarios() {
  const response = await recuperarVeterinarios()
  listVeterinarios.value = response
}

function validation() {
  if (
    !textInputs.value['input-data'] ||
    !textInputs.value['input-hora'] ||
    !pacienteSelecionado.value ||
    !veterinarioSelecionado.value
  ) {
    showModalConfirmation.value = true
    return false
  }
  return true
}

const salvar = async () => {
  if (!validation()) return

  loading.value = true

  try {
    const dados = {
      animal_id: pacienteSelecionado.value.id,
      clinica: appStore.userData?.clinicas[0]?.id,
      veterinario_id: veterinarioSelecionado.value.id,
      data_consulta: textInputs.value['input-data'],
      hora_consulta: textInputs.value['input-hora']
    }

    await salvarConsulta(dados)

    alertType.value = 'success'
    alertMessage.value = 'Agendamento realizado com sucesso!'
    showAlert.value = true

    setTimeout(() => {
      showAlert.value = false
      dialogVisible.value = false
      cancel()
    }, 2000)

  } catch (error: any) {
    console.error('ERRO AGENDAMENTO:', error)

    let mensagemErro = 'Erro ao realizar o agendamento.'

    const erros = error.response?.data || error.data
    if (erros && typeof erros === 'object') {
      const mensagens: string[] = []

      const parseErros = (obj: any, prefix = '') => {
        Object.entries(obj).forEach(([campo, valor]) => {
          if (Array.isArray(valor)) {
            mensagens.push(`${prefix}${campo.toUpperCase()}: ${valor.join(', ')}`)
          } else if (typeof valor === 'object') {
            parseErros(valor, `${prefix}${campo} - `)
          } else {
            mensagens.push(`${prefix}${campo.toUpperCase()}: ${valor}`)
          }
        })
      }

      parseErros(erros)
      if (mensagens.length) mensagemErro = mensagens.join('\n')
    }

    alertType.value = 'error'
    alertMessage.value = mensagemErro
    showAlert.value = true

    setTimeout(() => (showAlert.value = false), 5000)
  } finally {
    loading.value = false
  }
}


watchEffect(() => {
  if (props.dataSelecionada) {
    const dataFormatada = new Date(props.dataSelecionada).toISOString().split('T')[0]
    textInputs.value['input-data'] = dataFormatada
  }

  if (props.horaSelecionada) {
    textInputs.value['input-hora'] = props.horaSelecionada
  }
})

onMounted(async () => {
  isLoading.value = true
  await Promise.all([loadPacientes(), loadVeterinarios()])
  isLoading.value = false
})

// CANCELAR MODAL
function cancel() {
  textInputs.value = {}
  pacienteSelecionado.value = null
  veterinarioSelecionado.value = null
  dialogVisible.value = false
  textInputs.value['input-hora'] = ''
  textInputs.value['input-data'] = ''
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
  min-height: 120px;
    border: 1px solid #ff8200;
    border-radius: 10px;
    justify-content: center;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}
</style>

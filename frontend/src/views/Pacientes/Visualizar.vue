<template>
  <v-alert v-if="showAlert" :type="alertType" class="mt-3" dismissible @click:close="showAlert = false">
    {{ alertMessage }}
  </v-alert>
  <v-card>
    <!-- Cabeçalho / Breadcrumb -->
    <p class="title-page">
      Visualizar Paciente
      <img src="../../assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
    </p>
    <p class="sub-page">
      Pacientes / <span class="aba-atual">Cadastro</span>
      <img src="../../assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
    </p>

    <!-- Abas -->
    <v-tabs v-model="tab">
      <v-tab value="paciente">Informações do Paciente</v-tab>
      <v-tab value="tutor">Informações do Responsável</v-tab>
      <v-tab value="protocolo">Vacinação e Vermifugação</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <!-- ======================= ABA PACIENTE ======================= -->
        <v-tabs-window-item value="paciente">
          <form @submit.prevent="submit">
            <div class="row-info-radios">
              <v-radio-group v-model="origem" inline>
                <v-radio label="Doméstico" value="domestico" />
                <v-radio label="Resgatado" value="resgatado" />
              </v-radio-group>
            </div>

            <p>Espécie*</p>
            <div class="row-info-radios">
              <v-radio-group v-model="especie" inline max-width="300px">
                <v-radio label="Canina" value="especieCan" />
                <v-radio label="Felina" value="especieFel" />
                <v-radio label="Outra" value="especieOutra" />
              </v-radio-group>

              <inputText v-if="especie === 'especieOutra'" label="Especificar Outra Espécie*" type="text" required
                v-model:valueInput="textInputs['input-especificar-outra-especie']"
                id="input-especificar-outra-especie" />
            </div>

            <p>Informações Básicas</p>
            <v-col>
              <v-row class="row-info-basicas">
                <inputText label="Nome*" type="text" required v-model:valueInput="textInputs['input-nome']"
                  id="input-nome" @update:valueInput="(value: any) => updateInput('input-nome', value)" />
                <inputText label="Data de Nascimento*" type="date" :ocultaContador="true"
                  v-model:valueInput="textInputs['input-data-nascimento-animal']" />
              </v-row>

              <v-row class="row-info-basicas">
                <inputText label="Peso*" classe="input-locador" type="text" required suffix="gramas"
                  v-model:valueInput="textInputs['input-peso']" :id="'input-peso'" @input="validateDecimalInput($event)"
                  :maxLength="0" />

                <inputText label="Raça*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs['input-raca']" id="input-raca" />

                <inputText label="Pelagem*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs['input-pelagem']" id="input-pelagem" />
              </v-row>
            </v-col>

            <p>Porte</p>
            <div class="row-info-radios">
              <v-radio-group v-model="porte" inline>
                <v-radio label="Pequeno" value="pequeno" />
                <v-radio label="Médio" value="medio" />
                <v-radio label="Grande" value="grande" />
              </v-radio-group>
            </div>

            <p>Sexo*</p>
            <div class="row-info-radios">
              <v-radio-group v-model="sexo" inline>
                <v-radio label="Masculino" value="macho" />
                <v-radio label="Feminino" value="femea" />
              </v-radio-group>
            </div>

            <p>Castrado?*</p>
            <div class="row-info-radios">
              <v-radio-group v-model="castrado" inline max-width="150px">
                <v-radio label="Sim" value="castradoS" />
                <v-radio label="Não" value="castradoN" />
              </v-radio-group>

              <inputText v-if="castrado === 'castradoS'" label="Data*" type="date" :ocultaContador="true"
                v-model:valueInput="textInputs['input-data-castracao']" />
            </div>

            <TextArea :modelValue="textarea.ObservacoesGerais"
              @update:modelValue="(value: any) => (textarea.ObservacoesGerais = value)" label="Observações/Detalhamento"
              class="wrap-textarea" :maxLength="300" placeholder="Detalhe algum ponto extra sobre o paciente..." />

          </form>
        </v-tabs-window-item>

        <!-- ======================= ABA TUTOR ======================= -->
        <v-tabs-window-item value="tutor" class="pt-5">
          <v-form ref="form">
            <!-- Botão para abrir modal -->
            <v-btn class="btn-padrao mb-4" color="primary" @click="dialogTutores = true">
              Selecionar Tutor Cadastrado
            </v-btn>

            <!-- Informações básicas -->
            <p>Informações Básicas</p>
            <v-col>
              <v-row class="row-info-basicas">
                <inputText label="Nome do Responsável*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs['input-nome-tutor']" id="input-nome-tutor" />
              </v-row>

              <v-row class="row-info-basicas">
                <inputText label="CPF*" type="text" v-model:valueInput="textInputs['input-cpf']" id="input-cpf"
                  :maxLength="14" required :ocultaContador="true" />
                <inputText label="Data de Nascimento*" type="date" :ocultaContador="true"
                  v-model:valueInput="textInputs['input-data-nascimento-tutor']" />
              </v-row>

              <TextArea :modelValue="textarea.ObservacoesGeraisTutor"
                @update:modelValue="(value: any) => (textarea.ObservacoesGeraisTutor = value)"
                label="Observações/Detalhamento" class="wrap-textarea" :maxLength="300"
                placeholder="Detalhe algum ponto extra sobre o tutor..." />
            </v-col>

          </v-form>
        </v-tabs-window-item>

        <!-- ======================= ABA PROTOCOLO ======================= -->
        <v-tabs-window-item value="protocolo" class="pt-5">
          <v-form ref="form">
            <p class="mb-3">Informações Básicas</p>
            <p>Vermifugado?*</p>
            <div class="row-info-radios">
              <v-radio-group v-model="vermifugado" inline max-width="150px">
                <v-radio label="Sim" value="vermifugadoS" />
                <v-radio label="Não" value="vermifugadoN" />
              </v-radio-group>

              <v-text-field v-if="vermifugado === 'vermifugadoS'" v-model="dataVermifugado" label="Data*" type="date"
                max-width="150px" />
            </div>

            <p>Vacinas</p>
            <v-btn class="btn-padrao" @click="dialogVacina = true">Adicionar Vacina</v-btn>

          </v-form>
        </v-tabs-window-item>
        <div class="container-btn mt-5">
          <p class="msg-auxiliar">Campos Obrigatórios*</p>
        </div>

        <div class="container-btn mt-5">
          <v-btn class="btn-padrao" @click="resetFormCustom">Limpar Tudo</v-btn>
          <v-btn class="me-4 btn-padrao" @click="submit">Salvar</v-btn>
        </div>
      </v-tabs-window>
    </v-card-text>
  </v-card>

  <!-- MODAL DE SELEÇÃO DE TUTOR -->
  <v-dialog v-if="!isLoading" v-model="dialogTutores" max-width="900px">
    <v-card class="pa-5">
      <v-card-title>
        <span class="text-h6">Selecionar Tutor</span>
        <v-spacer></v-spacer>
        <v-btn text @click="dialogTutores = false">X</v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="searchTutor" label="Pesquisar por nome ou CPF" prepend-inner-icon="mdi-magnify"
          clearable />

        <v-data-table :items="filteredTutores" :headers="headersTutores" :items-per-page="5">
          <template #item.acao="{ item }">
            <v-btn class="btn-padrao" variant="tonal" size="small" @click="selecionarTutor(item)">
              Selecionar
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialogTutores = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Spinner de Carregamento -->
  <v-container v-if="isLoading" class="d-flex align-center justify-center">
    <v-progress-circular indeterminate color="primary" size="40" width="5"></v-progress-circular>
  </v-container>

  <ModalVacina :isOpen="dialogVacina" @vacinaCadastrado="handleModalClose" @update:isOpen="dialogVacina = $event"
    :id_animal="0" />
  <modalCamposObrigatorios v-if="!isLoading" :isOpen="showModalConfirmation"
    @update:isOpen="showModalConfirmation = $event" />
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/modules/commons/store'
import { useRoute } from 'vue-router'

// COMPONENTES
import inputText from '@/components/inputText.vue'
import TextArea from '@/components/textArea.vue'
import ModalVacina from './ModalVacina.vue'
import modalCamposObrigatorios from '@/components/modalCamposObrigatorios.vue'

// SERVICES
import { salvarPaciente, recuperarPaciente } from '@/services/paciente'
import { salvarTutor, recuperarTutores } from '@/services/tutor'
import { replaceCommaWithDot } from '@/utils/formaUtils'


const appStore = useAppStore()
const route = useRoute() 
const idPaciente = Number(route.params.id) 


defineOptions({ name: 'PacienteVisualizar' })

// Estado geral
const tab = ref('paciente')
const dialogVacina = ref(false)
const isLoading = ref(false)
const dialogTutores = ref(false)
const showModalConfirmation = ref(false)

// Controle de alertas e mensagens
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error')

// Estrutura dos campos
const textInputs = ref<Record<string, string>>({})
const textarea = ref({
  ObservacoesGerais: '',
  vacinas: '',
  ObservacoesGeraisTutor: ''
})

const idTutor = ref<number>(0)

// Telefones
const phones = ref<{ number: string }[]>([{ number: '' }])

// Campos de radio
const origem = ref('')
const especie = ref('')
const porte = ref('')
const sexo = ref('')
const castrado = ref('')
const vermifugado = ref('')

// Datas
const dataCastrado = ref('')
const dataVermifugado = ref('')

function addPhone() {
  phones.value.push({ number: '' })
}
function removePhone(index: number) {
  phones.value.splice(index, 1)
}

// Formatação de telefone
function formatPhoneNumberRaw(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  } else {
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
  }
}

function onPhoneInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '').slice(0, 11)
  phones.value[index].number = formatPhoneNumberRaw(digits)
}
// Validação para números com até 2 casas decimais
const validateDecimalInput = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;

  // 1. Só dígitos
  let digits = inputElement.value.replace(/\D/g, '');

  // 2. Remove zeros à esquerda,
  //    mas garante pelo menos “0” para não ficar string vazia
  digits = digits.replace(/^0+/, '');
  if (digits === '') digits = '0';

  // 3. Limita a 8 dígitos (6 + 2)
  if (digits.length > 8) digits = digits.slice(0, 8);

  // 4. Monta o valor com vírgula
  let formatted: string;
  if (digits.length <= 2) {
    // até 2 dígitos → centavos
    formatted = '0,' + digits.padStart(2, '0');
  } else {
    const before = digits.slice(0, -2).slice(-6); // máximo 6
    const after = digits.slice(-2);
    formatted = `${before},${after}`;
  }

  // 5. Atualiza input / v‑model só se mudou
  if (inputElement.value !== formatted) {
    inputElement.value = formatted;
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));

    const id = inputElement.id;
    if (textInputs.value && id) textInputs.value[id] = formatted;
  }
};

// Formatação de CPF
function formatCpf(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) =>
      d ? `${a}.${b}.${c}-${d}` : `${a}.${b}.${c}`
    )
}

// Atualização de inputs
const updateInput = (id: string, newValue: string) => {
  textInputs.value[id] = newValue
}

// Limpar formulário
function resetFormCustom() {
  Object.keys(textInputs.value).forEach(k => (textInputs.value[k] = ''))
  textarea.value = { ObservacoesGerais: '', vacinas: '', ObservacoesGeraisTutor: '' }
  origem.value = ''
  especie.value = ''
  porte.value = ''
  sexo.value = ''
  castrado.value = ''
  vermifugado.value = ''
  dataCastrado.value = ''
  dataVermifugado.value = ''
  phones.value = [{ number: '' }]
}

async function submit() {
  // validação dos obrigatórios
  const obrigatoriosPreenchidos =
    textInputs.value['input-nome'] &&
    textInputs.value['input-data-nascimento-animal'] &&
    textInputs.value['input-peso'] &&
    textInputs.value['input-raca'] &&
    textInputs.value['input-pelagem'] &&
    especie.value &&
    sexo.value

  if (!obrigatoriosPreenchidos) {
    showModalConfirmation.value = true
    return
  }

  if (idTutor.value === 0) {
    await salvaTutor();
  }
  await salvaPaciente();

}

const salvaPaciente = async () => {
  try {
    const clinica = Number(appStore.userData?.clinicas[0]?.id)
    const dados = {
      nome: textInputs.value['input-nome'],
      tipo: origem.value,
      especie: especie.value,
      data_nascimento: textInputs.value['input-data-nascimento-animal'],
      peso: replaceCommaWithDot(textInputs.value['input-peso']),
      raca: textInputs.value['input-raca'],
      pelagem: textInputs.value['input-pelagem'],
      porte: porte.value,
      sexo: sexo.value,
      castrado: castrado.value === 'sim' ? true : false,
      data_castracao: textInputs.value['input-data-castracao'],
      observacao: textarea.value.ObservacoesGerais,
      tutor: idTutor.value,
      clinica
    }
    await salvarPaciente(dados)
  } catch (error: any) {
    if (error.tipo === 'VALIDATION' && error.errors) {
      const firstKey = Object.keys(error.errors)[0]
      alertMessage.value = error.errors[firstKey][0]
    } else if (error.tipo === 'ERROR') {
      alertMessage.value = error.msg
    } else {
      alertMessage.value = 'Ocorreu um erro inesperado ao salvar o paciente.'
    }

    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  }
}

const salvaTutor = async () => {
  try {
    const dados = {
      pessoa: {
        nome_completo: textInputs.value[`input-nome-tutor`],
        cpf: textInputs.value['input-cpf'],
        data_nascimento: textInputs.value['input-data-nascimento-tutor']
      },
      observacoes: textarea.value.ObservacoesGeraisTutor,
      ativo: true
    }

    const response = await salvarTutor(dados);
    alertMessage.value = 'Tutor cadastrado com sucesso!'
    alertType.value = 'success'
    showAlert.value = true

    setTimeout(() => (showAlert.value = false), 5000)
  } catch (error: any) {
    if (error.tipo === 'VALIDATION' && error.errors) {
      const firstKey = Object.keys(error.errors)[0]
      alertMessage.value = error.errors[firstKey][0]
    } else if (error.tipo === 'ERROR') {
      alertMessage.value = error.msg
    } else {
      alertMessage.value = 'Ocorreu um erro inesperado ao salvar o tutor.'
    }

    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  }
}

// Fechar modal de vacina
function handleModalClose() {
  dialogVacina.value = false
}

// TUTORES
const listTutores = ref<any[]>([])
const searchTutor = ref('')
const headersTutores = [
  { title: 'id', key: 'id' },
  { title: 'Nome', key: 'pessoa.nome_completo' },
  { title: 'CPF', key: 'pessoa.cpf' },
  { title: 'Data Nasc.', key: 'pessoa.data_nascimento' },
  { title: 'Clínica', key: 'clinica' },
  { title: 'Observações', key: 'observacoes' },
  { title: 'Ação', key: 'acao', sortable: false }
]

const filteredTutores = computed(() => {
  if (!searchTutor.value) return listTutores.value
  const term = searchTutor.value.toLowerCase()
  return listTutores.value.filter(
    t =>
      t.pessoa.nome_completo.toLowerCase().includes(term) ||
      t.pessoa.cpf.toLowerCase().includes(term)
  )
})

// Selecionar tutor e preencher campos
function selecionarTutor(tutor: any) {
  textInputs.value['input-nome-tutor'] = tutor.pessoa.nome_completo
  textInputs.value['input-cpf'] = tutor.pessoa.cpf
  textInputs.value['input-data-nascimento-tutor'] = tutor.pessoa.data_nascimento
  textarea.value.ObservacoesGeraisTutor = tutor.observacoes
  dialogTutores.value = false
  idTutor.value = tutor.id
}

const loadPaciente = async () => {
  try {
    if (!idPaciente) return
    isLoading.value = true

    const response = await recuperarPaciente(idPaciente)

    // Preenche campos com os dados retornados
    textInputs.value['input-nome'] = response.nome
    origem.value = response.tipo
    especie.value = response.especie
    textInputs.value['input-data-nascimento-animal'] = response.data_nascimento
    textInputs.value['input-peso'] = String(response.peso).replace('.', ',')
    textInputs.value['input-raca'] = response.raca
    textInputs.value['input-pelagem'] = response.pelagem
    porte.value = response.porte
    sexo.value = response.sexo
    castrado.value = response.castrado ? 'castradoS' : 'castradoN'
    textInputs.value['input-data-castracao'] = response.data_castracao
    textarea.value.ObservacoesGerais = response.observacao || ''
    idTutor.value = response.tutor?.id || 0

  } catch (error: any) {
    alertMessage.value = 'Erro ao carregar dados do paciente.'
    alertType.value = 'error'
    showAlert.value = true
  } finally {
    isLoading.value = false
  }
}

const loadComboTutores = async () => {
  try {
    const response = await recuperarTutores();
    listTutores.value = response;
  } finally {

  }
}

onMounted(async () => {
  isLoading.value = true;
  await loadPaciente()
  await loadComboTutores()
  isLoading.value = false;
})
</script>



<style lang="scss">
.v-slide-group {
  border-bottom: 1px solid #ABABAB;
}

.v-tab__slider {
  background: #d31b2773 !important;
  border-radius: 5px;
  height: 3px !important;
}

.v-btn {
  text-transform: initial;

}

.v-tab-item--selected {
  .v-btn__content {
    color: #d31b27;
  }
}

.v-card {
  box-shadow: none !important;
}

.row-info-basicas {
  gap: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.row-info-radios {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 20px;
}
</style>
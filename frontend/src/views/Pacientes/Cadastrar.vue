<template>
  <v-alert v-if="showAlert" :type="alertType" class="mt-3" dismissible @click:close="showAlert = false">
    {{ alertMessage }}
  </v-alert>
  <v-card>
    <!-- Cabeçalho / Breadcrumb -->
    <p class="title-page">
      Cadastro do Paciente
      <img src="../../assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
    </p>
    <p class="sub-page">
      Pacientes / <span class="aba-atual">Cadastrar</span>
      <img src="../../assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
    </p>

    <!-- Abas -->
    <v-tabs v-model="tab">
      <v-tab value="paciente">Informações do Paciente</v-tab>
      <v-tab value="tutor">Informações do Responsável</v-tab>
      <v-tab value="protocolo">Vacinação e Vermifugação</v-tab>
    </v-tabs>

    <v-card-text v-if="!isLoading">
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
                <v-radio label="Canina" value="Canina" />
                <v-radio label="Felina" value="Felina" />
                <v-radio label="Outra" value="Outra" />
              </v-radio-group>

              <inputText v-if="especie === 'Outra'" label="Especificar Outra Espécie*" type="text" required
                :ocultaContador="true" v-model:valueInput="textInputs['input-especificar-outra-especie']"
                id="input-especificar-outra-especie" />
            </div>

            <p>Informações Básicas</p>
            <v-col>
              <v-row class="row-info-basicas">
                <inputText label="Nome*" type="text" required v-model:valueInput="textInputs['input-nome']"
                  id="input-nome" @update:valueInput="(value: any) => updateInput('input-nome', value)"
                  :ocultaContador="true" />
                <inputText label="Data de Nascimento*" type="date" :ocultaContador="true"
                  v-model:valueInput="textInputs['input-data-nascimento-animal']" />
              </v-row>

              <v-row class="row-info-basicas">
                <inputText label="Peso*" type="text" required suffix="Kg" v-model:valueInput="textInputs['input-peso']"
                  :id="'input-peso'" @input="validateDecimalInput($event)" :maxLength="0" :ocultaContador="true" />

                <inputText label="Raça*" type="text" required v-model:valueInput="textInputs['input-raca']"
                  id="input-raca" :ocultaContador="true" />

                <inputText label="Pelagem*" type="text" required v-model:valueInput="textInputs['input-pelagem']"
                  id="input-pelagem" :ocultaContador="true" />
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
                <v-radio label="Sim" value="sim" />
                <v-radio label="Não" value="nao" />
              </v-radio-group>

              <inputText v-if="castrado === 'sim'" label="Data*" type="date" :ocultaContador="true"
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
            <v-btn class="btn-padrao mb-4 ml-3" color="error" @click="resetTutorForm">
              Limpar Dados do Tutor
            </v-btn>
            <v-btn v-if="idTutor" class="btn-padrao mb-4 ml-3" color="error" @click="bloquearEdicaoTutor = false">
              Editar Dados do Tutor
            </v-btn>


            <!-- Informações básicas -->
            <p>Informações Básicas</p>
            <v-col>
              <v-row class="row-info-basicas">
                <inputText label="Nome do Responsável*" :classe="'grande'" type="text" required :ocultaContador="true"
                  v-model:valueInput="textInputs['input-nome-tutor']" id="input-nome-tutor"
                  :disabled="bloquearEdicaoTutor" />
              </v-row>

              <v-row class="row-info-basicas">
                <inputText label="CPF*" type="text" v-model:valueInput="textInputs['input-cpf']" id="input-cpf"
                  :maxLength="14" required :ocultaContador="true" :disabled="bloquearEdicaoTutor" />
                <inputText label="Data de Nascimento*" type="date" :ocultaContador="true"
                  v-model:valueInput="textInputs['input-data-nascimento-tutor']" :classe="'medio'"
                  :disabled="bloquearEdicaoTutor" />
              </v-row>
            </v-col>
            <!-- Contatos -->
            <p>Informações para Contato</p>
            <v-col>
              <v-row class="row-info-basicas" v-for="(item, index) in phones" :key="index">
                <inputText :disabled="bloquearEdicaoTutor" label="Telefone*" type="text" required
                  @input="onPhoneInput(index, $event)" v-model:valueInput="item.number" :id="'input-telefone-' + index"
                  :maxLength="0" :ocultaContador="true" />

                <!-- Botões de adicionar / remover só no modo edição -->

                <v-btn :disabled="bloquearEdicaoTutor" icon class="btn-padrao btn-plus-phone"
                  @click="removePhone(index)" v-if="phones.length > 1">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn :disabled="bloquearEdicaoTutor" icon class="btn-padrao btn-plus-phone" @click="addPhone"
                  v-if="index === phones.length - 1">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-row>

              <v-row class="row-info-basicas">
                <inputText label="E-mail*" :classe="'grande'" type="text" required
                  v-model:valueInput="textInputs[`input-email`]" id="input-email" :disabled="bloquearEdicaoTutor"
                  :ocultaContador="true" />
              </v-row>
            </v-col>


            <!-- Endereço -->
            <p>Informações de Endereço</p>
            <v-col>
              <v-row class="row-info-basicas">
                <inputText :disabled="bloquearEdicaoTutor" label="CEP*" type="text" required
                  v-model:valueInput="textInputs[`input-cep`]" id="input-cep" :ocultaContador="true" />
                <inputText :disabled="bloquearEdicaoTutor" label="Estado*" type="text" required
                  v-model:valueInput="textInputs[`input-estado`]" id="input-estado" :ocultaContador="true" />

                <inputText :disabled="bloquearEdicaoTutor" label="Cidade*" type="text" required
                  v-model:valueInput="textInputs[`input-cidade`]" id="input-cidade" :ocultaContador="true" />

              </v-row>

              <v-row class="row-info-basicas">
                <inputText :disabled="bloquearEdicaoTutor" label="Bairro*" type="text" required
                  v-model:valueInput="textInputs[`input-bairro`]" id="input-bairro" :ocultaContador="true" />

                <inputText :disabled="bloquearEdicaoTutor" :classe="'grande'" label="Rua*" type="text" required
                  v-model:valueInput="textInputs[`input-rua`]" id="input-rua" :ocultaContador="true" />

              </v-row>

              <v-row class="row-info-basicas">
                <inputText :disabled="bloquearEdicaoTutor" label="Número" type="text" required
                  v-model:valueInput="textInputs[`input-numero-endereco`]" id="input-numero-endereco"
                  :ocultaContador="true" />

                <inputText :disabled="bloquearEdicaoTutor" label="Complemento" type="text" required
                  v-model:valueInput="textInputs[`input-complemento`]" id="input-complemento" :ocultaContador="true" />

              </v-row>

            </v-col>
            <TextArea :modelValue="textarea.ObservacoesGeraisTutor" :disabled="bloquearEdicaoTutor"
              @update:modelValue="(value: any) => (textarea.ObservacoesGeraisTutor = value)" label="Observações"
              class="wrap-textarea" :maxLength="300" placeholder="Detalhe algum ponto extra sobre o tutor..." />
          </v-form>
        </v-tabs-window-item>

        <!-- ======================= ABA PROTOCOLO ======================= -->
        <v-tabs-window-item value="protocolo" class="pt-5">
          <v-card class="card-informativo mb-7"><v-icon class="mr-2">mdi-alert-circle</v-icon>Nesta aba, você, como
            veterinário, pode cadastrar e gerenciar as vacinas e vermífugos aplicados no paciente.
          </v-card>
          <v-form ref="form">
            <div class="info-box" v-if="!isLoading">
              <span class="span-info-box">Vermífugos
                <v-btn color="accent" large class="btn-padrao" @click.stop="abrirModalNovoVermifugo">
                  Adicionar Vermífugo
                  <v-icon class="icon-close ml-3">mdi-pill</v-icon>
                </v-btn>

              </span>

            </div>
            <!-- Tabela de Vermífugos -->
            <v-data-table v-if="vermifugos.length" :headers="headers" :items="vermifugos"
              :hide-default-footer="vermifugos.length <= 5" :items-per-page="5" :items-per-page-options="[5, 10, 20]"
              class="elevation-1 table-protocolo mt-5" no-data-text="Nenhum vermífugo cadastrado.">
              <template #item.data_aplicacao="{ item }">
                {{ formatDateNoTimezone(item.data_aplicacao) }}

              </template>
              <template #item.data_proxima_dose="{ item }">
                {{ formatDateNoTimezone(item.data_proxima_dose) }}
              </template>
              <!-- Ícone Excluir  -->
              <template #item.acoes="{ item, index }">
                <v-tooltip text="Deletar Vermífugo" location="bottom" open-delay="300">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon color="#434343" variant="text" @click="removerVermifugo(item.id, index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <!-- Exibir ícone de edição apenas se estiver em modo edição -->
                <v-tooltip v-if="modoEdicao" text="Editar Vermífugo" location="bottom" open-delay="300">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon color="#1976D2" variant="text" @click="editarVermifugo(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>

            </v-data-table>


            <div class="info-box mt-5" v-if="!isLoading">
              <span class="span-info-box">Vacinas
                <v-btn color="accent" large @click.stop="abrirModalNovaVacina" class="btn-padrao">
                  Adicionar Vacina
                  <v-icon class="icon-close ml-3">mdi-needle</v-icon>
                </v-btn>
              </span>
            </div>
            <!-- ======================= TABELA DE VACINAS ======================= -->
            <v-data-table v-if="vacinas.length" :headers="headersVacina" :items="vacinas" :items-per-page="5"
              :items-per-page-options="[5, 10, 20]" :hide-default-footer="vacinas.length <= 5"
              class="elevation-1 table-protocolo mt-5" no-data-text="Nenhuma vacina cadastrada.">
              <template #item.data_aplicacao="{ item }">
                {{ formatDateNoTimezone(item.data_aplicacao) }}
              </template>
              <template #item.data_proxima_dose="{ item }">
                {{ formatDateNoTimezone(item.data_proxima_dose) }}
              </template>
              <!-- Ícones de Ações -->
              <template #item.acoes="{ item, index }">
                <v-tooltip text="Deletar Vacina" location="bottom" open-delay="300">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon color="#434343" variant="text" @click="removerVacina(item.id, index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <!-- Exibir ícone de edição apenas se estiver em modo edição -->
                <v-tooltip v-if="modoEdicao" text="Editar Vacina" location="bottom" open-delay="300">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon color="#1976D2" variant="text" @click="editarVacina(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>

            </v-data-table>


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
    <v-progress-circular indeterminate color="#ff8200" size="40" width="5"></v-progress-circular>
  </v-container>

  <ModalVacina :modoEdicao="modoEdicao" :vacinaSelecionada="vacinaSelecionada" :isOpen="dialogVacina"
    @vacinaCadastrado="handleModalVacinaClose" @update:isOpen="dialogVacina = $event" :id_animal="idPacienteRota" />

  <ModalVermifugo :modoEdicao="modoEdicao" :vermifugoSelecionado="vermifugoSelecionada" :isOpen="dialogVermifugo"
    @vermifugoCadastrado="handleModalVermifugoClose" @update:isOpen="dialogVermifugo = $event"
    :id_animal="idPacienteRota" />

  <modalCamposObrigatorios v-if="!isLoading" :isOpen="showModalConfirmation"
    @update:isOpen="showModalConfirmation = $event" />
</template>
<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/modules/commons/store'

// COMPONENTES
import inputText from '@/components/inputText.vue'
import TextArea from '@/components/textArea.vue'
import ModalVacina from './ModalVacina.vue'
import ModalVermifugo from './ModalVermifugo.vue'
import modalCamposObrigatorios from '@/components/modalCamposObrigatorios.vue'

// SERVICES
import { salvarPaciente, editarPaciente, salvarVermifugos, salvarVacinas, deletarVacinas, recuperarPaciente, deletarVermifugo } from '@/services/paciente'
import { salvarTutor, editarTutor, recuperarTutores } from '@/services/tutor'
import { replaceCommaWithDot, formatDateNoTimezone, formatCpf } from '@/utils/formaUtils'

const appStore = useAppStore()
defineOptions({ name: 'PacienteCadastro' })

const route = useRoute()
let idPacienteRota = Number(route.params.id) || 0

// Estado geral
const tab = ref('paciente')
const dialogVacina = ref(false)
const dialogVermifugo = ref(false)
const isLoading = ref(false)
const dialogTutores = ref(false)
const showModalConfirmation = ref(false)
const bloquearEdicaoTutor = ref(false)
const modoEdicao = ref(false)

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
const vermifugos = ref<any[]>([])
const vacinas = ref<any[]>([])

const headers = [
  { title: 'Nome', key: 'nome' },
  { title: 'Data da Aplicação', key: 'data_aplicacao' },
  { title: 'Data da Próxima Dose', key: 'data_proxima_dose' },
  { title: 'Ações', key: 'acoes', sortable: false }
]
const headersVacina = [
  { title: 'Nome', key: 'nome' },
  { title: 'Data da Aplicação', key: 'data_aplicacao' },
  { title: 'Data da Próxima Dose', key: 'data_proxima_dose' },
  { title: 'Ações', key: 'acoes', sortable: false }
]

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
  const inputElement = event.target as HTMLInputElement
  let digits = inputElement.value.replace(/\D/g, '')
  digits = digits.replace(/^0+/, '')
  if (digits === '') digits = '0'
  if (digits.length > 8) digits = digits.slice(0, 8)
  let formatted: string
  if (digits.length <= 2) {
    formatted = '0,' + digits.padStart(2, '0')
  } else {
    const before = digits.slice(0, -2).slice(-6)
    const after = digits.slice(-2)
    formatted = `${before},${after}`
  }
  if (inputElement.value !== formatted) {
    inputElement.value = formatted
    inputElement.dispatchEvent(new Event('input', { bubbles: true }))
    const id = inputElement.id
    if (textInputs.value && id) textInputs.value[id] = formatted
  }
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

function resetTutorForm() {
  textInputs.value['input-nome-tutor'] = ''
  textInputs.value['input-cpf'] = ''
  textInputs.value['input-data-nascimento-tutor'] = ''
  textInputs.value['input-email'] = ''
  textInputs.value['input-cep'] = ''
  textInputs.value['input-estado'] = ''
  textInputs.value['input-cidade'] = ''
  textInputs.value['input-bairro'] = ''
  textInputs.value['input-rua'] = ''
  textInputs.value['input-numero-endereco'] = ''
  textInputs.value['input-complemento'] = ''
  textarea.value.ObservacoesGeraisTutor = ''
  phones.value = [{ number: '' }]
  idTutor.value = 0

}

async function submit() {
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
    await salvaTutor(false)
  } else {
    await salvaTutor(true)
  }
  await salvaPaciente()
}

const salvaPaciente = async () => {
  try {
    const clinica = Number(appStore.userData?.clinicas[0]?.id)
    const dados = {
      nome: textInputs.value['input-nome'],
      tipo: origem.value,
      especie: especie.value === 'Outra' ? textInputs.value['input-especificar-outra-especie'] : especie.value,
      data_nascimento: textInputs.value['input-data-nascimento-animal'],
      peso: replaceCommaWithDot(textInputs.value['input-peso']),
      raca: textInputs.value['input-raca'],
      pelagem: textInputs.value['input-pelagem'],
      porte: porte.value,
      sexo: sexo.value,
      castrado: castrado.value === 'sim' ? true : false,
      data_castracao: textInputs.value['input-data-castracao'],
      observacao: textarea.value.ObservacoesGerais,
      tutor_id: idTutor.value,
      clinica
    }
    if (idPacienteRota) {
      await editarPaciente(idPacienteRota, dados)
    } else {
      const response = await salvarPaciente(dados)
      idPacienteRota = response.id

      await salvaVermifugo()
      await salvaVacina()
    }

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

const salvaTutor = async (edicao: boolean) => {
  try {
    const dados = {
      nome_completo: textInputs.value['input-nome-tutor'],
      cpf: textInputs.value['input-cpf'],
      data_nascimento: textInputs.value['input-data-nascimento-tutor'],
      observacoes: textarea.value.ObservacoesGeraisTutor,
      ativo: true,
      enderecos: [
        {
          cep: textInputs.value['input-cep'],
          estado: textInputs.value['input-estado'],
          cidade: textInputs.value['input-cidade'],
          bairro: textInputs.value['input-bairro'],
          rua: textInputs.value['input-rua'],
          numero: textInputs.value['input-numero-endereco'],
          complemento: textInputs.value['input-complemento']
        }
      ],
      contatos: [
        {
          email: textInputs.value['input-email'],
          telefones: phones.value.map(p => ({ numero: p.number }))
        }
      ]
    }
    if (edicao) {
      await editarTutor(idTutor.value, dados)
    } else {
      const response = await salvarTutor(dados)
      idTutor.value = response.id
    }
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

// Função para carregar paciente existente e preencher o formulário
async function carregarPaciente(id: number) {
  try {
    isLoading.value = true
    const response = await recuperarPaciente(id)

    origem.value = response.tipo
    especie.value = response.especie
    textInputs.value['input-nome'] = response.nome
    textInputs.value['input-data-nascimento-animal'] = response.data_nascimento
    textInputs.value['input-peso'] = response.peso.replace('.', ',')
    textInputs.value['input-raca'] = response.raca
    textInputs.value['input-pelagem'] = response.pelagem
    porte.value = response.porte
    sexo.value = response.sexo
    castrado.value = response.castrado ? 'sim' : 'nao'
    textInputs.value['input-data-castracao'] = response.data_castracao || ''
    textarea.value.ObservacoesGerais = response.observacao || ''

    const tutor = response.tutor
    idTutor.value = tutor.id
    textInputs.value['input-nome-tutor'] = tutor.nome_completo
    textInputs.value['input-cpf'] = formatCpf(tutor.cpf)
    textInputs.value['input-data-nascimento-tutor'] = tutor.data_nascimento
    textarea.value.ObservacoesGeraisTutor = tutor.observacoes || ''

    const endereco = tutor.enderecos?.[0] || {}
    textInputs.value['input-cep'] = endereco.cep || ''
    textInputs.value['input-estado'] = endereco.estado || ''
    textInputs.value['input-cidade'] = endereco.cidade || ''
    textInputs.value['input-bairro'] = endereco.bairro || ''
    textInputs.value['input-rua'] = endereco.rua || ''
    textInputs.value['input-numero-endereco'] = endereco.numero || ''
    textInputs.value['input-complemento'] = endereco.complemento || ''

    const contato = tutor.contatos?.[0] || {}
    textInputs.value['input-email'] = contato.email || ''
    phones.value = contato.telefones?.map((t: any) => ({ number: formatPhoneNumberRaw(t.numero) })) || [{ number: '' }]

    vacinas.value = response.vacinas || []
    vermifugos.value = response.vermifugos || []
  } catch (error) {
    console.error('Erro ao carregar paciente:', error)
    alertMessage.value = 'Erro ao carregar dados do paciente.'
    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  } finally {
    isLoading.value = false
  }
}

function abrirModalNovoVermifugo() {
  vermifugoSelecionada.value = null
  nextTick(() => {
    dialogVermifugo.value = true
  })
}

function abrirModalNovaVacina() {
  vacinaSelecionada.value = null
  nextTick(() => {
    dialogVacina.value = true
  })
}

const salvaVermifugo = async () => {
  try {
    for (const v of vermifugos.value) {
      const dados = {
        nome: v.nome,
        data_aplicacao: v.data_aplicacao,
        data_proxima_dose: v.data_proxima_dose,
        fabricante: v.fabricante,
        lote: v.lote,
        observacao: v.observacao || '',
        dosagem: v.dosagem
      }
      await salvarVermifugos(idPacienteRota, dados)
    }
    alert('Vermífugos salvos com sucesso!')
  } catch (error: any) {
    console.error('Erro ao salvar vermífugos.', error)
    alertMessage.value = 'Erro ao salvar vermífugos.'
    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  }
}

const salvaVacina = async () => {
  try {
    for (const v of vacinas.value) {
      const dados = {
        nome: v.nome,
        data_aplicacao: v.data_aplicacao,
        data_proxima_dose: v.data_proxima_dose,
        fabricante: v.fabricante,
        lote: v.lote,
        observacao: v.observacao || ''
      }
      await salvarVacinas(idPacienteRota, dados)
    }
    alert('Vacinas salvas com sucesso!')
  } catch (error: any) {
    console.error('Erro ao salvar vacinas.', error)
    alertMessage.value = 'Erro ao salvar vacinas.'
    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  }
}

function handleModalVermifugoClose(novoVermifugo?: any) {
  dialogVermifugo.value = false
  alertMessage.value = 'Vermífugo salvo com sucesso!'
  alertType.value = 'success'
  showAlert.value = true

  setTimeout(() => {
    showAlert.value = false
  }, 3000)

  if (novoVermifugo.id !== undefined) {
    const index = vermifugos.value.findIndex(v => v.id === novoVermifugo.id)
    if (index !== -1) {
      vermifugos.value[index] = {
        ...vermifugos.value[index],
        nome: novoVermifugo.nome,
        dosagem: novoVermifugo.dosagem,
        data_aplicacao: novoVermifugo.data_aplicacao,
        data_proxima_dose: novoVermifugo.data_proxima_dose,
        fabricante: novoVermifugo.fabricante,
        lote: novoVermifugo.lote,
        observacao: novoVermifugo.observacao
      }
    } else {
      vermifugos.value.push({
        id: novoVermifugo.id,
        nome: novoVermifugo.nome,
        dosagem: novoVermifugo.dosagem,
        data_aplicacao: novoVermifugo.data_aplicacao,
        data_proxima_dose: novoVermifugo.data_proxima_dose,
        fabricante: novoVermifugo.fabricante,
        lote: novoVermifugo.lote,
        observacao: novoVermifugo.observacao
      })
    }
  } else {
    vermifugos.value.push({
      id: novoVermifugo.id,
      nome: novoVermifugo.nome,
      dosagem: novoVermifugo.dosagem,
      data_aplicacao: novoVermifugo.data_aplicacao,
      data_proxima_dose: novoVermifugo.data_proxima_dose,
      fabricante: novoVermifugo.fabricante,
      lote: novoVermifugo.lote,
      observacao: novoVermifugo.observacao
    })
  }


  vermifugoSelecionada.value = null;
}


const removerVacina = async (item: any, index: number) => {
  try {
    if (modoEdicao.value) {
      await deletarVacinas(item)
    }
    vacinas.value.splice(index, 1)
  } catch (error: any) {
    alertMessage.value = error?.msg || 'Ocorreu um erro inesperado';
    alertType.value = 'error';
    showAlert.value = true;
    setTimeout(() => (showAlert.value = false), 5000);
  }
}
const vacinaSelecionada = ref<any | null>(null)
const vermifugoSelecionada = ref<any | null>(null)

const editarVacina = (vacina: any) => {
  vacinaSelecionada.value = vacina
  modoEdicao.value = true
  dialogVacina.value = true
}

const editarVermifugo = (vermifugo: any) => {
  vermifugoSelecionada.value = vermifugo
  modoEdicao.value = true
  dialogVermifugo.value = true
}

function handleModalVacinaClose(novaVacina?: any) {
  dialogVacina.value = false
  alertMessage.value = 'Vacina salva com sucesso!'
  alertType.value = 'success'
  showAlert.value = true

  setTimeout(() => {
    showAlert.value = false
  }, 3000)

  if (novaVacina.id !== undefined) {
    const index = vacinas.value.findIndex(v => v.id === novaVacina.id)

    if (index !== -1) {
      // Atualiza a vacina existente
      vacinas.value[index] = {
        ...vacinas.value[index],
        nome: novaVacina.nome,
        data_aplicacao: novaVacina.data_aplicacao,
        data_proxima_dose: novaVacina.data_proxima_dose,
        fabricante: novaVacina.fabricante,
        lote: novaVacina.lote
      }
    } else {
      // Adiciona nova vacina (modo edição)
      vacinas.value.push({
        id: novaVacina.id,
        nome: novaVacina.nome,
        data_aplicacao: novaVacina.data_aplicacao,
        data_proxima_dose: novaVacina.data_proxima_dose,
        fabricante: novaVacina.fabricante,
        lote: novaVacina.lote
      })
    }
  } else {
    // Adiciona nova vacina (modo novo cadastro)
    vacinas.value.push({
      id: novaVacina.id,
      nome: novaVacina.nome,
      data_aplicacao: novaVacina.data_aplicacao,
      data_proxima_dose: novaVacina.data_proxima_dose,
      fabricante: novaVacina.fabricante,
      lote: novaVacina.lote
    })
  }
  vacinaSelecionada.value = null
}




const removerVermifugo = async (item: any, index: number) => {
  try {
    if (modoEdicao.value) {
      await deletarVermifugo(item)
    }
    vermifugos.value.splice(index, 1)
  } catch (error: any) {
    alertMessage.value = error?.msg || 'Ocorreu um erro inesperado';
    alertType.value = 'error';
    showAlert.value = true;
    setTimeout(() => (showAlert.value = false), 5000);
  }
}

// TUTORES
const listTutores = ref<any[]>([])
const searchTutor = ref('')
const headersTutores = [
  { title: 'id', key: 'id' },
  { title: 'Nome', key: 'nome_completo' },
  { title: 'CPF', key: 'cpf' },
  { title: 'Data Nasc.', key: 'data_nascimento' },
  { title: 'Ação', key: 'acao', sortable: false }
]

const filteredTutores = computed(() => {
  if (!searchTutor.value) return listTutores.value
  const term = searchTutor.value.toLowerCase()
  return listTutores.value.filter(
    t =>
      t.nome_completo.toLowerCase().includes(term) ||
      t.cpf.toLowerCase().includes(term)
  )
})

// Selecionar tutor e preencher campos
function selecionarTutor(tutor: any) {
  textInputs.value['input-nome-tutor'] = tutor.nome_completo
  textInputs.value['input-cpf'] = formatCpf(tutor.cpf)
  textInputs.value['input-data-nascimento-tutor'] = tutor.data_nascimento
  textarea.value.ObservacoesGeraisTutor = tutor.observacoes
  dialogTutores.value = false
  idTutor.value = tutor.id

  const endereco = tutor.enderecos?.[0] || {}
  textInputs.value['input-cep'] = endereco.cep || ''
  textInputs.value['input-estado'] = endereco.estado || ''
  textInputs.value['input-cidade'] = endereco.cidade || ''
  textInputs.value['input-bairro'] = endereco.bairro || ''
  textInputs.value['input-rua'] = endereco.rua || ''
  textInputs.value['input-numero-endereco'] = endereco.numero || ''
  textInputs.value['input-complemento'] = endereco.complemento || ''

  const contato = tutor.contatos?.[0] || {}
  textInputs.value['input-email'] = contato.email || ''
  phones.value = contato.telefones?.map((t: any) => ({ number: formatPhoneNumberRaw(t.numero) })) || [{ number: '' }]

  bloquearEdicaoTutor.value = true;
}

const loadComboTutores = async () => {
  try {
    const response = await recuperarTutores()
    listTutores.value = response
  } finally { }
}

onMounted(async () => {
  isLoading.value = true
  await loadComboTutores()
  if (idPacienteRota && idPacienteRota > 0) {
    modoEdicao.value = true
    bloquearEdicaoTutor.value = true
    await carregarPaciente(idPacienteRota)
  }
  isLoading.value = false
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

.table-protocolo {
  max-width: 725px;
}
</style>
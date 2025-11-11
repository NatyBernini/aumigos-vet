<template>
  <v-alert v-if="showAlert" :type="alertType" class="mt-3" dismissible @click:close="showAlert = false">
    {{ alertMessage }}
  </v-alert>
  <v-card>
    <p class="title-page">Cadastro do Veterinário
      <img src="/./src/assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
    </p>

    <p class="sub-page">Veterinários / <span class="aba-atual">Cadastrar</span>
      <img src="/./src/assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
    </p>

    <v-tabs v-model="tab">
      <v-tab value="informacoes-basicas">Informações do Veterinário</v-tab>
      <v-tab value="horarios-atendimento">Horários de Atendimento</v-tab>
      <v-tab v-if="modoEdicao" value="gerenciar-veterinario">Gerenciar Veterinário</v-tab>
    </v-tabs>

    <v-card-text v-if="!isLoading">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="informacoes-basicas" class="pt-5">

          <v-form ref="formRef">
            <p>Informações Básicas</p>
            <v-col>
              <v-row class="row-info-basicas">
                <inputText label="Nome completo*" type="text" required v-model:valueInput="textInputs['input-nome']"
                  id="input-nome" @update:valueInput="(value: any) => updateInput('input-nome', value)"
                  style="width: 300px;" :ocultaContador="true" />
                <inputText label="CPF*" type="text" required v-model:valueInput="textInputs['input-cpf']" id="input-cpf"
                  @update:valueInput="(value: any) => updateInput('input-cpf', value)" @input="onInputCpf"
                  :ocultaContador="true" />
                <inputText label="RG*" type="text" required v-model:valueInput="textInputs['input-rg']" id="input-rg"
                  @update:valueInput="(value: any) => updateInput('input-rg', value)" @input="onInputRg" maxlength="12"
                  :ocultaContador="true" />

              </v-row>
              <v-row class="row-info-basicas">
                <inputText label="Especialidade*" type="text" required
                  v-model:valueInput="textInputs['input-especialidade']" id="input-especialidade"
                  @update:valueInput="(value: any) => updateInput('input-especialidade', value)" style="width: 300px;"
                  :ocultaContador="true" />

                <inputText label="CRMV*" type="text" required v-model:valueInput="textInputs['input-crmv']"
                  id="input-crmv" @update:valueInput="(value: any) => updateInput('input-crmv', value)"
                  :ocultaContador="true" />

              </v-row>
            </v-col>

            <p>Informações de Endereço</p>
            <v-col>
              <v-row class="row-info-basicas">

                <multipleCombobox v-model="estadoSelecionado" :items="listEstados" :extra-items="estados"
                  label="Estado*" variant="outlined" id="estado" :isRequired="false" :isMultipleSelect="false"
                  class="container-combobox-padrao mt-4 mb-4" placeholder="Selecione o estado"
                  style="max-width: 350px;" />

                <multipleCombobox v-model="cidadeSelecionada" :items="listCidade" :extra-items="cidades" label="Cidade*"
                  variant="outlined" id="cidade" :isRequired="false" :isMultipleSelect="false"
                  class="container-combobox-padrao mt-4 mb-4" placeholder="Selecione a cidade" style="max-width: 350px;"
                  :disabled="!estadoSelecionado" />


              </v-row>
              <v-row class="row-info-basicas">
                <inputText label="CEP*" type="text" required v-model:valueInput="textInputs['input-cep']"
                  placeholder="00000-000" id="input-cep"
                  @update:valueInput="(value: any) => updateInput('input-cep', value)" @input="onInputCep"
                  :ocultaContador="true" />

              </v-row>
              <v-row class="row-info-basicas">
                <inputText label="Bairro*" type="text" required v-model:valueInput="textInputs['input-bairro']"
                  id="input-bairro" @update:valueInput="(value: any) => updateInput('input-bairro', value)"
                  style="width: 300px;" :ocultaContador="true" />

                <inputText label="Rua*" type="text" required v-model:valueInput="textInputs['input-rua']" id="input-rua"
                  @update:valueInput="(value: any) => updateInput('input-rua', value)" style="width: 300px;"
                  :ocultaContador="true" />
              </v-row>
              <v-row class="row-info-basicas">
                <inputText label="N*" type="text" required v-model:valueInput="textInputs['input-numero']"
                  id="input-numero" @update:valueInput="(value: any) => updateInput('input-numero', value)"
                  :ocultaContador="true" />

                <inputText label="Complemento" type="text" v-model:valueInput="textInputs['input-complemento']"
                  id="input-complemento" @update:valueInput="(value: any) => updateInput('input-complemento', value)"
                  style="width: 300px;" :ocultaContador="true" />
              </v-row>
            </v-col>

            <p>Informações para Contato</p>
            <v-col>
              <v-row class="row-info-basicas" v-for="(item, index) in phones" :key="index">

                <inputText label="Telefone*" type="text" required v-model:valueInput="item.number" id="input-telefone"
                  placeholder="(00) 00000-0000" style="width: 200px;" :max-length=15 :ocultaContador="true" />
                <template v-if="!readOnly">
                  <v-btn icon @click="addPhone" v-if="index === phones.length - 1">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn icon @click="removePhone(index)" v-if="phones.length > 1">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-row>
              <v-row class="row-info-basicas">
                <inputText label="E-mail*" type="text" required v-model:valueInput="textInputs['input-email']"
                  id="input-email" @update:valueInput="(value: any) => updateInput('input-email', value)"
                  style="width: 400px;" :ocultaContador="true" />
              </v-row>
            </v-col>


            <TextArea :modelValue="textarea.ObservacoesGerais"
              @update:modelValue="(value: any) => (textarea.ObservacoesGerais = value)" label="Observações"
              class="wrap-textarea" :maxLength="300" placeholder="Detalhe algum ponto extra sobre o veterinário..." />


            <div class="container-btn mt-5">
              <p class="msg-auxiliar">Campos Obrigatórios*</p>
            </div>

          </v-form>

          <div class="container-btn mt-5 justify-end">
            <v-btn class="me-4 btn-padrao" @click="salvar()">Salvar</v-btn>
          </div>

        </v-tabs-window-item>
        <v-tabs-window-item value="horarios-atendimento" class="pt-5">
          <v-card class="card-informativo mb-7"><v-icon class="mr-2">mdi-alert-circle</v-icon>Nesta aba, você, como
            administrador, pode definir e gerenciar os horários de atendimento de cada veterinário, informando o horário
            de início e término para cada dia da semana.
          </v-card>
          <v-form>
            <div class="d-flex flex-column ga-4">
              <v-row v-for="(dia, index) in diasAtendimento" :key="index" align="center" class="mt-2 row-atendimento">
                <!-- Nome do dia -->
                <div class="check-horario-atendimento">
                  <v-checkbox v-model="dia.ativo" :label="dia.nome" hide-details density="compact" />
                </div>

                <!-- Horário de início -->
                <inputText label="Horário de Início" class="mr-5" type="time" :disabled="!dia.ativo"
                  v-model:valueInput="dia.horarioInicio" :ocultaContador="true" />

                <!-- Horário de fim -->
                <inputText label="Horário de Fim" type="time" :disabled="!dia.ativo" v-model:valueInput="dia.horarioFim"
                  :ocultaContador="true" />

              </v-row>
            </div>
          </v-form>

          <div class="container-btn mt-5 justify-end">
            <v-btn class="me-4 btn-padrao" @click="salvar()">Salvar</v-btn>
          </div>

        </v-tabs-window-item>
        <v-tabs-window-item v-if="modoEdicao" value="gerenciar-veterinario" class="pt-5">
          <v-row class="row-cards ma-0"> 
            <v-card class="pa-2 gerenciar">
              <v-card-title>Excluir veterinário</v-card-title>
              <v-card-text>Nesta aba, você, como administrador, pode excluir o cadastro do veterinário selecionado. Essa
                ação é permanente e removerá todas as informações associadas a este profissional.
              </v-card-text>

              <v-card-actions>
                <v-btn class="btn-padrao" @click="showModalConfirmation = true">Excluir veterinário</v-btn>
              </v-card-actions>
            </v-card>

            <v-card class="pa-2 gerenciar">
              <v-card-title>
                {{ ativo ? 'Desativar veterinário' : 'Ativar veterinário' }}
              </v-card-title>

              <v-card-text>
                <template v-if="ativo">
                  Nesta aba, você, como administrador, pode <strong>desativar</strong> o veterinário selecionado.
                  Essa ação impedirá que o profissional acesse o sistema ou realize atendimentos,
                  sem excluir suas informações do histórico. A qualquer momento, o veterinário
                  poderá ser reativado pelo administrador.
                </template>
                <template v-else>
                  Nesta aba, você, como administrador, pode <strong>reativar</strong> o veterinário selecionado.
                  Essa ação permitirá que o profissional volte a acessar o sistema e realize atendimentos normalmente.
                </template>
              </v-card-text>

              <v-card-actions>
                <v-btn class="btn-padrao" :color="ativo ? 'error' : 'success'"  @click="ativo ? showModalConfirmationDesativar = true : showModalConfirmationAtivar = true"
  >
                  {{ ativo ? 'Desativar veterinário' : 'Ativar veterinário' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>

        </v-tabs-window-item>

      </v-tabs-window>
    </v-card-text>
  </v-card>
  <!-- Spinner de Carregamento -->
  <v-container v-if="isLoading" class="d-flex align-center justify-center">
    <v-progress-circular indeterminate color="#ff8200" size="40" width="5"></v-progress-circular>
  </v-container>

  <modalConfirmacao v-if="!isLoading" :isOpen="showModalConfirmation" @update:isOpen="showModalConfirmation = $event"
    @confirm="deletarUsuario()" acao="o usuário será deletado permanentemente, não sendo possível recuperar" />
  <modalConfirmacao v-if="!isLoading" :isOpen="showModalConfirmationDesativar"
    @update:isOpen="showModalConfirmationDesativar = $event" @confirm="desativarUsuario()"
    acao="o usuário será desativado" />
  <modalConfirmacao v-if="!isLoading" :isOpen="showModalConfirmationAtivar"
    @update:isOpen="showModalConfirmationAtivar = $event" @confirm="ativarUsuario()"
    acao="o usuário será ativado" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatCep, limparCep, buscarEnderecoViaCep } from '../../utils/cepUtils'
import { formatCpf, formatRg, formatPhoneNumber } from '../../utils/formaUtils'
import { useAppStore } from '@/modules/commons/store'

// COMPONENTES
import inputText from '@/components/inputText.vue'
import multipleCombobox from '@/components/select.vue'
import TextArea from '@/components/textArea.vue'
import modalConfirmacao from '@/components/modalConfirmacao.vue'

// SERVICES
import { getCidadesPorEstado, getEstados } from '../../services/ibge'
import { salvarVeterinario, editarVeterinario, recuperarVeterinario, deletarVeterinario } from '@/services/veterinario'

defineOptions({ name: 'VeterinarioCadastro' })

const tab = ref(null)
const readOnly = ref(false)
const formRef = ref()
const appStore = useAppStore()
const route = useRoute()
const isLoading = ref(false)
const showModalConfirmation = ref(false)
const showModalConfirmationAtivar = ref(false)
const showModalConfirmationDesativar = ref(false)
const router = useRouter()
const ativo = ref(true)

// ID vindo da rota (0 = novo cadastro)
const idVeterinarioRota = Number(route.params.id) || 0
const modoEdicao = ref(idVeterinarioRota > 0)

const estados = ref<Array<any>>([])
const listEstados = ref<string[]>([])
const cidades = ref<Array<{ id: string; descricao: string }>>([])
const listCidade = ref<string[]>([])

const phones = ref([{ number: '' }])
const textarea = ref({ ObservacoesGerais: '' })
const textInputs = ref<Record<string, string>>({})

const updateInput = (id: string, newValue: string) => {
  textInputs.value[id] = newValue
}

// Alertas
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error')

const estadoSelecionado = ref<string | undefined>(undefined)
const cidadeSelecionada = ref<string | undefined>(undefined)

const diasAtendimento = ref([
  { nome: 'Domingo', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Segunda-feira', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Terça-feira', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Quarta-feira', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Quinta-feira', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Sexta-feira', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Sábado', ativo: false, horarioInicio: '', horarioFim: '' }
])

// --- FUNÇÕES DE FORMATAÇÃO E CAMPOS ---
function addPhone() {
  phones.value.push({ number: '' })
}
function removePhone(index: number) {
  phones.value.splice(index, 1)
}
function onInputCpf(e: Event) {
  const input = e.target as HTMLInputElement
  textInputs.value['input-cpf'] = formatCpf(input.value)
}
function onInputRg(e: Event) {
  const input = e.target as HTMLInputElement
  textInputs.value['input-rg'] = formatRg(input.value)
}
async function onInputCep(e: Event) {
  const input = e.target as HTMLInputElement
  const valorFormatado = formatCep(input.value)
  const cepLimpo = limparCep(valorFormatado)

  if (cepLimpo.length === 8) {
    try {
      const data = await buscarEnderecoViaCep(cepLimpo)
      textInputs.value['input-rua'] = data.logradouro || ''
      textInputs.value['input-bairro'] = data.bairro || ''
      const estadoEncontrado = estados.value.find(
        (estado: { id: string; descricao: string }) =>
          estado.descricao.includes(`(${data.uf})`)
      )
      if (estadoEncontrado) {
        estadoSelecionado.value = estadoEncontrado.descricao
        await nextTick()
        const resposta = await getCidadesPorEstado(estadoEncontrado.id)
        listCidade.value = resposta.map((c: any) => `${c.nome}`)
        cidades.value = resposta.map((c: any) => ({ id: c.nome, descricao: c.nome }))
        cidadeSelecionada.value = data.localidade
      }
    } catch {
      estadoSelecionado.value = undefined
      cidadeSelecionada.value = undefined
    }
  }
}

async function carregarEstados() {
  const resposta = await getEstados()
  listEstados.value = resposta.map((e: any) => `${e.nome} (${e.sigla})`)
  estados.value = resposta.map((e: any) => ({
    id: e.sigla,
    descricao: `${e.nome} (${e.sigla})`
  }))
}

async function carregarCidades() {
  if (!estadoSelecionado.value) return
  const estadoEncontrado = estados.value.find(
    (estado: { id: string; descricao: string }) =>
      estado.descricao === estadoSelecionado.value
  )
  if (estadoEncontrado) {
    const resposta = await getCidadesPorEstado(estadoEncontrado.id)
    listCidade.value = resposta.map((c: any) => `${c.nome}`)
    cidades.value = resposta.map((c: any) => ({ id: c.id, descricao: c.nome }))
  }
}

const validation = () => {

  // Validação de campos obrigatórios do veterinário
  const obrigatorios = {
    'Nome completo': textInputs.value['input-nome'],
    'CPF': textInputs.value['input-cpf'],
    'RG': textInputs.value['input-rg'],
    'CRMV': textInputs.value['input-crmv'],
    'Especialidade': textInputs.value['input-especialidade'],
    'E-mail': textInputs.value['input-email'],
    'CEP': textInputs.value['input-cep'],
    'Estado': estadoSelecionado.value,
    'Cidade': cidadeSelecionada.value,
    'Bairro': textInputs.value['input-bairro'],
    'Rua': textInputs.value['input-rua'],
    'Número': textInputs.value['input-numero']
  }

  for (const [campo, valor] of Object.entries(obrigatorios)) {
    if (!valor || valor.trim() === '') {
      alertMessage.value = `Por favor, preencha o campo obrigatório: ${campo}.`
      alertType.value = 'warning'
      showAlert.value = true
      setTimeout(() => (showAlert.value = false), 3000)
      return false
    }
  }

  // Validação de telefones
  const telefonesValidos = phones.value.filter(t => t.number.trim() !== '')
  if (telefonesValidos.length === 0) {
    alertMessage.value = 'Informe pelo menos um número de telefone.'
    alertType.value = 'warning'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 3000)
    return false
  }

  // Validação de dias e horários
  const algumDiaAtivo = diasAtendimento.value.some(dia => dia.ativo)

  if (!algumDiaAtivo) {
    alertMessage.value = 'Por favor, selecione pelo menos um dia de atendimento.'
    alertType.value = 'warning'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 3000)
    return false
  }

  for (const dia of diasAtendimento.value) {
    const inicio = dia.horarioInicio?.trim()
    const fim = dia.horarioFim?.trim()

    if (dia.ativo && (!inicio || !fim)) {
      alertMessage.value = `Por favor, preencha o horário de início e fim para ${dia.nome}.`
      alertType.value = 'warning'
      showAlert.value = true
      setTimeout(() => (showAlert.value = false), 3000)
      return false
    }
  }

  return true
}

const salvar = async () => {
  // --- VALIDAÇÃO ---
  if (!validation()) return

  try {
    const diasAtendimentoFormatado: Record<string, { inicio: string; fim: string }> = {}
    diasAtendimento.value.forEach(dia => {
      if (dia.ativo && dia.horarioInicio && dia.horarioFim) {
        const nomeDia = dia.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        diasAtendimentoFormatado[nomeDia] = {
          inicio: dia.horarioInicio,
          fim: dia.horarioFim
        }
      }
    })

    const dados = {
      nome_completo: textInputs.value['input-nome'],
      cpf: textInputs.value['input-cpf'],
      rg: textInputs.value['input-rg'],
      crmv: textInputs.value['input-crmv'],
      especialidade: textInputs.value['input-especialidade'],
      dias_atendimento: diasAtendimentoFormatado,
      clinica: appStore.userData?.clinicas[0]?.id,
      observacao: textarea.value.ObservacoesGerais,
      ativo: ativo.value,
      enderecos: [{
        cep: textInputs.value['input-cep'],
        estado: estadoSelecionado.value || '',
        cidade: cidadeSelecionada.value || '',
        bairro: textInputs.value['input-bairro'],
        rua: textInputs.value['input-rua'],
        numero: textInputs.value['input-numero'],
        complemento: textInputs.value['input-complemento']
      }],
      contatos: [{
        email: textInputs.value['input-email'],
        telefones: phones.value
          .filter(t => t.number.trim() !== '')
          .map(t => ({ numero: t.number }))
      }]
    }

    if (modoEdicao.value) {
      await editarVeterinario(idVeterinarioRota, dados)
      alertMessage.value = 'Veterinário atualizado com sucesso!'
    } else {
      await salvarVeterinario(dados)
      alertMessage.value = 'Veterinário salvo com sucesso!'
      router.push({ path: '/veterinarios' })
    }

    alertType.value = 'success'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 3000)

  } catch (error: any) {
    let mensagemErro = 'Erro ao salvar o veterinário.'
    console.error("ERRO:", error)

    const erros = error.errors || error.response?.data || error.data
    if (erros && typeof erros === 'object') {
      const mensagens: string[] = []

      const parseErros = (obj: any, prefix = '') => {
        Object.entries(obj).forEach(([campo, valor]) => {
          if (Array.isArray(valor) && typeof valor[0] === 'string') {
            mensagens.push(`${prefix}${campo.toUpperCase()}: ${valor.join(', ')}`)
          }

          // array de objetos (como contatos ou telefones)
          else if (Array.isArray(valor) && typeof valor[0] === 'object') {
            valor.forEach((subObj: any, idx: number) => {
              const novoPrefix = `${prefix}${campo} ${idx + 1} - `
              parseErros(subObj, novoPrefix)
            })
          }

          // objeto aninhado (como "numero" dentro de "telefones")
          else if (typeof valor === 'object' && valor !== null) {
            parseErros(valor, `${prefix}${campo} - `)
          }

          else if (typeof valor === 'string') {
            mensagens.push(`${prefix}${campo.toUpperCase()}: ${valor}`)
          }
        })
      }

      parseErros(erros)

      if (mensagens.length > 0) {
        mensagemErro = mensagens.join('\n')
      }
    }

    alertMessage.value = mensagemErro
    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  }
}

const carregarVeterinario = async () => {
  if (!modoEdicao.value) return
  try {
    const vet = await recuperarVeterinario(idVeterinarioRota)
    textInputs.value['input-nome'] = vet.nome_completo
    textInputs.value['input-cpf'] = formatCpf(vet.cpf)
    textInputs.value['input-rg'] = vet.rg
    textInputs.value['input-crmv'] = vet.crmv
    textInputs.value['input-especialidade'] = vet.especialidade
    textarea.value.ObservacoesGerais = vet.observacao || ''
    ativo.value = vet.ativo

    // Telefones
    if (vet.contatos?.length) {
      const contato = vet.contatos[0]
      textInputs.value['input-email'] = contato.email || ''
      phones.value = contato.telefones?.map((t: any) => ({ number: formatPhoneNumber(t.numero) })) || [{ number: '' }]
    }

    // Endereço
    const end = vet.enderecos?.[0]
    if (end) {
      textInputs.value['input-cep'] = end.cep
      textInputs.value['input-bairro'] = end.bairro
      textInputs.value['input-rua'] = end.rua
      textInputs.value['input-numero'] = end.numero
      textInputs.value['input-complemento'] = end.complemento
      estadoSelecionado.value = end.estado
      await nextTick()
      cidadeSelecionada.value = end.cidade
    }

    // Dias de atendimento
    if (vet.dias_atendimento) {
      diasAtendimento.value.forEach(dia => {
        const key = dia.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        if (vet.dias_atendimento[key]) {
          dia.ativo = true
          dia.horarioInicio = vet.dias_atendimento[key].inicio
          dia.horarioFim = vet.dias_atendimento[key].fim
        }
      })
    }
  } catch {
    alertMessage.value = 'Erro ao carregar dados do veterinário.'
    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  }
}

const deletarUsuario = async () => {

  try {
    await deletarVeterinario(idVeterinarioRota)
    alertMessage.value = 'Veterinário deletado com sucesso.'
    alertType.value = 'success'
    showAlert.value = true
    router.push({ path: '/veterinarios' })
    setTimeout(() => (showAlert.value = false), 3000)

  } catch (err) {
    alertMessage.value = 'Erro ao deletar veterinário.'
    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  }
}

const desativarUsuario = async () => {
  ativo.value = false
  await salvar()
}

const ativarUsuario = async () => {
  ativo.value = true
  await salvar()
}
// --- WATCHERS ---
watch(estadoSelecionado, () => carregarCidades())
watch(phones, newPhones => {
  newPhones.forEach((item, index) => {
    const formatted = formatPhoneNumber(item.number)
    if (formatted !== item.number) phones.value[index].number = formatted
  })
}, { deep: true })

onMounted(async () => {
  isLoading.value = true
  await carregarEstados()
  if (modoEdicao.value) await carregarVeterinario()
  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.row-atendimento {
  gap: 1rem;

  .check-horario-atendimento {
    min-width: 200px;
  }
}

.row-cards {
  gap: 40px;
}

.v-card.gerenciar {
  border: 2px solid #ffc38b;
  border-radius: 10px;
  max-width: 400px;

  .v-card-title {
    color: #2e2e2e !important;
    font-size: 14px !important;
    font-weight: 600;
  }

  .v-card-actions {
    justify-content: flex-end;
  }
}
</style>

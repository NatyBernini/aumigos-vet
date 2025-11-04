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
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="informacoes-basicas" class="pt-5">

          <v-form ref="formRef" @submit.prevent="submit">
            <p>Informações Básicas</p>
            <v-col>
              <v-row class="row-info-basicas">
                <inputText label="Nome completo*" type="text" required v-model:valueInput="textInputs['input-nome']"
                  id="input-nome" @update:valueInput="(value: any) => updateInput('input-nome', value)"
                  style="width: 300px;" :max-length="0" />
                <inputText label="CPF*" type="text" required v-model:valueInput="textInputs['input-cpf']" id="input-cpf"
                  @update:valueInput="(value: any) => updateInput('input-cpf', value)" @input="onInputCpf"
                  :max-length="0" />
                <inputText label="RG*" type="text" required v-model:valueInput="textInputs['input-rg']" id="input-rg"
                  @update:valueInput="(value: any) => updateInput('input-rg', value)" @input="onInputRg" maxlength="12"
                  :max-length="0" />

              </v-row>
              <v-row class="row-info-basicas">
                <inputText label="Especialidade*" type="text" required
                  v-model:valueInput="textInputs['input-especialidade']" id="input-especialidade"
                  @update:valueInput="(value: any) => updateInput('input-especialidade', value)" style="width: 300px;"
                  :max-length="0" />

                <inputText label="CRMV*" type="text" required v-model:valueInput="textInputs['input-crmv']"
                  id="input-crmv" @update:valueInput="(value: any) => updateInput('input-crmv', value)"
                  :max-length="0" />

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
                  :max-length="0" />

              </v-row>
              <v-row class="row-info-basicas">
                <inputText label="Bairro*" type="text" required v-model:valueInput="textInputs['input-bairro']"
                  id="input-bairro" @update:valueInput="(value: any) => updateInput('input-bairro', value)"
                  style="width: 300px;" :max-length="0" />

                <inputText label="Rua*" type="text" required v-model:valueInput="textInputs['input-rua']" id="input-rua"
                  @update:valueInput="(value: any) => updateInput('input-rua', value)" style="width: 300px;"
                  :max-length="0" />
              </v-row>
              <v-row class="row-info-basicas">
                <inputText label="N*" type="text" required v-model:valueInput="textInputs['input-numero']"
                  id="input-numero" @update:valueInput="(value: any) => updateInput('input-numero', value)"
                  :max-length="0" />

                <inputText label="Complemento*" type="text" required
                  v-model:valueInput="textInputs['input-complemento']" id="input-complemento"
                  @update:valueInput="(value: any) => updateInput('input-complemento', value)" style="width: 300px;"
                  :max-length="0" />
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

            <div class="container-btn mt-5">
              <v-btn class="me-4 btn-padrao" @click="salvar()">Salvar</v-btn>
            </div>
          </v-form>

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

        </v-tabs-window-item>


        <div class="container-btn mt-5">
          <v-btn class="me-4 btn-padrao" @click="salvar()">Salvar</v-btn>
        </div>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { formatCep, limparCep, buscarEnderecoViaCep } from '../../utils/cepUtils'
import { formatCpf, formatRg, formatPhoneNumber } from '../../utils/formaUtils'
import { useAppStore } from '@/modules/commons/store'

// COMPONENTES
import inputText from '@/components/inputText.vue'
import multipleCombobox from '@/components/select.vue'
import TextArea from '@/components/textArea.vue'

// SERVICES
import { getCidadesPorEstado, getEstados, getEnderecoPorCep } from '../../services/ibge'
import { salvarVeterinario, editarVeterinario, recuperarVeterinario, recuperarVeterinarios, deletarVeterinario } from '@/services/veterinario'

defineOptions({ name: 'VeterinarioCadastro' })

const tab = ref(null)
const readOnly = ref(false)
const formRef = ref()
const appStore = useAppStore()

const estados = ref<Array<any>>([])
const listEstados = ref<string[]>([])
const cidades = ref<Array<{ id: string; descricao: string }>>([])
const listCidade = ref<string[]>([])

const phones = ref([{ number: '' }])
const textarea = ref({ ObservacoesGerais: '' })

const textInputs = ref<Record<string, string>>({});
const updateInput = (id: string, newValue: string) => {
  textInputs.value[id] = newValue;
};

// Controle de alertas e mensagens
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error')


// Agora selecionados guardam o objeto, não string
const estadoSelecionado = ref<string | undefined>(undefined)
const cidadeSelecionada = ref<string | undefined>(undefined)

// Estrutura dos dias da semana com horários
const diasAtendimento = ref([
  { nome: 'Domingo', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Segunda-feira', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Terça-feira', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Quarta-feira', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Quinta-feira', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Sexta-feira', ativo: false, horarioInicio: '', horarioFim: '' },
  { nome: 'Sábado', ativo: false, horarioInicio: '', horarioFim: '' }
])


async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
}

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

      // Procura o estado na lista de estados
      const estadoEncontrado = estados.value.find(
        (estado: { id: string; descricao: string }) =>
          estado.descricao === `${data.estado} (${data.uf})`
      )

      if (estadoEncontrado) {
        estadoSelecionado.value = estadoEncontrado.descricao

        // Espera o nextTick para garantir que o v-model do combobox atualize
        await nextTick()

        // Carrega as cidades do estado encontrado
        const resposta = await getCidadesPorEstado(estadoEncontrado.id)
        listCidade.value = resposta.map((cidade: any) => `${cidade.nome}`)
        cidades.value = resposta.map((cidade: any) => ({
          id: cidade.nome,
          descricao: cidade.nome,
        }))

        // Seleciona a cidade retornada pelo CEP
        const cidadeEncontrada = cidades.value.find(
          (c: { id: string; descricao: string }) => c.descricao === data.localidade
        )
        cidadeSelecionada.value = cidadeEncontrada ? cidadeEncontrada.descricao : undefined
      }
    } catch {
      textInputs.value['input-rua'] = ''
      textInputs.value['input-bairro'] = ''
      estadoSelecionado.value = undefined
      cidadeSelecionada.value = undefined
    }
  } else {
    textInputs.value['input-rua'] = ''
    textInputs.value['input-bairro'] = ''
    estadoSelecionado.value = undefined
    cidadeSelecionada.value = undefined
  }
}


// Carregar cidades com base no estado selecionado
async function carregarEstados() {
  const resposta = await getEstados()
  listEstados.value = resposta.map((estado: any) => (`${estado.nome} (${estado.sigla})`))
  estados.value = resposta.map((estado: any) => ({
    id: estado.sigla,
    descricao: `${estado.nome} (${estado.sigla})`,
  }))
}

async function carregarCidades() {
  if (estadoSelecionado.value) {
    // Procura o estado na lista de estados pelo campo descricao
    const estadoEncontrado = estados.value.find(
      (estado: { id: string; descricao: string }) => estado.descricao === estadoSelecionado.value
    )

    const estadoId = estadoEncontrado ? estadoEncontrado.id : null
    console.log("Estado selecionado ID:", estadoId)

    if (estadoId) {
      const resposta = await getCidadesPorEstado(estadoId)
      listCidade.value = resposta.map((cidade: any) => (`${cidade.nome}`))
      cidades.value = resposta.map((cidade: any) => ({
        id: cidade.id,
        descricao: cidade.nome,
      }))
    } else {
      cidades.value = []
      cidadeSelecionada.value = undefined
    }
  } else {
    cidades.value = []
    cidadeSelecionada.value = undefined
  }
}

const salvar = async () => {
  try {
    // Monta o objeto dias_atendimento no formato esperado
    const diasAtendimentoFormatado: Record<string, { inicio: string; fim: string }> = {}

    diasAtendimento.value.forEach(dia => {
      if (dia.ativo && dia.horarioInicio && dia.horarioFim) {
        // Normaliza o nome do dia para minúsculas (sem acento, se quiser)
        const nomeDia = dia.nome
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // remove acentos (ex: "terça-feira" -> "terca-feira")

        diasAtendimentoFormatado[nomeDia] = {
          inicio: dia.horarioInicio,
          fim: dia.horarioFim
        }
      }
    })

    // Define o primeiro horário ativo como início/fim (se houver)
    const primeiroHorario = diasAtendimento.value.find(d => d.ativo)
    const horarioInicio = primeiroHorario ? `${primeiroHorario.horarioInicio}:00.000Z` : null
    const horarioFim = primeiroHorario ? `${primeiroHorario.horarioFim}:00.000Z` : null

    // Monta o payload conforme o endpoint
    const dados = {
      nome_completo: textInputs.value['input-nome'],
      cpf: textInputs.value['input-cpf'],
      rg: textInputs.value['input-rg'],
      crmv: textInputs.value['input-crmv'],
      especialidade: textInputs.value['input-especialidade'],
      dias_atendimento: diasAtendimentoFormatado,
      clinica: appStore.userData?.clinicas[0]?.id, 
      observacao: textarea.value.ObservacoesGerais,
      ativo: true,

      // Endereço
      enderecos: [
        {
          cep: textInputs.value['input-cep'],
          estado: estadoSelecionado.value || '',
          cidade: cidadeSelecionada.value || '',
          bairro: textInputs.value['input-bairro'],
          rua: textInputs.value['input-rua'],
          numero: textInputs.value['input-numero'],
          complemento: textInputs.value['input-complemento'],
        },
      ],

      // Contato
      contatos: [
        {
          email: textInputs.value['input-email'],
          telefones: phones.value
            .filter(t => t.number.trim() !== '')
            .map(t => ({ numero: t.number })),
        },
      ],
    }

    console.log('Payload enviado:', dados)

    const response = await salvarVeterinario(dados);

    alertMessage.value = 'Veterinário salvo com sucesso!'
    alertType.value = 'success'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 3000)
  } catch (error: any) {
    if (error.tipo === 'VALIDATION' && error.errors) {
      const firstKey = Object.keys(error.errors)[0]
      alertMessage.value = error.errors[firstKey][0]
    } else if (error.tipo === 'ERROR') {
      alertMessage.value = error.msg
    } else {
      alertMessage.value = 'Ocorreu um erro inesperado ao salvar o veterinário.'
    }

    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  }
}


const recuperaVeterinario = async () => {
  try {
    const response = await recuperarVeterinario(0);
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

watch(estadoSelecionado, () => {
  if (estadoSelecionado.value) {
    cidadeSelecionada.value = undefined
    carregarCidades()
  } else {
    cidadeSelecionada.value = undefined
  }
})

watch(phones, (newPhones) => {
  newPhones.forEach((item, index) => {
    const formatted = formatPhoneNumber(item.number)
    if (formatted !== item.number) phones.value[index].number = formatted
  })
}, { deep: true })

onMounted(async () => {
  carregarEstados();
  // recuperaVeterinario();
})
</script>



<style lang="scss">
.row-atendimento {
  gap: 1rem;

  .check-horario-atendimento {
    min-width: 200px;
  }
}
</style>

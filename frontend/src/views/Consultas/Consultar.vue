<template>
  <v-card>
    <p class="title-page">
      Cadastro de Consulta
      <img src="/src/assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
    </p>
    <p class="sub-page">Consultas / <span class="aba-atual">Cadastrar</span>
      <img src="/./src/assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
    </p>
    <v-tabs v-model="tab">
      <v-tab value="dados">Dados Básicos</v-tab>
      <v-tab value="anamnese">Anamnese Sistemas</v-tab>
      <v-tab value="historico">Histórico Clínico e Exame Físico</v-tab>
      <v-tab value="servicos">Serviços e Produtos</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="dados" class="pt-5">
          <v-form ref="formRef" @submit.prevent="submit">
            <v-row class="row-info-basicas">

              <combo v-model="pacienteSelecionado" :items="pacientes" :extra-items="pacientes" label="Paciente*"
                variant="outlined" id="animal" :isRequired="false" :isMultipleSelect="false"
                class="container-combobox-padrao" placeholder="Selecione o Paciente" max-width="300px" />

              <combo v-model="responsavelAtendimento" :items="veterinarios" :extra-items="veterinarios"
                label="Veterinário*" variant="outlined" id="animal" :isRequired="false" :isMultipleSelect="false"
                class="container-combobox-padrao" placeholder="Selecione um veterinário" max-width="300px" />
              <div>
                <v-text-field v-model="dataAtendimento" label="Data da Consulta" type="date" :max="hoje"
                  :rules="[validarDataMax]" max-width="350px" @input="validarCampo" />
                <span v-if="erroData" style="color: red; font-size: 0.9em;">
                  {{ erroData }}
                </span>
              </div>

              <v-text-field v-model="horaConsulta" label="Hora da Consulta*" type="time" :rules="required" dense
                outlined max-width="200px" />
            </v-row>


            <v-row class="row-info-basicas">
              <textArea :modelValue="textarea.queixa" @update:modelValue="(value: any) => (textarea.queixa = value)"
                :label="'Queixa Principal / Histórico recente'" class="wrap-textarea" :maxLength="300"
                placeholder="Detalhe mais sobre as queixas principais..">
                        </textArea>

              <textArea :modelValue="textarea.suspeitaClinica"
                @update:modelValue="(value: any) => (textarea.suspeitaClinica = value)" :label="'Suspeita Clínica'"
                class="wrap-textarea" :maxLength="300" placeholder="Detalhe mais sobre a suspeita clínica..">
                        </textArea>
            </v-row>

            <v-row class="row-info-basicas">

              <textArea :modelValue="textarea.exames" @update:modelValue="(value: any) => (textarea.exames = value)"
                :label="'Exames Realizados'" class="wrap-textarea" :maxLength="300"
                placeholder="Detalhe mais sobre os exames realizados..">
                        </textArea>
              <textArea :modelValue="textarea.tratamento"
                @update:modelValue="(value: any) => (textarea.tratamento = value)" :label="'Tratamento Estabelecido'"
                class="wrap-textarea" :maxLength="300" placeholder="Detalhe mais sobre o tratamento estabelecido..">
                        </textArea>
            </v-row>



            <v-row class="row-info-basicas">
              <textArea :modelValue="textarea.prognostico"
                @update:modelValue="(value: any) => (textarea.prognostico = value)" :label="'Prognóstico'"
                class="wrap-textarea" :maxLength="300" placeholder="Detalhe mais sobre o prognóstico..">
                        </textArea>
              <textArea :modelValue="textarea.destinacao"
                @update:modelValue="(value: any) => (textarea.destinacao = value)" :label="'Destinação do Paciente'"
                class="wrap-textarea" :maxLength="300" placeholder="Detalhe mais sobre a destinação do paciente..">
                        </textArea>
            </v-row>

            <v-row class="mt-4 row-info-basicas">
              <label class="me-4">Retorno?</label>
              <v-radio-group v-model="temRetorno" inline>
                <v-radio label="Sim" value="sim" />
                <v-radio label="Não" value="nao" />
              </v-radio-group>
            </v-row>

            <v-row class="row-info-basicas mt-4">
              <v-text-field v-if="temRetorno === 'sim'" v-model="dataRetorno" label="Data do Retorno" type="date" dense
                outlined max-width="190px" />
              <v-text-field v-if="temRetorno === 'sim'" v-model="motivoRetorno" label="Motivo do Retorno" dense outlined
                max-width="500px" />
            </v-row>
          </v-form>
        </v-tabs-window-item>

        <v-tabs-window-item value="anamnese" class="pt-5"> <v-form>
            <div class="d-flex flex-row flex-wrap ga-10">
              <div v-for="(sistema, index) in sistemas" :key="index">
                <v-col>
                  <!-- Checkbox de ativação do sistema -->
                  <v-checkbox v-model="sistemaSelecionado[index]" :label="sistema.nome" hide-details
                    density="compact" />

                  <!-- Checkboxes do checklist do sistema -->
                  <v-row>
                    <v-col class="container-sintomas mt-7">
                      <v-checkbox v-for="(item, idx) in sistema.checklist" :key="idx" v-model="sistemaChecks[index]"
                        :label="item" :value="item" :disabled="!sistemaSelecionado[index]" hide-details
                        density="compact" />
                    </v-col>
                  </v-row>
                </v-col>
              </div>
            </div>
          </v-form>

        </v-tabs-window-item>

        <v-tabs-window-item value="historico" class="pt-5">
          <v-form>
            <h3 class="mb-2">Histórico Clínico</h3>
            <div class="d-flex flex-row flex-wrap ga-8">
              <div v-for="(campo, index) in historicoCampos" :key="index">
                <v-col class="align-center">
                  <span class="font-weight-medium">{{ campo.label }}</span>
                  <v-row class="mt-2">
                    <v-radio-group v-model="campo.resposta" inline density="compact">
                      <v-radio label="Sim" value="sim" class="mr-4" />
                      <v-radio label="Não" value="nao" />
                    </v-radio-group>
                    <v-text-field :disabled="campo.resposta !== 'sim'" v-model="campo.especificar" width="300px"
                      label="Especificar" dense outlined class="mt-2 ml-8" />
                  </v-row>

                </v-col>
              </div>
            </div>


            <h3 class="mt-10 mb-4">Exame Físico</h3>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="exameFisico.alimentacao" label="Alimentação" dense outlined />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="exameFisico.urina" label="Urina" dense outlined />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="exameFisico.fezes" label="Fezes" dense outlined />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="exameFisico.vomito" label="Vômito" dense outlined />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="exameFisico.fc" label="Frequência Cardíaca (FC)" dense outlined />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="exameFisico.fr" label="Frequência Respiratória (FR)" dense outlined />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="exameFisico.temperatura" label="Temperatura" dense outlined />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="exameFisico.linfonodos" label="Linfonodos" dense outlined />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="exameFisico.outros" label="Outros" dense outlined />
              </v-col>
            </v-row>

            <h4 class="mt-8 mb-2">Alimentação</h4>
            <v-row>
              <v-checkbox v-model="alimentacaoSelecionada" v-for="(opcao, index) in opcoesAlimentacao" :key="index"
                :label="opcao" :value="opcao" hide-details />
            </v-row>

            <v-textarea v-if="alimentacaoSelecionada.includes('Outros')" v-model="alimentacaoOutros" width="400px"
              label="Especificar outros" dense outlined class="mt-2" />
          </v-form>
        </v-tabs-window-item>

        <v-tabs-window-item value="servicos" class="pt-5">
          <p class="subtitle-padrao">Produtos</p>
          <v-card class="card-informativo mt-2" v-if="!produtosExtras.length"><v-icon
              class="mr-2">mdi-alert-circle</v-icon>Para adicionar um ou mais produtos, clique no botão abaixo.</v-card>
          <v-row class="ma-0 mt-5 mb-5 row-btn-produtos">
            <v-btn class="btn-padrao" @click="dialog = true">
              Adicionar Produto
            </v-btn>
            <v-btn v-if="produtosExtras.length" class="btn-padrao" type="submit" @click=" produtosExtras = []">
              Remover Todos os Produtos
            </v-btn>
          </v-row>

          <v-card class="card-resumo-consulta" v-if="produtosExtras.length">
            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th class="text-center">Qtd</th>
                    <th class="text-right">Total</th>
                    <th class="text-center">Remover</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in produtosExtras" :key="index">
                    <td>{{ item.nome }}</td>
                    <td class="text-center">{{ item.qtd }}</td>
                    <td class="text-right">{{ formatCurrency(item.total) }}</td>
                    <td class="text-center">
                      <v-btn icon="mdi-close" size="small" variant="tonal" @click="removeProduto(item)" />
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <p class="title-page mt-10">
                TOTAL: {{ formatCurrency(totalGeral) }}
              </p>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

      </v-tabs-window>
    </v-card-text>

    <v-dialog v-model="dialog" max-width="900px">
      <v-card class="pa-5">
        <v-card-title>
          <span class="text-h6">Adicionar Produto</span>
          <v-btn text @click="dialog = false">X</v-btn>
        </v-card-title>
        <v-card-text>
          <!-- Campo de pesquisa -->
          <v-text-field v-model="search" label="Pesquisar por nome ou categoria" prepend-inner-icon="mdi-magnify"
            clearable />

          <!-- Lista de produtos -->
          <v-data-table :items-per-page="-1">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th class="text-center">Preço</th>
                <th class="text-center">Qtd</th>
                <th class="text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(produto, i) in paginatedProducts" :key="i">
                <td>{{ produto.nome }}</td>
                <td>{{ produto.categoria }}</td>
                <td class="text-center">{{ formatCurrency(produto.preco) }}</td>
                <td class="text-center">
                  <v-text-field v-model.number="quantidades[produto.nome]" type="number" min="1" density="compact"
                    style="max-width: 70px" />
                </td>
                <td class="text-center">
                  <v-btn icon="mdi-plus" size="small" variant="tonal" color="primary" @click="addProduto(produto)" />
                </td>
              </tr>
            </tbody>

            <!-- Rodapé com paginação -->
            <template #bottom>
              <div class="custom-footer">
                <span>{{ startIndex }} - {{ endIndex }} de {{ filteredProducts.length }}</span>


                <!-- Navegação manual -->
                <div class="container-pagination">
                  <v-btn class="btn-pagination" icon @click="prevPage" :disabled="page <= 1">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn class="btn-pagination" icon @click="nextPage" :disabled="page >= pageCount">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>

                <v-select v-model="itemsPerPage" :items="[5, 10, 20]" label="Itens por página" density="compact"
                  hide-details variant="outlined" style="max-width: 90px; margin-left: 8px" />

              </div>
            </template>
          </v-data-table>


          <!-- Mensagem de feedback -->
          <v-snackbar v-model="snackbar" timeout="2000" color="success">
            Produto adicionado!
          </v-snackbar>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

// COMPONENTES
import combo from '@/components/select.vue'
import textArea from '@/components/textArea.vue'
import inputText from '@/components/inputText.vue'

// SERVICES
import { formatCurrency } from '@/utils/formaUtils'

const tab = ref('dados')
const formRef = ref()

const required = [(v: string) => !!v || 'Campo obrigatório']

// Dados simulados
const pacientes = ['Tigrinho', 'Frajola', 'Mingau']
const veterinarios = ['Dr. Ana', 'Dr. João', 'Dr. Carla']
const dialog = ref(false)
const search = ref("")
const snackbar = ref(false)

// Campos do formulário
const pacienteSelecionado = ref()
const responsavelAtendimento = ref()
const dataAtendimento = ref('')
const hoje = new Date().toISOString().split('T')[0]
const horaConsulta = ref('')
const textarea = ref({ queixa: '', suspeitaClinica: '', exames: '', tratamento: '', prognostico: '', destinacao: '' })
const temRetorno = ref('nao')
const dataRetorno = ref('')
const motivoRetorno = ref('')

const page = ref(1)
const itemsPerPage = ref(5)

watch(itemsPerPage, () => {
  page.value = 1
})

const pageCount = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage.value)
)

const startIndex = computed(() =>
  filteredProducts.value.length === 0 ? 0 : (page.value - 1) * itemsPerPage.value + 1
)

const endIndex = computed(() =>
  Math.min(page.value * itemsPerPage.value, filteredProducts.value.length)
)

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

function nextPage() {
  if (page.value < pageCount.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}


// interface
interface ItemConsulta {
  nome: string
  qtd: number
  total: number
}
interface Produto {
  nome: string
  categoria: string
  preco: number
}


const produtosExtras = ref<ItemConsulta[]>([])

// Lista de produtos disponíveis
const produtos = ref<Produto[]>([
  { nome: "Ração Premium", categoria: "Alimento", preco: 200 },
  { nome: "Coleira Anti-Pulgas", categoria: "Acessório", preco: 80 },
  { nome: "Vacina Gripe Canina", categoria: "Vacina", preco: 100 },
  { nome: "Sachê KelCat", categoria: "Alimento", preco: 2.89 },
  { nome: "Banho e Tosa", categoria: "Serviço", preco: 50 },
  { nome: "Ração Úmida Quatree Supreme para Cachorros Adultos", categoria: "Alimento", preco: 3.49 },
  { nome: "Vacina Gripe Canina", categoria: "Vacina", preco: 100 },
  { nome: "Sachê KelCat", categoria: "Alimento", preco: 2.89 },
  { nome: "Ração Premium", categoria: "Alimento", preco: 200 },
  { nome: "Coleira Anti-Pulgas", categoria: "Acessório", preco: 80 },
  { nome: "Vacina Gripe Canina", categoria: "Vacina", preco: 100 },
  { nome: "Sachê KelCat", categoria: "Alimento", preco: 2.89 },
  { nome: "Banho e Tosa", categoria: "Serviço", preco: 50 },
])
// Quantidades temporárias no modal
const quantidades = reactive<Record<string, number>>({})

// Função para remover 1 unidade do produto
const removeProduto = (item: ItemConsulta) => {
  const produto = produtosExtras.value.find((p) => p.nome === item.nome)
  if (!produto) return

  if (produto.qtd > 1) {
    produto.qtd -= 1
    produto.total -= produto.total / (produto.qtd + 1) // recalcula o valor unitário e diminui
  } else {
    produtosExtras.value = produtosExtras.value.filter((p) => p.nome !== item.nome)
  }
}
// Filtrar produtos por nome ou categoria
const filteredProducts = computed(() => {
  if (!search.value) return produtos.value
  return produtos.value.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.value.toLowerCase()) ||
      p.categoria.toLowerCase().includes(search.value.toLowerCase())
  )
})

// Função para adicionar produto à lista de extras
const addProduto = (produto: Produto) => {
  const qtd = quantidades[produto.nome] && quantidades[produto.nome] > 0 ? quantidades[produto.nome] : 1
  const existente = produtosExtras.value.find((p) => p.nome === produto.nome)

  if (existente) {
    existente.qtd += qtd
    existente.total += produto.preco * qtd
  } else {
    produtosExtras.value.push({
      nome: produto.nome,
      qtd,
      total: produto.preco * qtd,
    })
  }

  // Resetar quantidade para 1
  quantidades[produto.nome] = 1
  snackbar.value = true
}

// Soma todos os itens da consulta + extras
const totalGeral = computed(() => {
  const totalExtras = produtosExtras.value.reduce((acc, item) => acc + item.total, 0)
  return totalExtras
})


function submit() {
  console.log({
    pacienteSelecionado: pacienteSelecionado.value,
    responsavelAtendimento: responsavelAtendimento.value,
    dataAtendimento: dataAtendimento.value,
    horaConsulta: horaConsulta.value,
    queixa: textArea.value.queixa,
    suspeitaClinica: textArea.value.suspeitaClinica,
    exames: textArea.value.exames,
    tratamento: textArea.value.tratamento,
    prognostico: textArea.value.prognostico,
    destinacao: textArea.value.destinacao,
    temRetorno: temRetorno.value,
    dataRetorno: dataRetorno.value,
    motivoRetorno: motivoRetorno.value
  })
}

const erroData = ref('')

function validarDataMax(v: string) {
  if (!v) return 'Campo obrigatório'
  if (v > hoje) return 'A data não pode ser maior que hoje'
  return true
}

// Para mostrar a mensagem abaixo do campo (controlar erroData)
function validarCampo() {
  if (!dataAtendimento.value) {
    erroData.value = 'Campo obrigatório'
  } else if (dataAtendimento.value > hoje) {
    erroData.value = 'A data não pode ser maior que a de hoje'
  } else {
    erroData.value = ''
  }
}

const rulesData = [validarDataMax]
const sistemas = [
  {
    nome: 'Digestório',
    checklist: ['Falta de apetite', 'Ingestão de água', 'Vômito', 'Diarréia']
  },
  {
    nome: 'Neurológico',
    checklist: ['Inclinação cabeça', 'Convulsão', 'Ataxia']
  },
  {
    nome: 'Motor',
    checklist: ['Dificuldade locomoção', 'Alt. posturais', 'Fraturas']
  },
  {
    nome: 'Pele',
    checklist: ['Ectoparasitas', 'Queda de pelo', 'Alopecia', 'Ferida']
  },
  {
    nome: 'Urogenital',
    checklist: ['Secreção vaginal', 'Dificuldade', 'Volume', 'Castrado']
  },
  {
    nome: 'Cardiorrespiratório',
    checklist: ['Cansaço respiratório', 'Secreção nasal', 'Tosse', 'Ferida']
  },
  {
    nome: 'Ambiente',
    checklist: ['Rural', 'Urbano', 'Acesso à rua']
  },
  {
    nome: 'Ouvidos',
    checklist: ['Secreção', 'Déficit de audição']
  },
  {
    nome: 'Olhos',
    checklist: ['Secreção ocular', 'Déficit visual']
  }
]

const historicoCampos = ref([
  { label: 'Uso de Medicação Contínua', resposta: '', especificar: '' },
  { label: 'Uso de Suplementação', resposta: '', especificar: '' },
  { label: 'Alergia a Medicamento', resposta: '', especificar: '' },
  { label: 'Fez Exame Recente', resposta: '', especificar: '' },
  { label: 'Realizou Cirurgia', resposta: '', especificar: '' }
])

const exameFisico = ref({
  alimentacao: '',
  urina: '',
  fezes: '',
  vomito: '',
  fc: '',
  fr: '',
  temperatura: '',
  linfonodos: '',
  outros: ''
})

const opcoesAlimentacao = ref([
  'Ração seca comercial',
  'Ração úmida comercial',
  'Cozida',
  'Crua sem ossos',
  'Crua com ossos',
  'Outros'
])

const alimentacaoSelecionada = ref<string[]>([])
const alimentacaoOutros = ref('')

// Estado reativo para guardar se o radio foi sim ou não para cada sistema
const sistemaSelecionado = ref<boolean[]>(Array(sistemas.length).fill(false))

// Estado reativo para guardar os checkboxes marcados por sistema
const sistemaChecks = ref<string[][]>(Array(sistemas.length).fill([]))

defineOptions({
  name: 'AgendarConsulta',
})
</script>

<style scoped>
.container-sintomas {
  width: 250px;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #C6C6C6;
  padding-left: 15px !important;
  color: #909090;
}
</style>
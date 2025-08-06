<template>
  <v-card>
    <p class="title-page">
      Cadastro de Consulta
      <img src="/src/assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
    </p>

    <p class="sub-page">
      Consultas / <span class="aba-atual">Cadastrar</span>
      <img src="/src/assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
    </p>

    <v-tabs v-model="tab">
      <v-tab value="dados">Dados Básicos</v-tab>
      <v-tab value="anamnese">Anamnese Sistemas</v-tab>
      <v-tab value="historico">Histórico Clínico e Exame Físico</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="dados" class="pt-5">
          <v-form ref="formRef" @submit.prevent="submit">
            <v-row class="row-info-basicas">
              <v-select v-model="pacienteSelecionado" :items="pacientes" label="Paciente*"
                placeholder="Selecione um paciente" :rules="required" dense outlined max-width="300px" />
              <v-select v-model="responsavelAtendimento" :items="veterinarios" label="Responsável Atendimento*"
                placeholder="Selecione um veterinário" :rules="required" dense outlined max-width="300px" />
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


            <v-row class="row-info-basicas"> <v-textarea v-model="queixa" label="Queixa Principal / Histórico recente"
                :rules="required" max-width="500px" />
              <v-textarea v-model="suspeitaClinica" label="Suspeita Clínica" max-width="500px" /></v-row>

            <v-row class="row-info-basicas"> <v-textarea v-model="exames" label="Exames Realizados" max-width="500px" />
              <v-textarea v-model="tratamento" label="Tratamento Estabelecido" max-width="500px" /></v-row>



            <v-row class="row-info-basicas"> <v-textarea v-model="prognostico" label="Prognóstico" max-width="500px" />
              <v-textarea v-model="destinacao" label="Destinação do Paciente" max-width="500px" /></v-row>

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
                    <v-radio-group v-model="campo.resposta"  inline density="compact">
                      <v-radio label="Sim" value="sim" class="mr-4" />
                      <v-radio label="Não" value="nao" />
                    </v-radio-group>
                    <v-text-field :disabled="campo.resposta !== 'sim'" v-model="campo.especificar" width="300px" label="Especificar" dense
                      outlined class="mt-2 ml-8" />
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
                  <v-checkbox  v-model="alimentacaoSelecionada" v-for="(opcao, index) in opcoesAlimentacao" :key="index" :label="opcao" :value="opcao" hide-details />
              </v-row>

            <v-textarea  v-if="alimentacaoSelecionada.includes('Outros')" v-model="alimentacaoOutros" width="400px"
              label="Especificar outros" dense outlined class="mt-2" />
          </v-form>
        </v-tabs-window-item>

      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('dados')
const formRef = ref()

const required = [(v: string) => !!v || 'Campo obrigatório']

// Dados simulados
const pacientes = ['Tigrinho', 'Frajola', 'Mingau']
const veterinarios = ['Dr. Ana', 'Dr. João', 'Dr. Carla']

// Campos do formulário
const pacienteSelecionado = ref()
const responsavelAtendimento = ref()
const dataAtendimento = ref('')
const hoje = new Date().toISOString().split('T')[0]
const horaConsulta = ref('')
const queixa = ref('')
const suspeitaClinica = ref('')
const exames = ref('')
const tratamento = ref('')
const prognostico = ref('')
const destinacao = ref('')
const temRetorno = ref('nao')
const dataRetorno = ref('')
const motivoRetorno = ref('')

function submit() {
  console.log({
    pacienteSelecionado: pacienteSelecionado.value,
    responsavelAtendimento: responsavelAtendimento.value,
    dataAtendimento: dataAtendimento.value,
    horaConsulta: horaConsulta.value,
    queixa: queixa.value,
    suspeitaClinica: suspeitaClinica.value,
    exames: exames.value,
    tratamento: tratamento.value,
    prognostico: prognostico.value,
    destinacao: destinacao.value,
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
.title-page {
  font-size: 24px;
  font-weight: bold;
}

.sub-page {
  font-size: 16px;
  color: #777;
}

.aba-atual {
  font-weight: bold;
  color: #000;
}

.menu-title-icon,
.menu-sub-icon {
  width: 20px;
  height: 20px;
  margin-left: 8px;
}

.container-sintomas {
  width: 250px;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #C6C6C6;
  padding-left: 15px !important;
  color: #909090;
}
</style>
<template>
    <v-col>
      <span class="title-page">Relatórios e Documentos</span>
      <br>
      <span class="breadcrumb">
        Relatórios / <span class="page-active">Listagem</span>
      </span>
      <br>
      <p class="title-page mt-8">Relatórios</p>
      <v-row class="row-cards mt-4">

        <v-card class="pa-2">
          <v-card-title>Histórico do Animal</v-card-title>
          <v-card-text>Laudo contendo informações de saúde e histórico do animal.

            <multipleCombobox v-model="pacienteSelecionado" :items="listPacientes" :extra-items="pacientes"
              label="Animal*" variant="outlined" id="animal" :isRequired="false"  :isMultipleSelect="false"
              class="container-combobox-padrao mt-4 mb-4" placeholder="Selecione o animal" />

            <v-text-field v-model="dataInicio" label="Data início*" type="date" max-width="150px" />
            <v-text-field v-model="dataFinal" label="Data final*" type="date" max-width="150px" />
            <p v-if="showMsgValidation"> {{ msgValidation }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn class="btn-padrao" @click="gerarRelatorio">Gerar relatório</v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="pa-2">
          <v-card-title>Histórico de Atendimentos</v-card-title>
          <v-card-text>Selecione o período para geração do histórico de todos os atendimentos realizados nesse
            tempo:
            <v-text-field v-model="dataInicioAtendimento" label="Data início*" type="date" max-width="150px"
              class="mt-2" />
            <v-text-field v-model="dataFinalAtendimento" label="Data final*" type="date" max-width="150px" />

            <p v-if="showMsgValidationAtendimento"> {{ msgValidationAtendimento }}</p>
          </v-card-text>

          <v-card-actions>
            <v-btn class="btn-padrao" @click="gerarRelatorioAtendimento">Gerar relatório</v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
      <div class="d-flex flex-row flex-wrap mt-8"><p class="title-page mr-5">Documentos</p><ModalCadastroDocumento /></div>
      <v-row class="row-cards mt-4 mb-4">
        <v-card class="pa-2">
          <v-card-title>Receituário</v-card-title>
          <v-card-text>Prescrição oficial emitida pelo médico veterinário, contendo as orientações de uso de
            medicamentos,
            dosagens, duração do tratamento e instruções adicionais para o tutor.</v-card-text>
          <v-card-actions>
            <v-btn class="btn-padrao">Baixar documento</v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="pa-2">
          <v-card-title>Termo de Consentimento</v-card-title>
          <v-card-text>Documento assinado pelo tutor autorizando procedimentos médicos ou cirúrgicos, após
            esclarecimento
            sobre riscos, benefícios e alternativas.</v-card-text>
          <v-card-actions>
            <v-btn class="btn-padrao">Baixar documento</v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="pa-2">
          <v-card-title>Termo de Adoção</v-card-title>
          <v-card-text>Contrato de responsabilidade e compromisso na adoção do animal.</v-card-text>
          <v-card-actions>
            <v-btn class="btn-padrao">Baixar documento</v-btn>
          </v-card-actions>
        </v-card>

      </v-row>
    </v-col>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// COMPONENTES
import multipleCombobox from '@/components/multipleCombobox.vue'
import ModalCadastroDocumento from './ModalCadastroDocumento.vue'


defineOptions({
  name: 'RelatorioList',
})

// Agora selecionados guardam o objeto, não string
const pacienteSelecionado = ref<string | undefined>(undefined)
const listPacientes = ref<string[]>(['Juju', 'Lua', 'Zoe', 'Teddy Junior', 'Mingau', 'Mel', 'Remmi'])
const pacientes = ref<Array<{ id: string; descricao: string }>>([{ id: '1', descricao: 'Juju' }, { id: '2', descricao: 'Lua' }, { id: '3', descricao: 'Zoe' }, { id: '4', descricao: 'Teddy Junior' }, { id: '5', descricao: 'Mingau' }, { id: '6', descricao: 'Mel' }, { id: '7', descricao: 'Remmi' }])

// Mensagem geral de validação
const msgValidation = ref("")
const showMsgValidation = ref(false)
const showMsgValidationAtendimento = ref(false)
const msgValidationAtendimento = ref("")

const dataInicio = ref("")
const dataFinal = ref("")
const dataInicioAtendimento = ref("")
const dataFinalAtendimento = ref("")

function validarPeriodo(dataInicio: string, dataFinal: string, requirePaciente = false, paciente: any = null) {
  if (requirePaciente && !paciente) {
    return "É obrigatório selecionar um animal antes de gerar o relatório."
  }

  if (!dataInicio || !dataFinal) {
    return "Existem campos obrigatórios a serem preenchidos!"
  }

  if (new Date(dataInicio) > new Date(dataFinal)) {
    return "A data de início não pode ser maior que a data final."
  }

  return ""
}

const gerarRelatorio = () => {
  msgValidation.value = ""
  showMsgValidation.value = false

  const erro = validarPeriodo(dataInicio.value, dataFinal.value, true, pacienteSelecionado.value)

  if (erro) {
    msgValidation.value = erro
    showMsgValidation.value = true
    return
  }

  // console.log("Gerando relatório animal", { paciente: pacienteSelecionado.value, inicio: dataInicio.value, final: dataFinal.value })
}

const gerarRelatorioAtendimento = () => {
  msgValidationAtendimento.value = ""
  showMsgValidationAtendimento.value = false

  const erro = validarPeriodo(dataInicioAtendimento.value, dataFinalAtendimento.value)

  if (erro) {
    msgValidationAtendimento.value = erro
    showMsgValidationAtendimento.value = true
    return
  }

  // console.log("Gerando relatório atendimentos", { inicio: dataInicioAtendimento.value, final: dataFinalAtendimento.value })
}
</script>

<style lang="scss" scoped>
.row-cards {
  gap: 40px;
}

.v-card {
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
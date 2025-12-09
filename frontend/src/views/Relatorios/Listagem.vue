<template>
  <v-col>
    <span class="title-page">Relatórios</span>
    <br>
    <span class="breadcrumb">
      Relatórios / <span class="page-active">Listagem</span>
    </span>
    <br>
    <!-- <p class="title-page mt-8">Relatórios</p> -->
    <v-row  v-if="!isLoading"  class="row-cards mt-6">

      <v-card class="card-relatorio pa-2">
        <v-card-title>Histórico do Animal</v-card-title>
        <v-card-text>Laudo contendo informações de saúde e histórico do animal.
          <br>
          <!-- BOTÃO SELECIONAR PACIENTE -->
          <v-btn class="btn-padrao mt-4 mb-5" @click="dialogPacientes = true">
            Selecionar Paciente
          </v-btn>

          <!-- PACIENTE SELECIONADO -->
          <p v-if="pacienteSelecionado" class="mt-2 mb-4">
            <strong>Paciente selecionado:</strong> {{ pacienteSelecionado.nome }}
          </p>


          <inputText class="mb-4" label="Data início*" type="date" :ocultaContador="true"
            v-model:valueInput="dataInicio" />
          <inputText label="Data final*" type="date" :ocultaContador="true" v-model:valueInput="dataFinal" />
          <p v-if="showMsgValidation"> {{ msgValidation }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="isLoadingBtn" class="btn-padrao" @click="gerarRelatorio">Gerar relatório</v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="card-relatorio pa-2">
        <v-card-title>Histórico de Atendimentos</v-card-title>
        <v-card-text>Selecione o período para geração do histórico de todos os atendimentos realizados nesse
          tempo:
          <inputText label="Data início*" class="mb-4 mt-4" type="date" :ocultaContador="true"
            v-model:valueInput="dataInicioAtendimento" />
          <inputText label="Data final*" type="date" :ocultaContador="true" v-model:valueInput="dataFinalAtendimento" />

          <p v-if="showMsgValidationAtendimento"> {{ msgValidationAtendimento }}</p>
        </v-card-text>

        <v-card-actions>
          <v-btn :loading="isLoadingBtn" class="btn-padrao" @click="gerarRelatorioAtendimentoRealizados">Gerar relatório</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <!-- <div class="d-flex flex-row flex-wrap mt-8"><p class="title-page mr-5">Documentos</p><ModalCadastroDocumento /></div> -->
    <!-- <v-row class="row-cards mt-4 mb-4">
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

      </v-row> -->
  </v-col>
  <v-dialog v-if="!isLoading" v-model="dialogPacientes" max-width="900px">
    <v-card class="pa-5">
      <v-card-title>
        <span class="text-h6">Selecionar Paciente</span>
        <v-btn icon="mdi-close" @click="dialogPacientes = false" />
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-data-table :headers="headersPacientes" :items="pacientes" item-value="id">
          <template #item.acoes="{ item }">
            <v-btn size="small" class="btn-padrao" @click="selecionarPaciente(item)">
              Selecionar
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
  <!-- <v-dialog v-model="dialogPdf" max-width="1000px">
    <v-card height="90vh">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">Visualizar Relatório</span>

        <v-btn icon="mdi-close" @click="dialogPdf = false" />
      </v-card-title>

      <v-divider />

      <v-card-text style="height: calc(100% - 120px); padding: 0">
        <iframe v-if="pdfUrl" :src="pdfUrl" width="100%" height="100%" style="border: none" />
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="dialogPdf = false">
          Fechar
        </v-btn>

        <v-btn class="btn-padrao" :href="pdfUrl" :download="nomeArquivoPdf">
          Baixar PDF
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->

  <!-- Modal de visualização PDF -->
  <v-dialog v-if="!isLoading" v-model="dialogPdf" max-width="1000px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">Visualizar Documento</span>
        <v-btn class="btn-padrao" icon="mdi-close" @click="dialogPdf = false"></v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0">
        <iframe v-if="pdfUrl" :src="pdfUrl" style="width: 100%; height: 80vh; border: none;"></iframe>
      </v-card-text>
    </v-card>
  </v-dialog>

    <!-- Spinner -->
  <v-container v-if="isLoading" class="d-flex align-center justify-center">
    <v-progress-circular indeterminate color="#ff8200" size="40" width="5"></v-progress-circular>
  </v-container>

</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import jsPDF from "jspdf";

// COMPONENTES
import multipleCombobox from '@/components/multipleCombobox.vue'
import inputText from '@/components/inputText.vue'
import ModalCadastroDocumento from './ModalCadastroDocumento.vue'

// SERVICES
import { recuperarPacientes } from '@/services/paciente'
import { recuperarConsultaPorAnimal, recuperarAnamnese, recuperarHistoricoClinicoo, recuperarConsultas } from '@/services/consulta'
import { recuperarVeterinarios } from '@/services/veterinario'
import { formatarDataLocal } from '@/utils/formaUtils';

defineOptions({
  name: 'RelatorioList',
})

interface Paciente {
  id: number
  nome: string
  especie: string
  tutor: {
    nome_completo: string
  }
}

interface Consulta {
  id: number
  data_consulta: string
  hora_consulta: string
  queixa_principal: string | null
  suspeita_clinica: string | null
  exames_realizados: string | null
  tratamento_estabelecido: string | null
  prognostico: string | null
  retorno: boolean
  data_retorno: string | null
  motivo_retorno: string | null
  veterinario: {
    id: number
    nome: string | null
  }
  animal: {
    id: number
    nome: string
    especie: string
  }
}

interface AnimalHeader {
  nome: string
  especie: string
  tutor?: string
  castrado: string
  data_castracao: string
  data_nascimento: string
  idade: string
  pelagem: string
  peso: string
  porte: string
  raca: string
  sexo: string
  tipo: string
}

const dialogPacientes = ref(false)

const pacientes = ref<any[]>([])
const pacienteSelecionado = ref<Paciente>()
const headersPacientes = [
  { text: "Nome", value: "nome" },
  { text: "Espécie", value: "especie" },
  { text: "Tutor", value: "tutor.nome_completo" },
  { text: "Ações", value: "acoes", sortable: false }
]

// Mensagem geral de validação
const msgValidation = ref("")
const showMsgValidation = ref(false)
const showMsgValidationAtendimento = ref(false)
const msgValidationAtendimento = ref("")

const dataInicio = ref("")
const dataFinal = ref("")
const dataInicioAtendimento = ref("")
const dataFinalAtendimento = ref("")
const listVeterinarios = ref<any[]>([])
const veterinarios = ref<any[]>([])
const dialogPdf = ref(false)
const pdfUrl = ref<string | undefined>(undefined)
const nomeArquivoPdf = ref("")
const isLoading = ref(false)
const isLoadingBtn = ref(false)


async function loadPacientes() {
  try {
    pacientes.value = await recuperarPacientes()
  } catch (error) {
    console.error("Erro ao carregar pacientes", error)
  }
}

async function loadVeterinarios() {
  try {
    const response = await recuperarVeterinarios()
    listVeterinarios.value = response
    veterinarios.value = response.map((p: any) => p.nome_completo)
  } catch (error) {
    console.error('Erro ao carregar veterinários:', error)
  }
}

function selecionarPaciente(paciente: Paciente) {
  pacienteSelecionado.value = paciente
  dialogPacientes.value = false
}

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

// =================== FUNÇÕES AUXILIARES ===================

function montarLinhasAnamnese(anamnese?: any): string[] {
  if (!anamnese) return []

  const campos = [
    { label: "Digestório", value: anamnese.digestorio },
    { label: "Neurológico", value: anamnese.neurologico },
    { label: "Motor", value: anamnese.motor },
    { label: "Pele", value: anamnese.pele },
    { label: "Urogenital", value: anamnese.urogenital },
    { label: "Cardiorrespiratório", value: anamnese.cardiorrespiratorio },
    { label: "Ambiente", value: anamnese.ambiente },
    { label: "Ouvido", value: anamnese.ouvido },
    { label: "Olhos", value: anamnese.olhos }
  ]

  return campos
    .map(c => {
      // Se c.value é objeto vazio ou nulo, retorna "-"
      if (!c.value || (typeof c.value === "object" && Object.keys(c.value).length === 0)) {
        return null
      }

      // Se for string ou número
      return `${c.label}: ${c.value}`
    })
    .filter(c => c !== null) as string[]
}


function montarLinhasHistoricoClinico(historico?: any): string[] {
  if (!historico) return []

  const linhas: string[] = []

  linhas.push(`Medicação contínua: ${historico.usa_medicacao_continua ? "Sim" : "Não"}`)
  if (historico.medicacao_quais) linhas.push(`• Quais: ${historico.medicacao_quais}`)

  linhas.push(`Alergia a medicamento: ${historico.alergia_medicamento ? "Sim" : "Não"}`)
  if (historico.alergia_quais) linhas.push(`• Quais: ${historico.alergia_quais}`)

  linhas.push(`Cirurgia prévia: ${historico.realizou_cirurgia ? "Sim" : "Não"}`)
  if (historico.cirurgia_quais) linhas.push(`• Qual: ${historico.cirurgia_quais}`)

  linhas.push(`Suplementação: ${historico.usa_suplementacao ? "Sim" : "Não"}`)
  if (historico.suplementacao_quais) linhas.push(`• Qual: ${historico.suplementacao_quais}`)

  linhas.push(`Exames recentes: ${historico.fez_exame_recente ? "Sim" : "Não"}`)
  if (historico.exame_quais) linhas.push(`• Quais: ${historico.exame_quais}`)

  if (historico.alimentacao) linhas.push(`Alimentação: ${historico.alimentacao}`)
  if (historico.frequencia_cardiaca) linhas.push(`Frequência cardíaca: ${historico.frequencia_cardiaca} bpm`)
  if (historico.frequencia_respiratoria) linhas.push(`Frequência respiratória: ${historico.frequencia_respiratoria} irpm`)
  if (historico.temperatura) linhas.push(`Temperatura: ${historico.temperatura} °C`)
  if (historico.linfonodos) linhas.push(`Linfonodos: ${historico.linfonodos}`)
  if (historico.outros) linhas.push(`Outros: ${historico.outros}`)

  return linhas
}

function montarAnimalHeaderPorId(animalId: number): AnimalHeader | undefined {
  const animal = pacientes.value.find(p => p.id === animalId)
  if (!animal) return undefined

  return {
    nome: animal.nome,
    especie: animal.especie,
    tutor: animal.tutor?.nome_completo,
    castrado: animal.castrado,
    data_castracao: animal.data_castracao,
    data_nascimento: animal.data_nascimento,
    idade: animal.idade,
    pelagem: animal.pelagem,
    peso: animal.peso,
    porte: animal.porte,
    raca: animal.raca,
    sexo: animal.sexo,
    tipo: animal.tipo
  }
}

function filtrarConsultasPorPeriodo(consultas: Consulta[], inicio: string, fim: string): Consulta[] {
  const dataInicioPeriodo = new Date(inicio)
  dataInicioPeriodo.setHours(0, 0, 0, 0)
  const dataFimPeriodo = new Date(fim)
  dataFimPeriodo.setHours(23, 59, 59, 999)

  return consultas.filter(consulta => {
    const dataConsulta = new Date(consulta.data_consulta)
    return dataConsulta >= dataInicioPeriodo && dataConsulta <= dataFimPeriodo
  })
}

function calcularAlturaBlocoConsulta(
  pdf: jsPDF,
  consulta: Consulta,
  anamnese: any,
  historicoClinico: any,
  margin: number,
  pageWidth: number
) {
  const padding = 5
  const lineHeight = 5
  const maxWidth = pageWidth - margin * 2 - 10
  const headerHeight = 18

  const linhas = [
    `Queixa principal: ${consulta.queixa_principal ?? "-"}`,
    `Suspeita clínica: ${consulta.suspeita_clinica ?? "-"}`,
    `Exames realizados: ${consulta.exames_realizados ?? "-"}`,
    `Tratamento: ${consulta.tratamento_estabelecido ?? "-"}`,
    `Prognóstico: ${consulta.prognostico ?? "-"}`
  ]

  let alturaTexto = 0
  linhas.forEach(l => {
    const split = pdf.splitTextToSize(l, maxWidth)
    alturaTexto += split.length * lineHeight
  })

  const linhasAnamnese = montarLinhasAnamnese(anamnese)
  let alturaAnamnese = 0
  if (linhasAnamnese.length > 0) {
    alturaAnamnese += lineHeight + 2
    linhasAnamnese.forEach(l => {
      const split = pdf.splitTextToSize(l, maxWidth)
      alturaAnamnese += split.length * lineHeight
    })
  }

  const linhasHistorico = montarLinhasHistoricoClinico(historicoClinico)
  let alturaHistorico = 0
  if (linhasHistorico.length > 0) {
    alturaHistorico += lineHeight + 2
    linhasHistorico.forEach(l => {
      const split = pdf.splitTextToSize(l, maxWidth)
      alturaHistorico += split.length * lineHeight
    })
  }

  let alturaRetorno = 0
  if (consulta.retorno) {
    const retorno = `Retorno em ${formatarDataLocal(consulta.data_retorno!)} - ${consulta.motivo_retorno ?? ""}`
    const split = pdf.splitTextToSize(retorno, maxWidth)
    alturaRetorno = split.length * lineHeight + 2
  }

  return headerHeight + alturaTexto + alturaAnamnese + alturaHistorico + alturaRetorno + padding * 2
}

function desenharRodapePadrao(pdf: jsPDF, veterinario?: string | null) {
  const pageHeight = pdf.internal.pageSize.getHeight()
  const vetNome = veterinario ?? "Veterinário não informado"
  const footerY = pageHeight - 40

  pdf.setFontSize(9)

  pdf.line(20, footerY + 10, 80, footerY + 10)
  pdf.text("Assinatura", 50, footerY + 17, { align: "center" })
  pdf.text(vetNome, 50, footerY + 22, { align: "center" })

  pdf.line(90, footerY + 10, 150, footerY + 10)
  pdf.text("Carimbo", 120, footerY + 17, { align: "center" })

  const hoje = new Date().toLocaleDateString("pt-BR")
  pdf.line(160, footerY + 10, 200, footerY + 10)
  pdf.text(`Data: ${hoje}`, 180, footerY + 17, { align: "center" })
}

async function desenharCabecalhoPadrao(
  pdf: jsPDF,
  titulo: string,
  animal?: AnimalHeader
) {
  const pageWidth = pdf.internal.pageSize.getWidth()

  pdf.setDrawColor(0)
  pdf.setLineWidth(0.1)
  pdf.roundedRect(10, 10, pageWidth - 20, 50, 1, 1)

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(12)
  pdf.text(titulo.toUpperCase(), pageWidth / 2, 18, { align: "center" })

  pdf.setFontSize(9)
  pdf.setFont("helvetica", "normal")

  if (!animal) return

  const yStart = 26
  const colLeft = 15
  const colMid = pageWidth / 2 - 10
  const colRight = pageWidth - 85

  pdf.text(`Paciente: ${animal.nome}`, colLeft, yStart)
  pdf.text(`Espécie: ${animal.especie}`, colMid, yStart)
  pdf.text(`Sexo: ${animal.sexo ?? "-"}`, colRight, yStart)

  pdf.text(`Raça: ${animal.raca ?? "-"}`, colLeft, yStart + 6)
  pdf.text(`Pelagem: ${animal.pelagem ?? "-"}`, colMid, yStart + 6)
  pdf.text(`Porte: ${animal.porte ?? "-"}`, colRight, yStart + 6)

  pdf.text(`Peso: ${animal.peso ? animal.peso + " kg" : "-"}`, colLeft, yStart + 12)
  pdf.text(`Idade: ${animal.idade ? animal.idade + " anos" : "-"}`, colMid, yStart + 12)

  const castradoTexto = animal.castrado
    ? `Castrado: Sim (${animal.data_castracao ? formatarDataLocal(animal.data_castracao) : "-"})`
    : "Castrado: Não"
  pdf.text(castradoTexto, colRight, yStart + 12)

  if (animal.tutor) {
    pdf.text(`Tutor: ${animal.tutor}`, colLeft, yStart + 18)
  }
}

// =================== FUNÇÃO PRINCIPAL ===================

function desenharBlocoConsulta(
  pdf: jsPDF,
  consulta: Consulta,
  anamnese: any,
  historicoClinico: any,
  margin: number,
  y: number,
  pageWidth: number
) {
  const padding = 5
  const lineHeight = 5
  const maxWidth = pageWidth - margin * 2 - 10
  const headerHeight = 18

  const vet = listVeterinarios.value.find((v: any) => v.id === consulta.veterinario?.id)

  const linhas = [
    `Queixa principal: ${consulta.queixa_principal ?? "-"}`,
    `Suspeita clínica: ${consulta.suspeita_clinica ?? "-"}`,
    `Exames realizados: ${consulta.exames_realizados ?? "-"}`,
    `Tratamento: ${consulta.tratamento_estabelecido ?? "-"}`,
    `Prognóstico: ${consulta.prognostico ?? "-"}`
  ]

  pdf.roundedRect(margin, y, pageWidth - margin * 2, calcularAlturaBlocoConsulta(pdf, consulta, anamnese, historicoClinico, margin, pageWidth), 2, 2)

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "bold")
  pdf.text(`Data: ${formatarDataLocal(consulta.data_consulta)} | Hora: ${consulta.hora_consulta}`, margin + padding, y + 7)
  pdf.text(`Veterinário: ${vet?.nome_completo ?? "-"}`, margin + padding, y + 13)

  let textY = y + headerHeight
  pdf.setFont("helvetica", "normal")

  // Linhas da consulta
  linhas.forEach(linha => {
    const split = pdf.splitTextToSize(linha, maxWidth)
    pdf.text(split, margin + padding, textY)
    textY += split.length * lineHeight
  })

  // Anamnese
  const linhasAnamnese = montarLinhasAnamnese(anamnese)
  if (linhasAnamnese.length > 0) {
    textY += 2
    pdf.setFont("helvetica", "bold")
    pdf.text("Anamnese:", margin + padding, textY)
    textY += lineHeight
    pdf.setFont("helvetica", "normal")
    linhasAnamnese.forEach(linha => {
      const split = pdf.splitTextToSize(linha, maxWidth)
      pdf.text(split, margin + padding, textY)
      textY += split.length * lineHeight
    })
  }

  // Histórico clínico
  const linhasHistorico = montarLinhasHistoricoClinico(historicoClinico)
  if (linhasHistorico.length > 0) {
    textY += 3
    pdf.setFont("helvetica", "bold")
    pdf.text("Histórico Clínico:", margin + padding, textY)
    textY += lineHeight
    pdf.setFont("helvetica", "normal")
    linhasHistorico.forEach(linha => {
      const split = pdf.splitTextToSize(linha, maxWidth)
      pdf.text(split, margin + padding, textY)
      textY += split.length * lineHeight
    })
  }

  // Retorno
  if (consulta.retorno) {
    textY += 2
    const retornoTexto = pdf.splitTextToSize(`Retorno em ${formatarDataLocal(consulta.data_retorno!)} - ${consulta.motivo_retorno ?? ""}`, maxWidth)
    pdf.setFont("helvetica", "italic")
    pdf.text(retornoTexto, margin + padding, textY)
    pdf.setFont("helvetica", "normal")
  }

  return calcularAlturaBlocoConsulta(pdf, consulta, anamnese, historicoClinico, margin, pageWidth)
}

// =================== GERAR PDF ===================

async function gerarPdfHistoricoAnimal(consultas: Consulta[]) {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 10

  consultas.sort((a, b) => new Date(a.data_consulta).getTime() - new Date(b.data_consulta).getTime())
  const animalHeader = montarAnimalHeaderPorId(consultas[0].animal.id)
  await desenharCabecalhoPadrao(pdf, "Histórico Clínico do Animal", animalHeader)

  let y = 70
  for (const consulta of consultas) {
    const anamnese = await recuperarAnamnese(consulta.id)
    const historicoClinico = await recuperarHistoricoClinicoo(consulta.id)

    const alturaBloco = calcularAlturaBlocoConsulta(pdf, consulta, anamnese, historicoClinico, margin, pageWidth)
    if (y + alturaBloco > pageHeight - 40) {
      pdf.addPage()
      await desenharCabecalhoPadrao(pdf, "Histórico Clínico do Animal", animalHeader)
      y = 70
    }

    desenharBlocoConsulta(pdf, consulta, anamnese, historicoClinico, margin, y, pageWidth)
    y += alturaBloco + 5
  }

  desenharRodapePadrao(pdf, consultas[0].veterinario?.nome)

  const blob = pdf.output("blob")
  pdfUrl.value = URL.createObjectURL(blob)
  nomeArquivoPdf.value = `historico-${consultas[0].animal.nome}.pdf`
  dialogPdf.value = true
}

const gerarRelatorio = async () => {
  msgValidation.value = ""
  showMsgValidation.value = false

  const erro = validarPeriodo(dataInicio.value, dataFinal.value, true, pacienteSelecionado.value)
  if (erro) {
    msgValidation.value = erro
    showMsgValidation.value = true
    return
  }

  if (!pacienteSelecionado.value) return

  try {
    isLoadingBtn.value = true
    const consultas: Consulta[] = await recuperarConsultaPorAnimal(
      pacienteSelecionado.value.id
    )

    // ✅ filtra pelo período escolhido
    const consultasFiltradas = filtrarConsultasPorPeriodo(
      consultas,
      dataInicio.value,
      dataFinal.value
    )

    if (!consultasFiltradas.length) {
      alert("Nenhuma consulta encontrada para o período selecionado.")
      return
    }

    await gerarPdfHistoricoAnimal(consultasFiltradas)


  } catch (error) {
    console.error("Erro ao gerar relatório", error)
  } finally {    
    isLoadingBtn.value = false
  }
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

const gerarRelatorioAtendimentoRealizados = async () => {
  msgValidationAtendimento.value = ""
  showMsgValidationAtendimento.value = false

  const erro = validarPeriodo(dataInicioAtendimento.value, dataFinalAtendimento.value)
  if (erro) {
    msgValidationAtendimento.value = erro
    showMsgValidationAtendimento.value = true
    return
  }

  try {
    
    isLoadingBtn.value = true
    // Recupera todas as consultas
    const todasConsultas: Consulta[] = await recuperarConsultas()

    // Filtra pelo período
    const consultasFiltradas = filtrarConsultasPorPeriodo(
      todasConsultas,
      dataInicioAtendimento.value,
      dataFinalAtendimento.value
    )

    if (!consultasFiltradas.length) {
      alert("Nenhuma consulta encontrada para o período selecionado.")
      return
    }

    // Cria PDF
    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10

    // Ordena por data
    consultasFiltradas.sort(
      (a, b) => new Date(a.data_consulta).getTime() - new Date(b.data_consulta).getTime()
    )

    function desenharCabecalhoAtendimentos(pdf: jsPDF) {
      const titulo = `Histórico de atendimentos de ${formatarDataLocal(dataInicioAtendimento.value)} a ${formatarDataLocal(dataFinalAtendimento.value)}`
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(12)
      pdf.text(titulo, pageWidth / 2, 15, { align: "center" })
      pdf.setDrawColor(0)
      pdf.setLineWidth(0.1)
      pdf.line(margin, 18, pageWidth - margin, 18) // linha abaixo do título
    }


    // Desenha o cabeçalho na primeira página
    desenharCabecalhoAtendimentos(pdf)

    // Para cada atendimento, adiciona bloco
    let y = 25
    for (const consulta of consultasFiltradas) {
      const anamnese = await recuperarAnamnese(consulta.id)
      const historicoClinico = await recuperarHistoricoClinicoo(consulta.id)

      const alturaBloco = calcularAlturaBlocoConsulta(pdf, consulta, anamnese, historicoClinico, margin, pageWidth)

      if (y + alturaBloco > pageHeight - 40) {
        pdf.addPage()
        desenharCabecalhoAtendimentos(pdf)
        y = 25
      }

      desenharBlocoConsulta(pdf, consulta, anamnese, historicoClinico, margin, y, pageWidth)
      y += alturaBloco + 5
    }

    // Rodapé
    desenharRodapePadrao(pdf)

    const blob = pdf.output("blob")
    pdfUrl.value = URL.createObjectURL(blob)
    nomeArquivoPdf.value = `atendimentos_${dataInicioAtendimento.value}_a_${dataFinalAtendimento.value}.pdf`
    dialogPdf.value = true
  } catch (error) {
    console.error("Erro ao gerar relatório de atendimentos:", error)
    alert("Ocorreu um erro ao gerar o relatório.")
  } finally {
    
    isLoadingBtn.value = false
  }
}


watch(dialogPdf, (open) => {
  if (!open && pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
    pdfUrl.value = undefined
  }
})


onMounted(async () => {
  isLoading.value = true
  await loadPacientes()
  await loadVeterinarios()
  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.row-cards {
  gap: 40px;
}

.v-card.card-relatorio {
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
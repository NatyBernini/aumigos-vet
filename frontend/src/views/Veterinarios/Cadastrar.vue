<template>
  <v-card>
    <p class="title-page">Cadastro do Veterinário
      <img src="/./src/assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
    </p>

    <p class="sub-page">Veterinários / <span class="aba-atual">Cadastrar</span>
      <img src="/./src/assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
    </p>

    <v-tabs v-model="tab">
      <v-tab value="one">Informações do Veterinário</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one" class="pt-5">

          <v-form ref="formRef" @submit.prevent="submit">
            <p>Informações Básicas</p>
            <v-col>
              <v-row class="row-info-basicas">
                <v-text-field v-model="nameTutor" :rules="required" label="Nome completo*" max-width="400px" />
                <v-text-field v-model="cpf" label="CPF*" :rules="[required]" max-width="170px" @input="onInputCpf"
                  maxlength="14" />
                <v-text-field v-model="rg" :rules="required" label="RG*" max-width="150px" @input="onInputRg"
                  maxlength="12" />
              </v-row>
              <v-row class="row-info-basicas">
                <v-text-field v-model="especialidade" :rules="required" label="Especialidade*" max-width="400px" />
                <v-text-field v-model="crmv" :rules="required" label="CRMV*" max-width="100px" />
              </v-row>
            </v-col>

            <p>Informações de Endereço</p>
            <v-col>
              <v-row class="row-info-basicas">

                <v-select v-model="estadoSelecionado" :items="estados" item-value="value" label="Estado" dense outlined
                  clearable filterable min-width="300px" max-width="300px" />

                <v-select v-model="cidadeSelecionada" :items="cidades" item-text="nome" item-value="id" label="Cidade"
                  dense outlined :rules="[required]" :disabled="!estadoSelecionado" clearable min-width="300px"
                  max-width="300px" />


              </v-row>
              <v-row class="row-info-basicas">
                <v-text-field v-model="cep" label="CEP" maxlength="9" placeholder="00000-000" @input="onInputCep"
                  style="max-width: 150px;" />
              </v-row>
              <v-row class="row-info-basicas">
                <v-text-field v-model="bairro" :rules="required" label="Bairro*" max-width="400px" />
                <v-text-field v-model="rua" :rules="required" label="Rua*" max-width="400px" />
              </v-row>
              <v-row class="row-info-basicas">
                <v-text-field v-model="numero" :rules="required" label="N*" type="number" max-width="100px" />
                <v-text-field v-model="complemento" :rules="required" label="Complemento*" max-width="400px" />
              </v-row>
            </v-col>

            <p>Informações para Contato</p>
            <v-col>
              <v-row class="row-info-basicas" v-for="(item, index) in phones" :key="index">
                <v-text-field v-model="item.number" :rules="required" label="Telefone*" placeholder="(00) 00000-0000"
                  maxlength="15" max-width="200px" />
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
                <v-text-field v-model="email" :rules="required" label="E-mail*" max-width="400px" />
              </v-row>
            </v-col>

            <v-textarea v-model="textarea.ObservacoesGerais" :rules="obsRules" label="Observações" counter
              maxlength="300" placeholder="Observação" max-width="500px" />

            <div class="container-btn mt-5">
              <p class="msg-auxiliar">Campos Obrigatórios*</p>
            </div>

            <div class="container-btn mt-5">
              <v-btn class="btn-padrao" @click="handleReset">Limpar Tudo</v-btn>
              <v-btn class="me-4 btn-padrao" type="submit">Salvar</v-btn>
            </div>
          </v-form>

        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getCidadesPorEstado, getEstados, getEnderecoPorCep } from '../../services/ibge'
import { formatCep, limparCep, buscarEnderecoViaCep } from '../../utils/cepUtils'
import { formatCpf, formatRg, formatPhoneNumber } from '../../utils/formaUtils'

defineOptions({ name: 'VeterinarioCadastro' })

const tab = ref(null)
const readOnly = ref(false)
const formRef = ref()

// Regras
const required = [(v: string) => !!v || 'Campo obrigatório']
const obsRules = [(v: string) => v.length <= 300 || 'Máximo 300 caracteres']

// Campos
const nameTutor = ref('')
const cpf = ref('')
const rg = ref('')
const especialidade = ref('')
const crmv = ref('')
const estados = ref<Array<any>>([])
const cidades = ref<Array<any>>([])
const bairro = ref('')
const rua = ref('')
const numero = ref('')
const complemento = ref('')
const phones = ref([{ number: '' }])
const email = ref('')
const textarea = ref({ ObservacoesGerais: '' })
const cep = ref('')

const estadoSelecionado = ref<string | null>(null);


const cidadeSelecionada = ref<string | null>(null);

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  alert(JSON.stringify({
    nameTutor: nameTutor.value,
    cpf: cpf.value,
    rg: rg.value,
    especialidade: especialidade.value,
    crmv: crmv.value,
    bairro: bairro.value,
    rua: rua.value,
    numero: numero.value,
    complemento: complemento.value,
    phones: phones.value.map(p => p.number),
    email: email.value,
    observacoes: textarea.value.ObservacoesGerais
  }, null, 2))
}

function handleReset() {
  nameTutor.value = ''
  cpf.value = ''
  rg.value = ''
  especialidade.value = ''
  crmv.value = ''
  bairro.value = ''
  rua.value = ''
  numero.value = ''
  complemento.value = ''
  phones.value = [{ number: '' }]
  email.value = ''
  textarea.value.ObservacoesGerais = ''
  formRef.value?.resetValidation()
}

function addPhone() {
  phones.value.push({ number: '' })
}

function removePhone(index: number) {
  phones.value.splice(index, 1)
}

function onInputCpf(e: Event) {
  const input = e.target as HTMLInputElement
  cpf.value = formatCpf(input.value)
}

function onInputRg(e: Event) {
  const input = e.target as HTMLInputElement
  rg.value = formatRg(input.value)
}

function onInputCep(e: Event) {
  const input = e.target as HTMLInputElement
  const valorFormatado = formatCep(input.value)
  cep.value = valorFormatado

  const cepLimpo = limparCep(valorFormatado)
  if (cepLimpo.length === 8) {
    buscarEnderecoViaCep(cepLimpo)
      .then(data => {
        rua.value = data.logradouro || ''
        bairro.value = data.bairro || ''
      })
      .catch(() => {
        rua.value = ''
        bairro.value = ''
      })
  } else {
    rua.value = ''
    bairro.value = ''
  }
}

async function carregarEstados() {
  const resposta = await getEstados()
  // Antes de atribuir ao combo
  estados.value = resposta.map((estado: any) => (
    `${estado.nome} (${estado.sigla})`))

  console.log("Estados: ", estados.value)
}

// Carregar cidades com base no estado selecionado
async function carregarCidades() {
  if (estadoSelecionado.value) {
    // Extrai a sigla entre parênteses
    const match = estadoSelecionado.value.match(/\(([^)]+)\)/);
    const siglaEstado = match ? match[1] : null;

    if (siglaEstado) {
      const resposta = await getCidadesPorEstado(siglaEstado);
      cidades.value = resposta.map((cidade: any) => (
        `${cidade.nome}`))
    } else {
      cidades.value = [];
      cidadeSelecionada.value = null;
    }
  } else {
    cidades.value = [];
    cidadeSelecionada.value = null;
  }
}

watch(estadoSelecionado, () => {
  if (estadoSelecionado.value) {
    cidadeSelecionada.value = null; // Reseta a cidade selecionada ao mudar estado
    carregarCidades()
  }
  if (estadoSelecionado.value === null) {
    cidadeSelecionada.value = null; // Reseta a cidade selecionada ao mudar estado
  }
})

watch(phones, (newPhones) => {
  newPhones.forEach((item, index) => {
    const formatted = formatPhoneNumber(item.number)
    if (formatted !== item.number) phones.value[index].number = formatted
  })
}, { deep: true })

carregarEstados()
</script>



<style lang="scss"></style>

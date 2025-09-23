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

            <textArea :modelValue="textarea.ObservacoesGerais" @update:modelValue="(value: any) => (textarea = value)"
              :label="'Observação'" class="wrap-textarea" :maxLength="300" placeholder="Observação...">
</textArea>

            <div class="container-btn mt-5">
              <p class="msg-auxiliar">Campos Obrigatórios*</p>
            </div>

            <div class="container-btn mt-5">
              <v-btn class="me-4 btn-padrao" type="submit">Salvar</v-btn>
            </div>
          </v-form>

        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { getCidadesPorEstado, getEstados, getEnderecoPorCep } from '../../services/ibge'
import { formatCep, limparCep, buscarEnderecoViaCep } from '../../utils/cepUtils'
import { formatCpf, formatRg, formatPhoneNumber } from '../../utils/formaUtils'

// COMPONENTES
import inputText from '@/components/inputText.vue'
import multipleCombobox from '@/components/select.vue'
import textArea from '@/components/textArea.vue'

defineOptions({ name: 'VeterinarioCadastro' })

const tab = ref(null)
const readOnly = ref(false)
const formRef = ref()

// Regras
const required = [(v: string) => !!v || 'Campo obrigatório']
const obsRules = [(v: string) => v.length <= 300 || 'Máximo 300 caracteres']


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


// Agora selecionados guardam o objeto, não string
const estadoSelecionado = ref<string | undefined>(undefined)
const cidadeSelecionada = ref<string | undefined>(undefined)

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
  carregarEstados()
})
</script>



<style lang="scss"></style>

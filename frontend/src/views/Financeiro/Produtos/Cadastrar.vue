<template>
  <v-alert
    v-if="showAlert"
    :type="alertType"
    class="mt-3"
    dismissible
    @click:close="showAlert = false"
  >
    {{ alertMessage }}
  </v-alert>

  <v-card v-if="!isLoading">
    <p class="title-page">
      Cadastro de Produtos & Serviços
      <img src="/src/assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
    </p>

    <p class="sub-page">
      Serviços / <span class="aba-atual">Cadastrar</span>
      <img src="/src/assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
    </p>

    <v-tabs v-model="tab">
      <v-tab value="one">Informações do Produto</v-tab>
      <v-tab value="two" v-if="produtoId">Gerenciar Produto</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <!-- Aba 1 -->
        <v-tabs-window-item value="one" class="pt-10">
          <v-form @submit.prevent="salvarOuEditarProduto">
            <inputText
              label="Nome*"
              type="text"
              required
              v-model:valueInput="textInputs['input-nome']"
              id="input-nome"
              style="max-width: 350px;"
            />

            <v-row class="row-padrao">
              <multipleCombobox
                v-model="categoria"
                :items="listCategoria"
                label="Categoria*"
                variant="outlined"
                id="categoria"
                :isRequired="true"
                :isMultipleSelect="false"
                class="container-combobox-padrao mt-4 mb-4"
                placeholder="Selecione a categoria"
                style="max-width: 350px;"
              />

              <multipleCombobox
                v-model="unidade"
                :items="listUnidade"
                label="Unidade de Medida*"
                variant="outlined"
                id="unidade"
                :isRequired="true"
                :isMultipleSelect="false"
                class="container-combobox-padrao mt-4 mb-4"
                placeholder="Selecione a unidade"
                style="max-width: 350px;"
                :disabled="!categoria"
              />
            </v-row>

            <inputText
              class="input-valor mt-2"
              label="Valor*"
              type="text"
              required
              :prefix="'R$'"
              v-model:valueInput="textInputs['input-valor']"
              id="input-valor"
              :maxLength="0"
              style="max-width: 120px;"
              @input="validateDecimalInput($event)"
            />

            <v-switch
              v-model="ativo"
              :label="ativo ? 'Status: ativo' : 'Status: inativo'"
              hide-details
            ></v-switch>

            <textArea
              :modelValue="textarea"
              @update:modelValue="(value: any) => (textarea = value)"
              :label="'Descrição / Observação'"
              class="wrap-textarea"
              :maxLength="300"
              placeholder="Detalhe mais sobre o serviço ou produto..."
            />

            <div class="container-btn mt-5">
              <p class="msg-auxiliar">Campos obrigatórios*</p>
            </div>

            <div class="container-btn mt-5">
              <v-btn class="btn-padrao" @click="limparCampos">Limpar Tudo</v-btn>
              <v-btn class="me-4 btn-padrao" type="submit">
                {{ produtoId ? 'Salvar Alterações' : 'Cadastrar Produto' }}
              </v-btn>
            </div>
          </v-form>
        </v-tabs-window-item>

        <!-- Aba 2 -->
        <v-tabs-window-item value="two" v-if="produtoId" class="pt-5">
            <v-row class="ma-0 row-cards">
          <v-card class="pa-2 gerenciar">
            <v-card-title>
              {{ ativo ? 'Desativar Produto' : 'Ativar Produto' }}
            </v-card-title>
            <v-card-text>
              Nesta aba, você, como administrador, pode
              {{ ativo ? 'desativar o produto selecionado. Essa ação impedirá que ele seja usado em novos atendimentos.' : 'reativar o produto selecionado, permitindo seu uso novamente no sistema.' }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="btn-padrao"
                :color="ativo ? 'error' : 'success'"
                @click="toggleAtivo"
              >
                {{ ativo ? 'Desativar Produto' : 'Ativar Produto' }}
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card class="pa-2 gerenciar mt-4">
            <v-card-title>Excluir Produto</v-card-title>
            <v-card-text>
              Esta ação é permanente e removerá todas as informações associadas a este produto.
              Deseja realmente excluir?
            </v-card-text>
            <v-card-actions>
              <v-btn color="error" class="btn-padrao" @click="excluirProduto">
                Excluir Produto
              </v-btn>
            </v-card-actions>
          </v-card>
          </v-row>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>

  <v-container
    v-if="isLoading"
    class="d-flex align-center justify-center"
    style="position: fixed; inset: 0; background: rgba(255,255,255,0.6); z-index: 9999;"
  >
    <v-progress-circular indeterminate color="#ff8200" size="50" width="5" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// COMPONENTES
import inputText from '@/components/inputText.vue'
import multipleCombobox from '@/components/select.vue'
import textArea from '@/components/textArea.vue'

// SERVICES
import { salvarProduto, editarProduto, recuperarProdutoPorId, deletarProduto } from '@/services/produtos'
import { useAppStore } from '@/modules/commons/store'

const appStore = useAppStore()
const router = useRouter()
const route = useRoute()

// Controles e estados
const tab = ref('one')
const showAlert = ref(false)
const alertType = ref<'error' | 'success'>('success')
const alertMessage = ref('')
const isLoading = ref(false)
const produtoId = ref(route.params.id || null)

// Inputs
const textInputs = ref<Record<string, string>>({})
const categoria = ref()
const unidade = ref()
const ativo = ref(true)
const textarea = ref('')

// Listas
const listCategoria = ref(['Serviço', 'Medicamento', 'Exame', 'Procedimento', 'Alimento' , 'Outra'])
const listUnidade = ref(['Unidade', 'Hora', 'Sessão', 'Caixa', 'Frasco', 'Kg', 'Litro', 'Outra'])

// Watcher dinâmico
watch(categoria, (nova) => {
  if (!nova) unidade.value = ''
})

// Função principal de salvar / editar
async function salvarOuEditarProduto() {
  if (!textInputs.value['input-nome'] || !categoria.value || !unidade.value || !textInputs.value['input-valor']) {
    mostrarAlerta('Preencha todos os campos obrigatórios!', 'error')
    return
  }

  const payload = {
    nome: textInputs.value['input-nome'],
    categoria: categoria.value,
    unidade_medida: unidade.value,
    clinica: appStore.userData?.clinicas?.[0]?.id,
    observacao: textarea.value || '',
    ativo: ativo.value,
    valor: textInputs.value['input-valor'].replace(',', '.')
  }

  try {
    isLoading.value = true

    if (produtoId.value) {
      await editarProduto(produtoId.value, payload)
      mostrarAlerta('Produto atualizado com sucesso!', 'success')
    } else {
      await salvarProduto(payload)
      mostrarAlerta('Produto cadastrado com sucesso!', 'success')
    }

    router.push({ name: 'ProdutosList' })
  } catch (e) {
    mostrarAlerta('Erro ao salvar produto.', 'error')
  } finally {
    isLoading.value = false
  }
}

// Alternar ativo/inativo
async function toggleAtivo() {
  ativo.value = !ativo.value
  await salvarOuEditarProduto()
}

// Excluir produto
async function excluirProduto() {
  try {
    isLoading.value = true
    await deletarProduto(produtoId.value)
    mostrarAlerta('Produto excluído com sucesso!', 'success')
    router.push({ name: 'ProdutosList' })
  } catch (e) {
    mostrarAlerta('Erro ao excluir produto.', 'error')
  } finally {
    isLoading.value = false
  }
}

// Buscar produto existente
async function carregarProduto() {
  if (!produtoId.value) return
  try {
    isLoading.value = true
    const data = await recuperarProdutoPorId(produtoId.value)
    textInputs.value['input-nome'] = data.nome
    categoria.value = data.categoria
    unidade.value = data.unidade_medida
    textarea.value = data.observacao
    ativo.value = data.ativo
    textInputs.value['input-valor'] = data.valor.replace('.', ',')
  } catch (e) {
    mostrarAlerta('Erro ao carregar produto.', 'error')
  } finally {
    isLoading.value = false
  }
}

// Formatação de valores
function validateDecimalInput(event: Event) {
  const input = event.target as HTMLInputElement
  let digits = input.value.replace(/\D/g, '')
  digits = digits.replace(/^0+/, '')
  if (digits === '') digits = '0'
  if (digits.length > 8) digits = digits.slice(0, 8)
  let formatted = digits.length <= 2
    ? '0,' + digits.padStart(2, '0')
    : digits.slice(0, -2) + ',' + digits.slice(-2)
  input.value = formatted
  textInputs.value[input.id] = formatted
}

// Limpar campos
function limparCampos() {
  textInputs.value = {}
  categoria.value = ''
  unidade.value = ''
  textarea.value = ''
  ativo.value = true
}

// Exibir alerta
function mostrarAlerta(msg: string, tipo: 'error' | 'success') {
  alertMessage.value = msg
  alertType.value = tipo
  showAlert.value = true
  setTimeout(() => (showAlert.value = false), 4000)
}

onMounted(() => {
  if (produtoId.value) carregarProduto()
})
</script>

<style lang="scss">
.row-cards {
  gap: 40px;
}
.gerenciar {
  border: 1px solid #ddd;
  border-radius: 8px;  
  max-width: 400px;
}
</style>

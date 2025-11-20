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

  <v-row>
    <v-col>
      <span class="title-page">Produtos e Serviços</span>
      <br />
      <span class="breadcrumb">
        Produtos / <span class="page-active">Lista de Produtos e Serviços</span>
      </span>

      <v-data-table
        v-if="!isLoading"
        :headers="headers"
        :items="paginatedProdutos"
        :items-per-page="-1"
        class="pt-15"
      >
        <!-- Nome -->
        <template #item.nome="{ item }">
          {{ item.nome }}
        </template>

        <!-- Categoria -->
        <template #item.categoria="{ item }">
          {{ item.categoria || 'Não informado' }}
        </template>

        <!-- Unidade de Medida -->
        <template #item.unidade_medida="{ item }">
          {{ item.unidade_medida || '-' }}
        </template>

        <!-- Valor -->
        <template #item.valor="{ item }">
          R$ {{ Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
        </template>

        <!-- Status -->
        <template #item.ativo="{ item }">
          <v-chip :color="item.ativo ? 'green' : 'red'" class="text-white" size="small">
            {{ item.ativo ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <!-- Ações -->
        <template #item.actions="{ item }">
          <v-btn icon @click="visualizar(item.id)" color="#434343" variant="text">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>

        <!-- Rodapé -->
        <template #bottom>
          <div v-if="produtos.length > 5" class="custom-footer">
            <span>
              {{ startIndex }} - {{ endIndex }} de {{ produtos.length }}
            </span>

            <div class="container-pagination">
              <v-btn class="btn-pagination" icon @click="prevPage" :disabled="page <= 1">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn class="btn-pagination" icon @click="nextPage" :disabled="page >= pageCount">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>

            <v-select
              v-model="itemsPerPage"
              :items="[5, 10, 20]"
              label="Itens por página"
              density="compact"
              hide-details
              variant="outlined"
              style="max-width: 90px"
            />
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <!-- Spinner de Carregamento -->
  <v-container v-if="isLoading" class="d-flex align-center justify-center">
    <v-progress-circular
      indeterminate
      color="#ff8200"
      size="40"
      width="5"
    ></v-progress-circular>
  </v-container>
</template>

<script setup lang="ts">
import { recuperarProduto } from '@/services/produtos'
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'ProdutosList',
})

const headers = ref([
  { title: 'Nome', key: 'nome' },
  { title: 'Categoria', key: 'categoria' },
  { title: 'Unidade de Medida', key: 'unidade_medida' },
  { title: 'Valor', key: 'valor' },
  { title: 'Status', key: 'ativo' },
  { title: 'Ações', key: 'actions', sortable: false },
])

const produtos = ref<any[]>([])
const page = ref(1)
const itemsPerPage = ref(5)
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error')
const isLoading = ref(false)
const router = useRouter()

watch(itemsPerPage, () => {
  page.value = 1
})

const pageCount = computed(() => Math.ceil(produtos.value.length / itemsPerPage.value))
const startIndex = computed(() =>
  produtos.value.length === 0 ? 0 : (page.value - 1) * itemsPerPage.value + 1
)
const endIndex = computed(() => Math.min(page.value * itemsPerPage.value, produtos.value.length))
const paginatedProdutos = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return produtos.value.slice(start, end)
})

function nextPage() {
  if (page.value < pageCount.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

function visualizar(id: any) {
  router.push({ name: 'ProdutoCadastrar', params: { id } })
}

const listarProdutos = async () => {
  try {
    const response = await recuperarProduto()
    produtos.value = response
  } catch (error: any) {
    alertMessage.value =
      error?.msg || 'Ocorreu um erro ao carregar os produtos e serviços.'
    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  await listarProdutos()
})
</script>

<style lang="scss">
thead {
  background: #ffe9d2;

  th {
    height: 50px !important;
    border-bottom: none !important;

    span {
      color: #434343;
      font-weight: 600;
    }
  }

  tr > th:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  tr > th:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}

.v-btn {
  transition: none !important;

  &:hover > .v-btn__overlay {
    background: transparent !important;
  }

  .v-icon:hover {
    color: #d31b27ca !important;
  }
}

.v-icon {
  color: #434343;
}
</style>

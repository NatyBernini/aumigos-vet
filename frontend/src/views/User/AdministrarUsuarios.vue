<template>
    <v-card class="card-informativo mb-7"><v-icon class="mr-2">mdi-alert-circle</v-icon>
        Nesta aba, você, como administrador, pode visualizar e gerenciar usuários da clínica.
    </v-card>
    <div class="info-box" v-if="!isLoading">
        <span class="span-info-box">Administrar Usuários
            <v-btn color="accent" large @click.stop="showScheduleForm = true" class="btn-padrao">
                Cadastrar Novo Usuário
                <v-icon class="icon-close ml-3">mdi-format-align-left</v-icon>
            </v-btn>
        </span>
    </div>

    <v-data-table v-if="!isLoading" :headers="headers" :items="paginatedPacientes" :items-per-page="-1" class="mt-5">

        <!-- Colunas personalizadas -->
        <template #item.nome="{ item }">
            {{ item.nome }}
        </template>
        <template #item.email="{ item }">
            {{ item.email }}
        </template>
        <template #item.tipo="{ item }">
            {{ item.tipo }}
        </template>
        <template #item.actions="{ item }">
            <v-btn icon @click="visualizar(item)" color="#434343" variant="text">
                <v-icon>mdi-eye</v-icon>
            </v-btn>
        </template>

        <!-- Rodapé customizado -->
        <template #bottom>
            <div class="custom-footer">
                <!-- Contador -->
                <span>
                    {{ startIndex }} - {{ endIndex }} de {{ pacientes.length }}
                </span>

                <!-- Navegação manual -->
                <div class="container-pagination">
                    <v-btn class="btn-pagination" icon @click="prevPage" :disabled="page <= 1">
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn class="btn-pagination" icon @click="nextPage" :disabled="page >= pageCount">
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </div>

                <!-- Itens por página -->
                <v-select v-model="itemsPerPage" :items="[5, 10, 20]" label="Itens por página" density="compact"
                    hide-details variant="outlined" style="max-width: 90px" />
            </div>
        </template>
    </v-data-table>


    <!-- Spinner de Carregamento -->
    <v-container v-if="isLoading" class="d-flex align-center justify-center">
        <v-progress-circular indeterminate color="primary" size="40" width="5"></v-progress-circular>
    </v-container>
    <ModalCadastrarUsuarios v-if="!isLoading" :isOpen="showScheduleForm" @usuarioCadastrado="handleModalClose"
        @update:isOpen="showScheduleForm = $event" />
    <ModalVisualizarUsuario :userData="usuarioSelecionado" :isOpen="showVisualizarDialog"
        @update:isOpen="showVisualizarDialog = $event" @usuarioAtualizado="loadUsuarios" />

</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
// COMPONENTES
import ModalCadastrarUsuarios from './ModalCadastrarUsuarios.vue'
import ModalVisualizarUsuario from './ModalVisualizarUsuario.vue'

// SERVICES
import { usuariosClinica } from '@/services/clinica'

const isLoading = ref(false)
const showScheduleForm = ref(false)


const headers = ref([
    { title: 'Nome do Veterinário', key: 'nome' },
    { title: 'Email', key: 'email' },
    { title: 'Tipo', key: 'tipo' },
    { title: 'Ações', key: 'actions', sortable: false },
])

const pacientes = ref<any[]>([])

const page = ref(1)
const itemsPerPage = ref(5)

// Quando itemsPerPage muda, resetar a página para 1
watch(itemsPerPage, () => {
    page.value = 1
})

const pageCount = computed(() =>
    Math.ceil(pacientes.value.length / itemsPerPage.value)
)

const startIndex = computed(() =>
    pacientes.value.length === 0 ? 0 : (page.value - 1) * itemsPerPage.value + 1
)

const endIndex = computed(() =>
    Math.min(page.value * itemsPerPage.value, pacientes.value.length)
)

const paginatedPacientes = computed(() => {
    const start = (page.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return pacientes.value.slice(start, end)
})

function nextPage() {
    if (page.value < pageCount.value) {
        page.value++
    }
}

function prevPage() {
    if (page.value > 1) {
        page.value--
    }
}

// 🔹 Função para buscar usuários
async function loadUsuarios() {
    try {
        isLoading.value = true
        const response = await usuariosClinica()
        pacientes.value = response.map((user: any) => ({
            nome: `${user.first_name} ${user.last_name}`,
            email: user.email,
            tipo: user.tipo_usuario,
        }))
    } catch (err) {
        console.error('Erro ao buscar usuários:', err)
    } finally {
        isLoading.value = false
    }
}

function handleModalClose() {
    loadUsuarios()
}

const usuarioSelecionado = ref(null)
const showVisualizarDialog = ref(false)

function visualizar(item: any) {
    usuarioSelecionado.value = item
    showVisualizarDialog.value = true
}

onMounted(() => {
    loadUsuarios()
})

</script>
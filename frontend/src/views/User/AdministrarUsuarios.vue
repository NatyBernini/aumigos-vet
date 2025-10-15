<template>
    <v-card class="card-informativo mb-7"><v-icon class="mr-2">mdi-alert-circle</v-icon>
        Nesta aba, você, como administrador, pode visualizar e gerenciar usuários/funcionários da clínica.
    </v-card>
    <div class="info-box" v-if="!isLoading">
        <span class="span-info-box">Administrar Funcionários
            <v-btn color="accent" large @click.stop="showScheduleForm = true" class="btn-padrao">
                Cadastrar Novo Usuário
                <v-icon class="icon-close ml-3">mdi-account-multiple-plus</v-icon>
            </v-btn>
        </span>
    </div>

    <v-data-table v-if="!isLoading" :headers="headers" :items="paginatedPacientes" :items-per-page="-1" class="mt-5">

        <!-- Colunas personalizadas -->
        <template #item.nome="{ item }">
            {{ item.pessoa?.nome_completo }}
        </template>

        <template #item.email="{ item }">
            {{ item.email }}
        </template>

        <template #item.clinica="{ item }">
            {{ item.clinicas?.[0]?.nome || '-' }}
        </template>

        <template #item.tipo="{ item }">
            {{ item.tipo_usuario }}
        </template>

        <template #item.actions="{ item }">
            <!-- Ícone Visualizar -->
            <v-tooltip text="Visualizar detalhes" location="bottom" open-delay="300">
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon color="#434343" variant="text" @click="visualizar(item, 1)">
                        <v-icon>mdi-eye</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>

            <!-- Ícone Editar -->
            <v-tooltip text="Redefinir Senha" location="bottom" open-delay="300">
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon color="#434343" variant="text" @click="visualizar(item, 2)">
                        <v-icon>mdi-shield-key</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>

            <!-- Ícone Excluir  -->
            <v-tooltip text="Deletar Usuário" location="bottom" open-delay="300">
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon color="#434343" variant="text" @click="visualizar(item, 3)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
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

    <ModalRedefinirSenhaUsuarios :userData="usuarioSelecionado" :isOpen="showDialogRedefinirSenha"
        @update:isOpen="showDialogRedefinirSenha = $event" @usuarioAtualizado="loadUsuarios" />

    <modalConfirmacao v-if="!isLoading" :isOpen="showModalConfirmation" @update:isOpen="showModalConfirmation = $event"
        @confirm="deletarUsuario()" acao="o usuário será deletado permanentemente" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
// COMPONENTES
import ModalCadastrarUsuarios from './ModalCadastrarUsuarios.vue'
import ModalVisualizarUsuario from './ModalVisualizarUsuario.vue'
import ModalRedefinirSenhaUsuarios from './ModalRedefinirSenhaUsuarios.vue'
import modalConfirmacao from '@/components/modalConfirmacao.vue'

// SERVICES
import { usuariosClinica, deletarUsuarioClinica } from '@/services/clinica'
import { Usuario } from '@/services/types'

const isLoading = ref(false)
const showScheduleForm = ref(false)
const showModalConfirmation = ref(false)


const headers = ref([
    { title: 'Nome do Funcionário', key: 'nome' },
    { title: 'Email', key: 'email' },
    { title: 'Clínica', key: 'clinica' },
    { title: 'Tipo', key: 'tipo' },
    { title: 'Ações', key: 'actions', sortable: false },
])

const pacientes = ref<Usuario[]>([]) // lista de usuários
const usuarioSelecionado = ref<Usuario | null>(null) // selecionado


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

async function loadUsuarios() {
    try {
        isLoading.value = true
        const response = await usuariosClinica()

        pacientes.value = response.map((user: Usuario) => ({
            ...user, // mantém todos os dados originais
            nome: user.pessoa.nome_completo // adiciona campo extra opcional
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

const showVisualizarDialog = ref(false)
const showDialogRedefinirSenha = ref(false)

function visualizar(item: any, acao: number) {
    usuarioSelecionado.value = item
    if (acao === 1) showVisualizarDialog.value = true
    else if (acao === 2) showDialogRedefinirSenha.value = true
    else if (acao === 3) showModalConfirmation.value = true
}


const deletarUsuario = async () => {
    if (!usuarioSelecionado.value?.clinicas?.length) {
        console.error('Usuário selecionado inválido:', usuarioSelecionado.value)
        return
    }

    try {
        await deletarUsuarioClinica(
            usuarioSelecionado.value.clinicas[0].id,
            usuarioSelecionado.value.id
        )
        await loadUsuarios()
    } catch (err) {
        console.error('Erro ao deletar usuário:', err)
    }
}

onMounted(() => {
    loadUsuarios()
})

</script>
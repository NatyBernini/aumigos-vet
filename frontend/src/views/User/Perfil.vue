<template>
    <v-app>
        <!-- Drawer lateral -->
        <v-navigation-drawer v-model="drawer" app :permanent="!isMobile" :temporary="isMobile" width="280"
            :class="['container-acoes-user', { 'drawer-oculto-mobile': isMobile && !drawer }]">
            <!-- Conteúdo do drawer -->
            <div class="drawer-content">
                <!-- Cabeçalho do usuário -->
                <div class="user-header">
                    <div class="d-flex align-center justify-center pa-10">
                        <img src="../../assets/icons/avatar-do-usuario.png" alt="Ícone"
                            class="menu-title-icon mt-2 mb-2" />
                    </div>
                    <p class="user-nome">{{ appStore.userData?.pessoa.nome_completo || '-' }}</p>
                    <p class="user-cargo">{{ appStore.userData?.tipo_usuario || '-' }}</p>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Lista de abas -->
                <v-list density="compact" nav>
                    <v-list-item v-for="opcao in opcoes" :key="opcao.value" :title="opcao.label"
                        @click="abaAtiva = opcao.value" :class="{ ativo: abaAtiva === opcao.value }" />
                </v-list>
            </div>

            <!-- Rodapé fixo com logout -->
            <div class="drawer-footer">
                <v-divider></v-divider>
                <v-list-item @click="logoutUser">
                    <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
            </div>
        </v-navigation-drawer>

        <!-- AppBar com botão hamburguer no mobile -->
        <v-app-bar class="menu-mobile" app>
            <v-app-bar-nav-icon v-if="isMobile" @click="drawer = !drawer" />
        </v-app-bar>

        <!-- Conteúdo principal -->
        <v-main>
            <v-alert v-if="showAlert" :type="alertType" class="mt-3" dismissible @click:close="showAlert = false">
                {{ alertMessage }}
            </v-alert>
            <div :class="['container-conteudo-user', isMobile ? (drawer ? 'pa-15' : 'pa-3') : 'pa-15']">
                <div class="container-btn mt-5 mb-10">
                    <h2>Perfil do Usuário</h2>
                    <v-btn class="btn-padrao" to="/pacientes">Voltar para Home</v-btn>
                </div>

                <!-- Aba: Informações Pessoais -->
                <div v-if="abaAtiva === 'informacoes'">
                    <v-card class="card-informativo mb-7"><v-icon class="mr-2">mdi-alert-circle</v-icon>
                        Nesta aba você encontra todos os seus dados pessoais e informações da clínica associada.
                        <br> Para alterar qualquer informação, clique no botão <strong>"Editar Cadastro"</strong>.
                    </v-card>

                    <div class="info-sections">
                        <!-- Informações Pessoais -->
                        <div class="info-box">
                            <h3 class="mb-6">Informações Pessoais</h3>
                            <inputText label="Nome Completo" type="text" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-nome']" :disabled="true" />
                            <inputText label="CPF" type="text" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-cpf']" :disabled="true" />
                            <inputText label="E-mail" type="text" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-email']" :disabled="true" />
                            <inputText label="Data de Nascimento" type="date" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-data-nasc']" :disabled="true" />
                            <div class="container-btn mt-5">
                                <v-btn class="me-4 btn-padrao" type="submit">Editar Cadastro</v-btn>
                            </div>
                        </div>

                        <!-- Informações da Clínica -->
                        <div class="info-box">
                            <h3 class="mb-6">Informações da Clínica</h3>
                            <inputText label="Nome da Clínica" type="text" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-clinica']" :disabled="true" />
                            <inputText label="CNPJ" type="text" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-cnpj']" :disabled="true" />
                            <inputText label="Data de Criação" type="text" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-data-criacao']" :disabled="true" />
                            <div class="container-btn mt-5" v-if="appStore.userData?.tipo_usuario === 'admin_clinica'">
                                <v-btn class="me-4 btn-padrao" type="submit">Editar Clínica</v-btn>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Aba: Assinatura (apenas admin) -->
                <div v-else-if="abaAtiva === 'assinatura' && appStore.userData?.tipo_usuario === 'admin_clinica'">
                    <v-card class="card-informativo mb-7"><v-icon class="mr-2">mdi-alert-circle</v-icon>
                        Nesta aba, você pode gerenciar e editar o <strong>plano de assinatura da clínica</strong>.
                    </v-card>

                    <div class="info-sections mt-10">
                        <div class="info-box">
                            <h3 class="mb-6">Plano Ativo</h3>
                            <inputText label="Plano" type="text" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-plano']" :disabled="true" />
                            <inputText label="Preço Anual" type="text" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-preco-anual']" :disabled="true" />
                            <inputText label="Preço Mensal" type="text" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-preco-mensal']" :disabled="true" />
                            <inputText label="Usuários Simultâneos" type="text" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-usuarios']" :disabled="true" />
                            <div class="container-btn mt-5">
                                <v-btn class="me-4 btn-padrao" to="/planos">Editar Plano</v-btn>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Aba: Redefinir Senha -->
                <div v-else-if="abaAtiva === 'senha'">
                    <v-card class="card-informativo mb-7"><v-icon class="mr-2">mdi-alert-circle</v-icon>
                        Nesta aba, você pode atualizar a senha da sua conta.
                    </v-card>
                    <h3 class="mb-5">Redefinir Senha</h3>
                    <v-form class="formulario-autenticacao" @submit.prevent>
                        <inputText label="Senha atual*" v-model:valueInput="textInputs[`input-senha`]" id="input-senha"
                            :type="showPassword ? 'text' : 'password'"
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="showPassword = !showPassword" required :maxLength="0" />
                        <inputText label="Nova senha*" v-model:valueInput="textInputs[`input-nova-senha`]"
                            id="input-senha" :type="showNewPassword ? 'text' : 'password'"
                            :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="showNewPassword = !showNewPassword" required :maxLength="0" />

                        <div class="container-btn mt-5">
                            <v-btn class="me-4 btn-padrao" @click="redefineSenha"
                                :disabled="isLoading || !textInputs[`input-nova-senha`] || !textInputs[`input-senha`]"
                                :loading="isLoading">Redefinir</v-btn>
                        </div>
                    </v-form>
                </div>

                <!-- Aba: Administrar Usuários (apenas admin) -->
                <div v-else-if="abaAtiva === 'usuarios' && appStore.userData?.tipo_usuario === 'admin_clinica'">
                    <v-card class="card-informativo mb-7"><v-icon class="mr-2">mdi-alert-circle</v-icon>
                        Nesta aba, você, como administrador, pode visualizar e gerenciar usuários da clínica.
                    </v-card>
                    <div class="info-box">
                        <h3>Administrar Usuários
                            <v-btn color="accent" large @click.stop="showScheduleForm = true"
                                class="btn-padrao">
                                Cadastrar Novo Usuário
                                <v-icon class="icon-close ml-3">mdi-format-align-left</v-icon>
                            </v-btn>
                        </h3>
                    </div>
                </div>
            </div>
        </v-main>
    </v-app>

    <!-- Spinner de Carregamento -->
    <v-container v-if="isLoading" class="d-flex align-center justify-center">
        <v-progress-circular indeterminate color="primary" size="40" width="5"></v-progress-circular>
    </v-container>
    <ModalCadastrarUsuarios :isOpen="showScheduleForm" @update:isOpen="showScheduleForm = $event" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/modules/commons/store'
import { formatCpf } from '@/utils/formaUtils'
import { useRouter } from 'vue-router'

// SERVICES
import { redefinirSenha } from '@/services/auth'
import { usuariosClinica } from '@/services/clinica'

// COMPONENTES
import ModalCadastrarUsuarios from './ModalCadastrarUsuarios.vue'
import inputText from '@/components/inputText.vue'

const router = useRouter()
const appStore = useAppStore()

const logoutUser = () => {
  appStore.logout()
}

type Aba = 'informacoes' | 'assinatura' | 'senha' | 'usuarios'
const abaAtiva = ref<Aba>('informacoes')

const textInputs = ref<Record<string, string>>({})
const showPassword = ref(false)
const showNewPassword = ref(false)
const isLoading = ref(false)
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error')
const showScheduleForm = ref(false)

// Lista de abas visíveis
const opcoes = ref<{ label: string; value: Aba }[]>([
  { label: 'Informações Pessoais', value: 'informacoes' },
  { label: 'Redefinir Senha', value: 'senha' }
])

// Drawer e responsividade
const drawer = ref(true)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 960
  drawer.value = !isMobile.value
}

const redefineSenha = async () => {
  const dados = {
    senha_atual: textInputs.value['input-senha'],
    nova_senha: textInputs.value['input-nova-senha']
  }
  try {
    isLoading.value = true
    const response = await redefinirSenha(dados)
    alertMessage.value = response.detail
    alertType.value = 'success'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
  } catch (error: any) {
    if (error.tipo === 'VALIDATION' && error.errors) {
      const firstKey = Object.keys(error.errors)[0]
      alertMessage.value = error.errors[firstKey][0]
    } else if (error.tipo === 'ERROR') {
      alertMessage.value = error.msg
    } else {
      alertMessage.value = 'Ocorreu um erro inesperado'
    }
    alertType.value = 'error'
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 5000)
    throw error
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
//   await usuariosClinica()
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // popula dados do usuário
  textInputs.value['input-nome'] = appStore.userData?.pessoa.nome_completo || '-'
  textInputs.value['input-cpf'] = formatCpf(appStore.userData?.pessoa.cpf ?? '') || '-'
  textInputs.value['input-email'] = appStore.userData?.email || '-'
  textInputs.value['input-data-nasc'] = appStore.userData?.pessoa.data_nascimento || '-'
  textInputs.value['input-clinica'] = appStore.userData?.clinicas[0].nome || '-'
  textInputs.value['input-cnpj'] = appStore.userData?.clinicas[0].cnpj || '-'
  textInputs.value['input-data-criacao'] = appStore.userData?.clinicas[0].criado_em || '-'
  textInputs.value['input-plano'] = appStore.userData?.clinicas[0].plano.nome || '-'
  textInputs.value['input-preco-anual'] = appStore.userData?.clinicas[0].plano.preco_anual || '-'
  textInputs.value['input-preco-mensal'] = appStore.userData?.clinicas[0].plano.preco_mensal || '-'
  textInputs.value['input-usuarios'] = appStore.userData?.clinicas[0].plano.usuarios_simultaneos || '-'

  // adiciona abas de admin
  if (appStore.userData?.tipo_usuario === 'admin_clinica') {
    opcoes.value.push({ label: 'Assinatura', value: 'assinatura' })
    opcoes.value.push({ label: 'Administrar Usuários', value: 'usuarios' })
  }

  isLoading.value = false
})
</script>

<style lang="scss">
.container-acoes-user {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    margin: 35px;
    height: calc(100% - 70px) !important;
    display: flex;
    flex-direction: column;
    position: relative;

    .drawer-content {
        flex: 1;
        overflow-y: auto; // permite scroll do conteúdo sem afetar o footer
        padding-bottom: 50px; // espaço para não esconder conteúdo atrás do footer
    }

    .drawer-footer {
        position: absolute;
        bottom: 0;
        width: 85%;
    }

    .user-nome {
        font-weight: bold;
        font-size: 18px;
    }

    .user-cargo {
        font-size: 14px;
        color: gray;
    }

    // Ajuste para quando o drawer estiver oculto no mobile
    &.drawer-oculto-mobile {
        margin: 0;
    }

    .v-list-item {
        cursor: pointer;
        border-radius: 10px;
        padding: 10px;


        .v-list-item-title {
            font-size: 16px !important;
        }

        &.ativo {
            background-color: #ff8200;
            color: #fff;
        }
    }

}

.menu-mobile {
    border: none !important;
}

.container-conteudo-user {
    flex: 1;
    overflow-y: auto;

    .info-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 30px;
    }

    .info-box {
        background: #fafafa;
        border-radius: 12px;
        padding: 20px;
        min-width: 300px;
        max-width: 725px;

        .input-text-container {
            margin-bottom: 35px !important;
        }
    }
}
</style>

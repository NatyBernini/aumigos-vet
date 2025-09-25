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
            <div :class="['container-conteudo-user', isMobile ? (drawer ? 'pa-15' : 'pa-3') : 'pa-15']">
                <div class="container-btn mt-5 mb-10">
                    <h2>Perfil do Usuário</h2>
                    <v-btn class="btn-padrao" to="/pacientes">Voltar para Home</v-btn>
                </div>
                <!-- Aba: Informações Pessoais / Clínica / Plano -->
                <div v-if="abaAtiva === 'informacoes'">
                    <v-card class="card-informativo mb-7"><v-icon class="mr-2">mdi-alert-circle</v-icon> Nesta aba você
                        encontra todos os seus dados pessoais e informações da clínica associada.
                        <br> Para alterar qualquer informação, clique no botão <strong>"Editar
                            Cadastro"</strong>.</v-card>

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
                            <inputText label="Data de Nascimento" type="text" :ocultaContador="true"
                                v-model:valueInput="textInputs['input-data-nasc']" :disabled="true" />
                            <div class="container-btn mt-5">
                                <v-btn class="me-4 btn-padrao " type="submit">Editar Cadastro</v-btn>
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
                            <div class="container-btn mt-5">
                                <v-btn class="me-4 btn-padrao" type="submit">Editar Clínica</v-btn>
                            </div>
                        </div>
                    </div>




                    <div class="info-sections mt-10">
                        <!-- Plano Ativo -->
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
                    <v-card class="card-informativo mb-7"><v-icon class="mr-2">mdi-alert-circle</v-icon> Nesta aba, você
                        pode atualizar a senha da sua conta para manter sua segurança. <br> Para alterar a senha,
                        preencha os
                        campos abaixo com sua senha atual e a nova senha desejada.</v-card>
                    <div class="info-box">
                        <h3>Redefinir Senha</h3>
                        <!-- Conteúdo da redefinição de senha -->
                    </div>
                </div>

                <!-- Aba: Administrar Usuários -->
                <div v-else-if="abaAtiva === 'usuarios'">
                    <v-card class="card-informativo mb-7"><v-icon class="mr-2">mdi-alert-circle</v-icon> Nesta aba,
                        você, como administrador, pode visualizar todos os usuários associados à clínica. <br> Além disso, é
                        possível adicionar novos usuários, atribuir funções e gerenciar permissões para garantir que
                        todos tenham acesso adequado às funcionalidades do sistema.</v-card>
                    <div class="info-box">
                        <h3>Administrar Usuários</h3>
                        <!-- Conteúdo da administração de usuários -->
                    </div>
                </div>
            </div>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/modules/commons/store'
import inputText from '@/components/inputText.vue'
import { formatCpf } from '@/utils/formaUtils'
import { useRouter } from 'vue-router';

const router = useRouter();
const appStore = useAppStore();

const logoutUser = () => {
    appStore.logout();
};


type Aba = 'informacoes' | 'senha' | 'usuarios'
const abaAtiva = ref<Aba>('informacoes')

const textInputs = ref<Record<string, string>>({})

const opcoes: { label: string; value: Aba }[] = [
    { label: 'Informações Pessoais', value: 'informacoes' },
    { label: 'Redefinir Senha', value: 'senha' },
    { label: 'Administrar Usuários', value: 'usuarios' },
]

// Controle do drawer e responsividade
const drawer = ref(true)
const isMobile = ref(false)

const checkMobile = () => {
    isMobile.value = window.innerWidth < 960
    if (isMobile.value) {
        drawer.value = false
    } else {
        drawer.value = true
    }
}


onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)

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

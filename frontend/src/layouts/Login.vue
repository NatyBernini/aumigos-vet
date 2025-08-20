<template>
    <div class="auth-background d-flex justify-center align-center fill-height">
        <!-- meias circunferências -->
        <div class="half-circle bottom-left"></div>
        <div class="half-circle top-right"></div>

        <v-window v-model="step" class="w-100 auth-card">

            <!-- Tela de Login -->
            <v-window-item :value="0">
                <v-card class="d-flex align-center justify-center" height="80vh">
                    <v-row class="ma-0" style="height: 100%;">
                        <!-- Coluna lateral oculta em mobile -->
                        <v-col cols="4" class="welcome-side-login d-none d-md-flex flex-column justify-center pa-6"  :style="{ backgroundImage: `url(${BannerLogin})` }">
                        </v-col>

                        <!-- Coluna principal -->
                        <v-col cols="12" md="8" class="pa-4 coluna-scroll">
                            <div class="conteudo-centralizado">
                                <h1 class="font-weight-bold mb-4">Bem-vindo de volta AUmigo!</h1>
                                <h2 class="mb-6">Login</h2>

                                <v-form class="formulario-autenticacao" @submit.prevent>
                                    <v-text-field v-model="email" label="E-mail" type="email"
                                        append-inner-icon="mdi-email" class="mb-4" required />

                                    <v-text-field v-model="senha" :type="showPassword ? 'text' : 'password'"
                                        label="Senha" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                        @click:append-inner="showPassword = !showPassword" class="mb-2" required />

                                    <div class="text-end mb-4">
                                        <v-btn variant="text" color="primary" class="text-caption"
                                            @click="onForgotPassword">
                                            Esqueceu a senha?
                                        </v-btn>
                                    </div>

                                    <v-btn color="secondary" class="mb-4" block @click="onLogin">
                                        Entrar
                                    </v-btn>
                                </v-form>

                                <div class="mensagem-informativa d-flex align-center justify-center flex-wrap mt-6">
                                    <p>Não possui cadastro?</p>
                                    <v-btn class="pa-0 pl-2" variant="text" color="secondary" @click="step = 1">
                                        Criar uma conta
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-window-item>


            <!-- Tela de Cadastro -->
            <v-window-item :value="1">
                <v-card class="d-flex align-center justify-center" height="80vh">
                    <v-row class="ma-0" style="height: 100%;">
                        <!-- Coluna principal -->
                        <v-col cols="12" md="8" class="pa-4 coluna-scroll">
                            <div class="conteudo-centralizado">
                                <h1 class="font-weight-bold mb-4">Bem-vindo AUmigo!</h1>
                                <h2 class="mb-6">Criar uma conta</h2>

                                <v-form class="formulario-autenticacao" @submit.prevent>
                                    <v-text-field v-model="nome" label="Nome Completo" append-inner-icon="mdi-account"
                                        class="mb-4" required />

                                    <v-text-field v-model="telefone" label="Telefone" append-inner-icon="mdi-phone"
                                        class="mb-4" required />

                                    <v-text-field v-model="emailCadastro" label="E-mail" type="email"
                                        append-inner-icon="mdi-email" class="mb-4" required />

                                    <v-text-field v-model="senhaCadastro" label="Senha" :type="showPasswordCadastro ? 'text' : 'password'"
                                         :append-inner-icon="showPasswordCadastro ? 'mdi-eye-off' : 'mdi-eye'"
                                        @click:append-inner="showPasswordCadastro = !showPasswordCadastro" class="mb-4" required />

                                    <v-btn color="secondary" block class="mb-4" @click="onCadastrar">
                                        Cadastrar
                                    </v-btn>
                                </v-form>

                                <p class="mensagem-informativa text-center mt-10">
                                    Para criar sua conta, é necessário ler e aceitar os <br>
                                    <span class="font-weight-bold text-primary">Termos de Uso</span> e a
                                    <span class="font-weight-bold text-primary">Política de Privacidade</span>.
                                </p>

                                <div class="mensagem-informativa d-flex align-center justify-center flex-wrap mt-6">
                                    <p>Possui uma conta?</p>
                                    <v-btn class="pa-0" color="secondary" variant="text" @click="step = 0">
                                        Login
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>

                        <!-- Coluna lateral oculta em mobile -->
                        <v-col cols="4" class="welcome-side-cadastro d-none d-md-flex flex-column justify-center pa-6"  :style="{ backgroundImage: `url(${BannerCadastro})` }">
                        </v-col>
                    </v-row>
                </v-card>
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import BannerCadastro from '../assets/Banner.png'
import BannerLogin from '../assets/BannerGato.png'
const step = ref(0)
// Login
const email = ref('')
const senha = ref('')
const showPassword = ref(false)

// Cadastro
const nome = ref('')
const telefone = ref('')
const senhaCadastro = ref('')
const emailCadastro = ref('')
const showPasswordCadastro = ref(false)


</script>

<style lang="scss">
.auth-background {
    position: relative;
    min-height: 100vh;
    background: #E8F5E9;
    overflow: visible;
    /* para mostrar as meias luas */
}

.half-circle {
    position: absolute;
    width: clamp(120px, 15vw, 200px);
    height: clamp(120px, 15vw, 200px);
    background-color: #FFD966;
    border-radius: 50%;
    z-index: 0;
}

/* meia circunferência inferior esquerda */
.bottom-left {
    bottom: 0;
    left: 0;
    clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
    transform: translateX(-50%);
}

/* meia circunferência superior direita */
.top-right {
    top: 0;
    right: 0;
    clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
    transform: translateX(50%);
}

.auth-card {
    max-width: 60%;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    background-color: white;
}

/* Fundo para o lado direito da tela de login */
.welcome-side-login {
   background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    color: #ffffff;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
}

/* Fundo para o lado direito da tela de cadastro */
.welcome-side-cadastro {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    color: #000;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
}

.welcome-content {
    background-color: rgba(255, 255, 255, 0.7);
    padding: 16px;
    border-radius: 8px;
}

.font-weight-bold {
    font-weight: bold;
}

.v-btn {
    padding: 8px;
    border-radius: 10px;
    height: auto !important;
    box-shadow: none;
}

.v-btn__content {
    text-wrap: auto !important;
}

.v-form.formulario-autenticacao {
    width: 60%;
}

.mensagem-informativa {
    font-size: 0.9rem;
}

.coluna-scroll {
    height: 100%;
    overflow-y: auto;
    /* controla scroll */
}

.conteudo-centralizado {
    min-height: 100%;
    /* ocupa altura total */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* centraliza vertical */
}



@media (max-width: 750px) {
    .v-form.formulario-autenticacao {
        width: 100%;
    }

    .auth-card {
        max-width: 80%;
    }
}
</style>

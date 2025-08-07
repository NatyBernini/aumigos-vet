<template>
    <div class="auth-background d-flex justify-center align-center fill-height">
        <!-- meias circunferências -->
        <div class="half-circle bottom-left"></div>
        <div class="half-circle top-right"></div>

        <v-window v-model="step" class="w-100 auth-card">

            <!-- Tela de Login -->
            <v-window-item :value="0">
                <v-card class="d-flex align-center justify-center" height="70vh">
                    <v-row class="ma-0" style="height: 100%;">
                        <!-- Coluna lateral oculta em mobile -->
                        <v-col cols="4" class="welcome-side-login d-none d-md-flex flex-column justify-center pa-6">
                            <div class="welcome-content text-black">
                                <h2 class="font-weight-bold">Bem‑vindo de volta AUmigo!</h2>
                                <p>Caso não seja cadastrado, clique no botão abaixo!</p>
                                <!-- Botão apenas aqui para md+ -->
                                <v-btn class="btn-auth" color="primary" @click="step = 1">
                                    Ir para Cadastro
                                </v-btn>
                            </div>
                        </v-col>

                        <!-- Coluna principal -->
                        <v-col cols="12" md="8" class="d-flex flex-column align-center justify-center">
                            <h1>Login</h1>
                            <!-- Botão para ir para cadastro fica dentro aqui em telas pequenas -->
                            <v-btn color="primary" class="mt-6 d-md-none" @click="step = 1">
                                Ir para Cadastro
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-window-item>


            <!-- Tela de Cadastro -->
            <v-window-item :value="1">
                <v-card class="d-flex align-center justify-center" height="70vh">
                    <v-row class="ma-0" style="height: 100%;">

                        <!-- Coluna principal -->
                        <v-col cols="12" md="8" class="d-flex flex-column align-center justify-center">
                            <h1>Cadastro</h1>
                            <!-- Botão voltar para login em mobile -->
                            <v-btn color="secondary" class="mt-6 d-md-none" @click="step = 0">
                                Voltar para Login
                            </v-btn>
                            <!-- Botão voltar visível em md+ fica na lateral -->
                        </v-col>

                        <!-- Coluna lateral oculta em mobile -->
                        <v-col cols="4" class="welcome-side-cadastro d-none d-md-flex flex-column justify-center pa-6">
                            <div class="welcome-content">
                                <h2 class="font-weight-bold">Bem‑vindo AUmigo!</h2>
                                <p>Caso já tenha um cadastro, clique no botão abaixo!</p>
                                <v-btn color="secondary" class="d-none d-md-block btn-auth" @click="step = 0">
                                    Voltar para Login
                                </v-btn>
                            </div>
                        </v-col>

                    </v-row>
                </v-card>
            </v-window-item>

        </v-window>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const step = ref(0)
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
    background-image: url('https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGV0fGVufDB8fDB8fHww');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    color: #ffffff;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
}

/* Fundo para o lado direito da tela de cadastro */
.welcome-side-cadastro {
    background-image: url('https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGV0fGVufDB8fDB8fHww');
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

.btn-auth {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    height: auto !important;
}

.v-btn__content {
    text-wrap: auto !important;
}
</style>

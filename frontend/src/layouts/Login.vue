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
                        <v-col cols="4" class="welcome-side-login d-none d-md-flex flex-column justify-center pa-6"
                            :style="{ backgroundImage: `url(${BannerLogin})` }">
                        </v-col>

                        <!-- Coluna principal -->
                        <v-col cols="12" md="8" class="pa-4 coluna-scroll">
                            <div class="conteudo-centralizado">

                                <h1 class="font-weight-bold mb-4">Bem-vindo de volta <img :src="Logo" alt="Logo"
                                        class="logo" /></h1>
                                <h2 class="mb-6">Login</h2>

                                <v-form class="formulario-autenticacao" @submit.prevent>
                                    <inputText label="E-mail*" classe="input-locador" type="text" required
                                        v-model:valueInput="textInputs[`input-email-login`]" id="input-email"
                                        :maxLength="0" />

                                    <inputText label="Senha*" classe="input-locador"
                                        v-model:valueInput="textInputs[`input-senha-login`]" id="input-senha"
                                        :type="showPasswordCadastro ? 'text' : 'password'"
                                        :append-inner-icon="showPasswordCadastro ? 'mdi-eye-off' : 'mdi-eye'"
                                        @click:append-inner="showPasswordCadastro = !showPasswordCadastro" required
                                        :maxLength="0" />
                                    <div class="text-end mb-4">
                                        <v-btn variant="text" color="primary" class="text-caption">
                                            Esqueceu a senha?
                                        </v-btn>
                                    </div>

                                    <v-btn :disabled="isLoading" :loading="isLoading" color="secondary" class="mb-4"
                                        block @click="onLogin">
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

                                <h1 class="font-weight-bold mb-4">Bem-vindo <img :src="Logo" alt="Logo" class="logo" />
                                </h1>
                                <h2 class="mb-6">Criar uma conta</h2>

                                <v-form class="formulario-autenticacao" @submit.prevent>

                                    <inputText label="Nome Completo*" type="text" required
                                        v-model:valueInput="textInputs['input-nome']" id="input-nome"
                                        @update:valueInput="(value: any) => updateInput('input-nome', value)"
                                        :maxLength="0" />
                                    <inputText label="Telefone*" classe="input-locador" type="text" required
                                        @input="onPhoneInput($event)" v-model:valueInput="textInputs['input-telefone']"
                                        :maxLength="0" />
                                    <inputText label="E-mail*" classe="input-locador" type="email" required
                                        v-model:valueInput="textInputs[`input-email`]" id="input-email"
                                        :maxLength="0" />

                                    <!-- Adicione os novos campos de CPF e data de nascimento no formulário -->
                                    <inputText label="CPF*" classe="input-locador" type="text" required
                                        v-model:valueInput="textInputs['input-cpf']" id="input-cpf" />

                                    <inputText label="Data de Nascimento*" classe="input-locador" type="date" required
                                        v-model:valueInput="textInputs['input-nascimento']" id="input-nascimento" />

                                    <inputText label="Senha*" classe="input-locador"
                                        v-model:valueInput="textInputs[`input-senha`]" id="input-senha"
                                        :type="showPasswordCadastro ? 'text' : 'password'"
                                        :append-inner-icon="showPasswordCadastro ? 'mdi-eye-off' : 'mdi-eye'"
                                        @click:append-inner="showPasswordCadastro = !showPasswordCadastro" required
                                        :maxLength="0" />
                                    <v-btn :disabled="isLoading" :loading="isLoading" color="secondary" block
                                        class="mb-4 mt-6" @click="onRegister">
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
                        <v-col cols="4" class="welcome-side-cadastro d-none d-md-flex flex-column justify-center pa-6"
                            :style="{ backgroundImage: `url(${BannerCadastro})` }">
                        </v-col>
                    </v-row>
                </v-card>
            </v-window-item>
        </v-window>
    </div>
    <!-- Spinner de Carregamento -->
    <v-container v-if="isLoading" class="d-flex align-center justify-center">
        <v-progress-circular indeterminate color="primary" size="40" width="5"></v-progress-circular>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';

// COMPONENTES
import inputText from '@/components/inputText.vue';

// SERVICES
import { formatPhoneNumberRaw } from '@/utils/formaUtils';
import { registerUser } from '@/services/auth';
import { usePersistentStore } from '@/modules/commons/store';
import { useAppStore } from '@/modules/commons/store';

// IMAGENS/ICONS
import BannerCadastro from '../assets/Banner.png';
import BannerLogin from '../assets/BannerGatos2.png';
import Logo from '../assets/logoAumigo.png';

const router = useRouter();
const step = ref(0);
const textInputs = ref<Record<string, string>>({});
const showPasswordCadastro = ref(false);
const persistentStore = usePersistentStore();
const appStore = useAppStore();
const isLoading = ref(false);

const updateInput = (id: string, newValue: string) => {
    textInputs.value[id] = newValue;
};

function onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const oldValue = input.value;
    const onlyNumbers = oldValue.replace(/\D/g, '').slice(0, 11);
    const newValue = formatPhoneNumberRaw(onlyNumbers);
    const cursorPos = input.selectionStart || 0;

    textInputs.value['input-telefone'] = newValue;

    nextTick(() => {
        let newCursor = cursorPos;
        if (newValue.length < oldValue.length) {
            newCursor = cursorPos;
        } else {
            const diff = newValue.length - oldValue.length;
            newCursor = cursorPos + diff;
        }
        if (newCursor < 0) newCursor = 0;
        if (newCursor > newValue.length) newCursor = newValue.length;
        input.setSelectionRange(newCursor, newCursor);
    });
}

// LOGIN 
const onLogin = async () => {
    try {
        isLoading.value = true;
        const email = textInputs.value['input-email-login'];
        const senha = textInputs.value['input-senha-login'];

        const clinicaAtiva = await appStore.login(email, senha);

        if (clinicaAtiva) {
            router.push({ name: 'Home' });
        } else {
            router.push({ name: 'Clinica' });
        }
    } catch (error: any) {
        console.error('Erro ao fazer login:', error);
        alert(error?.response?.data?.detail || 'Falha ao realizar login');
    } finally {
        isLoading.value = false;
    }
};

// CADASTRO
const onRegister = async () => {
    try {
        isLoading.value = true;
        const senha = textInputs.value['input-senha'];
        const cpf = textInputs.value['input-cpf'];
        const dataNascimento = textInputs.value['input-nascimento'];

        if (!senha || senha.length < 8) {
            alert("A senha precisa ter pelo menos 8 caracteres.");
            return;
        }
        if (!cpf) {
            alert("CPF é obrigatório.");
            return;
        }
        if (!dataNascimento) {
            alert("Data de nascimento é obrigatória.");
            return;
        }

        const payload = {
            email: textInputs.value['input-email'],
            senha: senha,
            tipo_usuario: "admin_clinica",
            pessoa: {
                nome_completo: textInputs.value['input-nome'],
                cpf: cpf,
                data_nascimento: dataNascimento
            },
            contato: {
                email: textInputs.value['input-email'],
                telefones: [{ numero: textInputs.value['input-telefone'] }]
            },
            first_name: textInputs.value['input-nome'].split(' ')[0] || '',
            last_name: textInputs.value['input-nome'].split(' ').slice(1).join(' ') || ''
        };

        const response = await registerUser(payload);
        // Atualiza o token no PersistentStore
        persistentStore.jwtToken = response.access;

        appStore.isAuthorized = true;
        appStore.userData = response.usuario || null;

        router.push({ name: 'Clinica' });
    } catch (error: any) {
        console.error("Erro ao cadastrar usuário:", error);
        alert(error?.response?.data ? JSON.stringify(error.response.data) : "Erro ao cadastrar usuário");
    } finally {
        isLoading.value = false;
    }
};
</script>


<style lang="scss" scoped>
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

.logo {
    width: 150px;
    height: auto;
    transform: translateY(10px);
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

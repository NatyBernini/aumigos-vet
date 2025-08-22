<template>
    <div class="auth-background d-flex justify-center align-center fill-height">
        <!-- meias circunferências -->
        <div class="half-circle bottom-left"></div>
        <div class="half-circle top-right"></div>

        <v-window v-model="step" class="w-100 auth-card">
            <v-window-item :value="0">
                <v-card class="d-flex align-center justify-center" height="auto">
                    <v-row class="ma-0" style="height: 100%;">
                        <v-col cols="12" md="12" class="pa-8 coluna-scroll">
                            <div class="conteudo-centralizado">
                                <img :src="Logo" alt="Logo" class="logo mb-4" />
                                <h1 class="font-weight-bold mb-6">Planos</h1>

                                <!-- 🔥 Toggle mensal / anual -->
                                <v-btn-toggle v-model="isAnual" class="mb-6" mandatory>
                                    <v-btn :value="false">Mensal</v-btn>
                                    <v-btn :value="true">Anual (-15%)</v-btn>
                                </v-btn-toggle>

                                <v-row justify="center" align="stretch" class="w-100">
                                    <v-col cols="12" md="4" v-for="(plano, index) in planos" :key="index">
                                        <v-card class="plano-card d-flex flex-column align-center pa-6"
                                            :class="{ destaque: plano.nome === 'Premium' }" elevation="4">
                                            <h2 class="nome-plano">{{ plano.nome }}</h2>
                                            <p class="mensagem-plano gold pl-5 pr-5 mb-3" v-if="plano.nome === 'Premium'">Mais cobertura</p>
                                            <p class="mensagem-plano pl-5 pr-5 mb-3" v-if="plano.nome === 'Profissional'">Melhor custo benefício</p>
                                            <p class="mensagem-plano pl-5 pr-5 mb-3" v-if="plano.nome === 'Gratuito'">Mais em conta</p>
                                          <div class="preco">{{ precoPlano(plano) }}</div>
                                            <v-divider class="my-4 w-100" :thickness="2" color="grey-darken-2" />
                                            <ul class="beneficios">
                                                <li v-for="(beneficio, i) in todosBeneficios" :key="i"
                                                    :class="{ ativo: plano.beneficios.includes(beneficio) }">
                                                    <span v-if="plano.beneficios.includes(beneficio)">✅</span>
                                                    <span v-else>☐</span>
                                                    {{ beneficio }}
                                                </li>
                                            </ul>
                                            <v-btn class="mt-6" color="green-darken-2" variant="flat" block @click="contratarPlano()">
                                                Contrate {{ plano.nome }}
                                            </v-btn>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Logo from '../assets/logoAumigos.png'
import { useRouter } from 'vue-router';

const step = ref(0)
const isAnual = ref(false) // false = mensal, true = anual
const router = useRouter();

// lista global de todos os benefícios
const todosBeneficios = [
    'Cadastro de até 10 pacientes',
    'Agendamento básico',
    'Suporte por e-mail',
    'Pacientes ilimitados',
    'Agendamento avançado',
    'Relatórios detalhados',
    'Suporte via chat',
    'Gestão de equipe',
    'Integração com WhatsApp',
    'Suporte prioritário 24/7',
]

// planos e valores
const planos = [
    {
        nome: 'Gratuito',
        mensal: 0,
        beneficios: [
            'Cadastro de até 10 pacientes',
            'Agendamento básico',
            'Suporte por e-mail',
        ],
    },
    {
        nome: 'Profissional',
        mensal: 49,
        beneficios: [
            'Cadastro de até 10 pacientes',
            'Agendamento básico',
            'Suporte por e-mail',
            'Pacientes ilimitados',
            'Agendamento avançado',
            'Relatórios detalhados',
            'Suporte via chat',
        ],
    },
    {
        nome: 'Premium',
        mensal: 99,
        beneficios: [
            'Cadastro de até 10 pacientes',
            'Agendamento básico',
            'Suporte por e-mail',
            'Pacientes ilimitados',
            'Agendamento avançado',
            'Relatórios detalhados',
            'Suporte via chat',
            'Gestão de equipe',
            'Integração com WhatsApp',
            'Suporte prioritário 24/7',
        ],
    },
]

// função que calcula preço
const precoPlano = (plano: any) => {
    if (plano.mensal === 0) return 'Gratuito'
    if (isAnual.value) {
        const anual = plano.mensal * 12 * 0.85 // 15% desconto
        return `R$ ${anual.toFixed(2)} / ano`
    } else {
        return `R$ ${plano.mensal} / mês`
    }
}

const contratarPlano = () => {
      router.push({ name: 'Home' });
}
</script>


<style lang="scss" scoped>
.auth-background {
    position: relative;
    min-height: 100dvh;
    background: #E8F5E9;
    overflow: visible;
}

.half-circle {
    position: absolute;
    width: clamp(120px, 15vw, 200px);
    height: clamp(120px, 15vw, 200px);
    background-color: #FFD966;
    border-radius: 50%;
    z-index: 0;
}

.bottom-left {
    bottom: 0;
    left: 0;
    clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
    transform: translateX(-50%);
}

.top-right {
    top: 0;
    right: 0;
    clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
    transform: translateX(50%);
}

.auth-card {
    max-width: 70%;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    background-color: white;

    @media (max-width: 960px) {
        max-width: 90%;
        height: auto;
    }

    @media (max-width: 1400px) {
        max-width: 95%;
    }

    @media (max-width: 600px) {
        max-width: 100%;
        border-radius: 0;
        height: auto;
    }
}

.font-weight-bold {
    font-weight: bold;
}

.logo {
    width: 150px;
    height: auto;
    transform: translateY(10px);
}

.conteudo-centralizado {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

h1 {
    font-size: clamp(1.2rem, 4vw, 1.8rem);
    text-align: center;
    word-break: break-word;
    white-space: normal;
}

.coluna-scroll {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 2rem;
}

.plano-card {
    border-radius: 16px;
    text-align: center;
    height: 100%;
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: translateY(-5px);
    }

    .nome-plano {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .preco {
        font-size: 1.6rem;
        font-weight: bold;
        color: #2e7d32;
    }

    .beneficios {
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: left;

        li {
            font-size: 0.95rem;
            margin-bottom: 8px;
            color: #888;
            /* cinza padrão */

            &.ativo {
                color: #2e7d32;
                /* verde para ativo */
                font-weight: 500;
            }
        }
    }
}

.v-btn {
    border-radius: 10px;
    font-weight: 600;
    text-transform: none; // evita ficar tudo em maiúsculo
}

.plano-card.destaque {
  background-color: #fff8e1; // tom amarelo claro
  border: 2px solid #fbc02d; // borda amarela mais forte
  box-shadow: 0 10px 20px rgba(251, 192, 45, 0.3);
}

.mensagem-plano {
    padding: 5px;
    border-radius: 8px;
    background-color: #eaeaea;
    color: #006a05;
    &.gold {
    background-color: #2e7d32;
    color: #fff;
    }
}

.v-btn__content {
    white-space: normal!important;
}
</style>

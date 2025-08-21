<template>
    <div class="auth-background d-flex justify-center align-center fill-height">
        <!-- meias circunferências -->
        <div class="half-circle bottom-left"></div>
        <div class="half-circle top-right"></div>

        <v-window v-model="step" class="w-100 auth-card">
            <v-window-item :value="0">
                <v-card class="d-flex align-center justify-center" height="90vh">
                    <v-row class="ma-0" style="height: 100%;">

                        <!-- Coluna lateral -->
                        <v-col cols="4" class="welcome-side-login d-none d-md-flex flex-column justify-center pa-6"
                            :style="{ backgroundImage: `url(${BannerLogin})` }">
                        </v-col>

                        <!-- Coluna principal -->
                        <v-col cols="12" md="8" class="pa-4 coluna-scroll">
                            <div class="conteudo-centralizado">
                                <img :src="Logo" alt="Logo" class="logo mb-4" />
                                <h1 class="font-weight-bold mb-4">Cadastrar Clínica Veterinária</h1>

                                <v-form class="formulario-autenticacao" @submit.prevent>

                                    <!-- Tabs -->
                                    <v-tabs v-model="tab">
                                        <v-tab value="infoBasica">Informações Básicas</v-tab>
                                        <v-tab value="endereco">Endereço</v-tab>
                                        <v-tab value="foto">Foto</v-tab>
                                    </v-tabs>

                                    <v-card-text>
                                        <v-tabs-window v-model="tab">

                                            <!-- Informações Básicas -->
                                            <v-tabs-window-item value="infoBasica" class="pt-5">
                                                <p class="mb-4">Informações Básicas</p>
                                                <v-text-field v-model="nome" label="Nome"
                                                    append-inner-icon="mdi-account" class="mb-4" required />
                                                <v-text-field v-model="telefone" label="Telefone"
                                                    append-inner-icon="mdi-phone" class="mb-4" required />
                                                <v-text-field v-model="cnpj" label="CNPJ"
                                                    append-inner-icon="mdi-file-document" class="mb-4" required />
                                                <v-text-field v-model="email" label="E-mail" type="email"
                                                    append-inner-icon="mdi-email" class="mb-4" required />
                                            </v-tabs-window-item>

                                            <!-- Endereço -->
                                            <v-tabs-window-item value="endereco" class="pt-5">
                                                <p class="mb-4">Informações de Endereço</p>
                                                <v-col>
                                                        <v-select v-model="estadoSelecionado" :items="estados"
                                                            item-value="value" label="Estado" dense outlined clearable class="mb-4"
                                                             />

                                                        <v-select v-model="cidadeSelecionada" :items="cidades"
                                                            item-text="nome" item-value="id" label="Cidade" dense
                                                            outlined :rules="[required]" :disabled="!estadoSelecionado"
                                                            clearable  class="mb-4" />
                                                    

                                                        <v-text-field v-model="cep" label="CEP" maxlength="9"
                                                            placeholder="00000-000" @input="onInputCep" class="mb-4"
                                                             />
                                                  

                                                        <v-text-field v-model="bairro" :rules="required" label="Bairro*" class="mb-4"
                                                           />
                                                        <v-text-field v-model="rua" :rules="required" label="Rua*" class="mb-4"
                                                           />
                                                

                                                        <v-text-field v-model="numero" :rules="required" label="N*" class="mb-4"
                                                            type="number"  />
                                                        <v-text-field v-model="complemento" :rules="required"
                                                            label="Complemento*"  />
                                                 
                                                </v-col>
                                            </v-tabs-window-item>

                                            <!-- Foto -->
                                            <v-tabs-window-item value="foto" class="pt-5">
                                                <p class="mb-4">Foto da Clínica</p>
                                                <v-file-input v-model="foto" label="Selecione uma foto"
                                                    accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                                                    prepend-icon="mdi-camera" show-size clearable
                                                    class="file-input-truncado">
                                                    <template #selection="{ fileNames }">
                                                        <v-tooltip v-if="fileNames && fileNames.length"
                                                            location="bottom">
                                                            <template #activator="{ props }">
                                                                <span v-bind="props" class="file-name-ellipsis">
                                                                    {{ fileNames[0] }}
                                                                </span>
                                                            </template>
                                                            <span>{{ fileNames[0] }}</span>
                                                        </v-tooltip>
                                                    </template>
                                                </v-file-input>

                                                <!-- Miniatura com clique -->
                                                <div v-if="fotoPreview" class="mt-4 d-flex justify-center">
                                                    <v-img :src="fotoPreview" width="250" height="250" cover
                                                        class="rounded-lg elevation-2 cursor-pointer"
                                                        @click="dialogImagem = true" />
                                                </div>

                                                <!-- Dialog para expandir -->
                                                <v-dialog v-model="dialogImagem" max-width="800px">
                                                    <v-card>
                                                        <v-img :src="fotoPreview" max-width="100%" max-height="80vh"
                                                            contain />
                                                    </v-card>
                                                </v-dialog>
                                            </v-tabs-window-item>


                                        </v-tabs-window>
                                    </v-card-text>

                                    <!-- Botão de salvar -->
                                    <v-btn color="secondary" class="mb-4 mt-4" block @click="submit">
                                        Cadastrar
                                    </v-btn>
                                </v-form>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import BannerLogin from '../assets/BannerClinicaVet.png'
import { getCidadesPorEstado, getEstados, getEnderecoPorCep } from '../services/ibge'
import { formatCep, limparCep, buscarEnderecoViaCep } from '../utils/cepUtils'
import Logo from '../assets/logoAumigo.png'
import { useRouter } from 'vue-router';

// Regras
const required = [(v: string) => !!v || 'Campo obrigatório']

const step = ref(0)
const tab = ref('infoBasica')
const dialogImagem = ref(false)


// Dados do form
const nome = ref('')
const telefone = ref('')
const email = ref('')
const cnpj = ref('')
const estados = ref<Array<any>>([])
const cidades = ref<Array<any>>([])
const bairro = ref('')
const rua = ref('')
const numero = ref('')
const complemento = ref('')
const cep = ref('')

const estadoSelecionado = ref<string | null>(null)
const cidadeSelecionada = ref<string | null>(null)

// Foto
const foto = ref<File | null>(null)
const fotoPreview = ref<string | null>(null)

const router = useRouter();

watch(foto, (novoArquivo) => {
    if (novoArquivo) {
        const reader = new FileReader()
        reader.onload = (e) => {
            fotoPreview.value = e.target?.result as string
        }
        reader.readAsDataURL(novoArquivo as File)
    } else {
        fotoPreview.value = null
    }
})

function onInputCep(e: Event) {
    const input = e.target as HTMLInputElement
    const valorFormatado = formatCep(input.value)
    cep.value = valorFormatado

    const cepLimpo = limparCep(valorFormatado)
    if (cepLimpo.length === 8) {
        buscarEnderecoViaCep(cepLimpo)
            .then(async data => {
                rua.value = data.logradouro || ''
                bairro.value = data.bairro || ''
                estadoSelecionado.value = `${data.estado} (${data.uf})`

                // Espera o estado atualizar e o select habilitar
                await nextTick()

                cidades.value = [data.localidade]
                cidadeSelecionada.value = data.localidade
            })
            .catch(() => {
                rua.value = ''
                bairro.value = ''
            })
    } else {
        rua.value = ''
        bairro.value = ''
    }
}

async function carregarEstados() {
    const resposta = await getEstados()
    estados.value = resposta.map((estado: any) => (
        `${estado.nome} (${estado.sigla})`
    ))
}

async function carregarCidades() {
    if (estadoSelecionado.value) {
        const match = estadoSelecionado.value.match(/\(([^)]+)\)/)
        const siglaEstado = match ? match[1] : null

        if (siglaEstado) {
            const resposta = await getCidadesPorEstado(siglaEstado)
            cidades.value = resposta.map((cidade: any) => `${cidade.nome}`)
        } else {
            cidades.value = []
            cidadeSelecionada.value = null
        }
    } else {
        cidades.value = []
        cidadeSelecionada.value = null
    }
}

watch(estadoSelecionado, () => {
    if (estadoSelecionado.value) {
        cidadeSelecionada.value = null
        carregarCidades()
    }
    if (estadoSelecionado.value === null) {
        cidadeSelecionada.value = null
    }
})

onMounted(async () => {
    carregarEstados()
})

const submit = () => {
    console.log('Form enviado', {
        nome: nome.value,
        telefone: telefone.value,
        email: email.value,
        cnpj: cnpj.value,
        endereco: {
            estado: estadoSelecionado.value,
            cidade: cidadeSelecionada.value,
            cep: cep.value,
            bairro: bairro.value,
            rua: rua.value,
            numero: numero.value,
            complemento: complemento.value
        },
        foto: foto.value
    })
    router.push({ name: 'Home' });
}
</script>

<style lang="scss" scoped>
.row-info-basicas {
    gap: 20px;
    margin-top: 10px;
    margin-bottom: 20px;
    align-items: center;
}

.auth-background {
    position: relative;
    min-height: 100vh;
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
  max-width: 60%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  background-color: white;

  @media (max-width: 960px) {
    max-width: 90%;   /* ocupar mais em tablets */
    height: auto;     /* evita corte */
  }

  @media (max-width: 600px) {
    max-width: 100%;  /* ocupar tela toda no celular */
    border-radius: 0; /* fica full screen, estilo app */
    height: auto;
  }
}

.welcome-side-login {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    color: #ffffff;
}

.welcome-side-cadastro {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    color: #000;
}

.welcome-content {
    background-color: rgba(255, 255, 255, 0.7);
    padding: 16px;
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

.mensagem-informativa {
    font-size: 0.9rem;
}

.cursor-pointer {
  cursor: pointer;
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

/* 🔥 Ajustes para truncar o nome do arquivo e mostrar "..." */
.file-input-truncado .v-field__input {
    /* Permite que o conteúdo dentro possa encolher e aplicar ellipsis */
    min-width: 0;
    overflow: hidden;
}

.file-name-ellipsis {
    display: block;
    /* garante largura */
    max-width: 100%;
    /* usa toda a largura disponível do input */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.25rem;
    /* ajuda a manter na mesma linha do campo */
}

/* título responsivo */
h1 {
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  text-align: center;
  word-break: break-word; /* quebra se for muito longo */
  white-space: normal;    /* permite quebra */
}

/* Tabs com rolagem horizontal em telas pequenas */
.v-tabs {
  overflow-x: auto;
  flex-wrap: nowrap;
  scrollbar-width: thin;
}

.v-tab {
  flex: 0 0 auto; /* não encolhe, permite scroll */
}

/* Formulário ocupando largura total no celular */
.v-form.formulario-autenticacao {
  width: 60%;

  @media (max-width: 960px) {
    width: 80%;
  }

  @media (max-width: 600px) {
    width: 90%;
  }
}

/* Coluna principal com rolagem interna */
.coluna-scroll {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 2rem;
}

</style>

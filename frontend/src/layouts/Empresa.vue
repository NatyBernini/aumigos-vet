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

                                                <inputText label="Nome*" classe="mb-4"
                                                    v-model:valueInput="textInputs['input-nome']" id="input-nome"
                                                    append-inner-icon="mdi-account" required :maxLength="0" />

                                                <inputText label="Telefone*" classe="input-locador" type="text" required
                                                    @input="onPhoneInput($event)"
                                                    v-model:valueInput="textInputs['input-telefone']" :maxLength="0" />
                                                <inputText label="CNPJ*" classe="mb-4"
                                                    v-model:valueInput="textInputs['input-cnpj']" id="input-cnpj"
                                                    append-inner-icon="mdi-file-document" required :maxLength="0" />
                                                <inputText label="E-mail*" classe="mb-4"
                                                    v-model:valueInput="textInputs['input-email']" id="input-email"
                                                    type="email" append-inner-icon="mdi-email" required
                                                    :maxLength="0" />
                                            </v-tabs-window-item>

                                            <!-- Endereço -->
                                            <v-tabs-window-item value="endereco" class="pt-5">
                                                <p class="mb-4">Informações de Endereço</p>
                                                <v-col>
                                                    <!-- ESTADO -->
                                                    <multipleCombobox v-model="estadoSelecionado" :items="listEstados"
                                                        :extra-items="estados" label="Estado*" id="select-estado"
                                                        :isMultipleSelect="false" :isRequired="true" clearable
                                                        class="select-estado" />

                                                    <!-- CIDADE -->
                                                    <multipleCombobox v-model="cidadeSelecionada" :items="listCidade"
                                                        :extra-items="cidades" item-text="nome" item-value="id"
                                                        label="Cidade*" id="select-cidade" :isMultipleSelect="false"
                                                        :isRequired="true" :disabled="!estadoSelecionado" clearable />


                                                    <inputText label="CEP*" classe="mb-4" placeholder="00000-000"
                                                        v-model:valueInput="textInputs['input-cep']" id="input-nome"
                                                        append-inner-icon="mdi-account" required :maxLength="0"
                                                        @input="onInputCep" />

                                                    <inputText label="Bairro*" classe="mb-4"
                                                        v-model:valueInput="textInputs['input-bairro']"
                                                        id="input-bairro" append-inner-icon="mdi-account" required
                                                        :maxLength="0" />

                                                    <inputText label="Rua*" classe="mb-4"
                                                        v-model:valueInput="textInputs['input-rua']" id="input-rua"
                                                        append-inner-icon="mdi-account" required :maxLength="0" />



                                                    <inputText label="Número*" :type="'number'"
                                                        v-model:valueInput="textInputs['input-numero']"
                                                        id="input-numero" append-inner-icon="mdi-account" required
                                                        :maxLength="0" />

                                                    <inputText label="Complemento*"
                                                        v-model:valueInput="textInputs['input-complemento']"
                                                        id="input-complemento" append-inner-icon="mdi-account" required
                                                        :maxLength="0" />


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
import { getCidadesPorEstado, getEstados } from '../services/ibge'
import { formatCep, limparCep, buscarEnderecoViaCep } from '../utils/cepUtils'
import Logo from '../assets/logoAumigos.png'
import { useRouter } from 'vue-router'
import { formatPhoneNumberRaw } from '@/utils/formaUtils'

// COMPONENTES
import inputText from '@/components/inputText.vue'
import multipleCombobox from '@/components/multipleCombobox.vue'

// Regras
const required = [(v: string) => !!v || 'Campo obrigatório']

const step = ref(0)
const tab = ref('infoBasica')
const dialogImagem = ref(false)

// Dados do form
const textInputs = ref<Record<string, string>>({})
const estados = ref<Array<{ id: string; descricao: string }>>([])
const listEstados = ref<string[]>([])
const cidades = ref<Array<{ id: string; descricao: string }>>([])
const listCidade = ref<string[]>([])

const numero = ref('')
const complemento = ref('')
const cep = ref('')

// Agora selecionados guardam o objeto, não string
const estadoSelecionado = ref<string | undefined>(undefined)
const cidadeSelecionada = ref<string | undefined>(undefined)

// Foto
const foto = ref<File | undefined>(undefined)
const fotoPreview = ref<string | undefined>(undefined)

const router = useRouter()

watch(foto, (novoArquivo) => {
    if (novoArquivo) {
        const reader = new FileReader()
        reader.onload = (e) => {
            fotoPreview.value = e.target?.result as string
        }
        reader.readAsDataURL(novoArquivo as File)
    } else {
        fotoPreview.value = undefined
    }
})

function onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement
    const oldValue = input.value
    const onlyNumbers = oldValue.replace(/\D/g, '').slice(0, 11)
    const newValue = formatPhoneNumberRaw(onlyNumbers)

    const cursorPos = input.selectionStart || 0
    textInputs.value['input-telefone'] = newValue

    nextTick(() => {
        let newCursor = cursorPos
        if (newValue.length < oldValue.length) {
            newCursor = cursorPos
        } else {
            const diff = newValue.length - oldValue.length
            newCursor = cursorPos + diff
        }
        if (newCursor < 0) newCursor = 0
        if (newCursor > newValue.length) newCursor = newValue.length
        input.setSelectionRange(newCursor, newCursor)
    })
}

async function onInputCep(e: Event) {
    const input = e.target as HTMLInputElement
    const valorFormatado = formatCep(input.value)
    cep.value = valorFormatado

    const cepLimpo = limparCep(valorFormatado)
    if (cepLimpo.length === 8) {
        try {
            const data = await buscarEnderecoViaCep(cepLimpo)

            textInputs.value['input-rua'] = data.logradouro || ''
            textInputs.value['input-bairro'] = data.bairro || ''

            // Procura o estado na lista de estados
            const estadoEncontrado = estados.value.find(
                (estado: { id: string; descricao: string }) =>
                    estado.descricao === `${data.estado} (${data.uf})`
            )

            if (estadoEncontrado) {
                estadoSelecionado.value = estadoEncontrado.descricao

                // Espera o nextTick para garantir que o v-model do combobox atualize
                await nextTick()

                // Carrega as cidades do estado encontrado
                const resposta = await getCidadesPorEstado(estadoEncontrado.id)
                listCidade.value = resposta.map((cidade: any) => `${cidade.nome}`)
                cidades.value = resposta.map((cidade: any) => ({
                    id: cidade.nome,
                    descricao: cidade.nome,
                }))

                // Seleciona a cidade retornada pelo CEP
                const cidadeEncontrada = cidades.value.find(
                    (c: { id: string; descricao: string }) => c.descricao === data.localidade
                )
                cidadeSelecionada.value = cidadeEncontrada ? cidadeEncontrada.descricao : undefined
            }
        } catch {
            textInputs.value['input-rua'] = ''
            textInputs.value['input-bairro'] = ''
            estadoSelecionado.value = undefined
            cidadeSelecionada.value = undefined
        }
    } else {
        textInputs.value['input-rua'] = ''
        textInputs.value['input-bairro'] = ''
        estadoSelecionado.value = undefined
        cidadeSelecionada.value = undefined
    }
}


async function carregarEstados() {
    const resposta = await getEstados()
    listEstados.value = resposta.map((estado: any) => (`${estado.nome} (${estado.sigla})`))
    estados.value = resposta.map((estado: any) => ({
        id: estado.sigla,
        descricao: `${estado.nome} (${estado.sigla})`,
    }))
}

async function carregarCidades() {
    if (estadoSelecionado.value) {
        // Procura o estado na lista de estados pelo campo descricao
        const estadoEncontrado = estados.value.find(
            (estado: { id: string; descricao: string }) => estado.descricao === estadoSelecionado.value
        )

        const estadoId = estadoEncontrado ? estadoEncontrado.id : null
        console.log("Estado selecionado ID:", estadoId)

        if (estadoId) {
            const resposta = await getCidadesPorEstado(estadoId)
            listCidade.value = resposta.map((cidade: any) => (`${cidade.nome}`))
            cidades.value = resposta.map((cidade: any) => ({
                id: cidade.id,
                descricao: cidade.nome,
            }))
        } else {
            cidades.value = []
            cidadeSelecionada.value = undefined
        }
    } else {
        cidades.value = []
        cidadeSelecionada.value = undefined
    }
}

watch(estadoSelecionado, () => {
    if (estadoSelecionado.value) {
        cidadeSelecionada.value = undefined
        carregarCidades()
    } else {
        cidadeSelecionada.value = undefined
    }
})


onMounted(async () => {
    carregarEstados()
})

const submit = () => {
    console.log('Form enviado', {
        estado: estadoSelecionado.value,
        cidade: cidadeSelecionada.value,
        cep: cep.value,
        rua: textInputs.value['input-rua'],
        bairro: textInputs.value['input-bairro'],
        numero: numero.value,
        complemento: complemento.value,
        telefone: textInputs.value['input-telefone'],
        foto: foto.value,
    })
    router.push({ name: 'Planos' })
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
        max-width: 90%;
        /* ocupar mais em tablets */
        height: auto;
        /* evita corte */
    }

    @media (max-width: 600px) {
        max-width: 100%;
        /* ocupar tela toda no celular */
        border-radius: 0;
        /* fica full screen, estilo app */
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
    word-break: break-word;
    /* quebra se for muito longo */
    white-space: normal;
    /* permite quebra */
}

/* Tabs com rolagem horizontal em telas pequenas */
.v-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    scrollbar-width: thin;
}

.v-tab {
    flex: 0 0 auto;
    /* não encolhe, permite scroll */
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

<template>
    <v-dialog v-model="dialogVisible" width="95%" max-width="500px" persistent>
        <v-card v-if="!isLoading" id="card-modal-cadastro">
            <row class="row-close-modal">
                <v-btn id="btn-close-modal" @click="cancel">X</v-btn>
            </row>

            <v-card-title class="mb-5">
                <v-icon color="#ff8200" class="mr-2">mdi-folder-key-network-outline</v-icon>
                Redefinir Senha de Acesso
            </v-card-title>

            <v-card-text class="w-100 d-flex flex-column flex-wrap ga-4">
                <v-alert v-if="showAlert" :type="alertType" class="mt-3" dismissible @click:close="showAlert = false">
                    {{ alertMessage }}
                </v-alert>
                <v-form class="formulario-autenticacao" @submit.prevent>
                    <inputText label="Nome Completo" type="text" v-model:valueInput="textInputs['input-nome']"
                        :ocultaContador="true" :disabled="true" />
                    <inputText label="Nova senha*" v-model:valueInput="textInputs[`input-nova-senha`]" id="input-senha"
                        :type="showNewPassword ? 'text' : 'password'"
                        :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showNewPassword = !showNewPassword" required :maxLength="0" />

                    <div class="container-btn mt-5 d-flex align-center justify-end">
                        <v-tooltip v-if="isLoading || !textInputs['input-nova-senha']"
                            text="Preencha os campos obrigatórios" location="bottom">
                            <template #activator="{ props }">
                                <div v-bind="props">
                                    <v-btn class="btn-padrao"
                                        :disabled="isLoading || !textInputs['input-nova-senha']" :loading="isLoading">
                                        Redefinir
                                    </v-btn>
                                </div>
                            </template>
                        </v-tooltip>

                        <v-btn v-else class="btn-padrao" @click="redefineSenha" :loading="isLoading">
                            Redefinir
                        </v-btn>
                    </div>


                </v-form>
            </v-card-text>


        </v-card>

        <v-container v-if="isLoading" class="d-flex align-center justify-center">
            <v-progress-circular indeterminate color="primary" size="40" width="5"></v-progress-circular>
        </v-container>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import inputText from '@/components/inputText.vue'
import { redefinirSenhaUsuarioClinica } from '@/services/clinica';
const props = defineProps<{
    userData: any
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'usuarioAtualizado'): void
}>()

const dialogVisible = ref(props.isOpen)
const isLoading = ref(false)
const textInputs = ref<Record<string, string>>({})
const showPassword = ref(false)
const showNewPassword = ref(false)
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error')
watch(
    () => props.isOpen,
    (val) => (dialogVisible.value = val)
)

watch(dialogVisible, (val) => {
    emit('update:isOpen', val)
    if (val) preencherCampos()
})

function preencherCampos() {
    if (!props.userData) return
    textInputs.value['input-nome'] = `${props.userData.nome}`
}

function cancel() {
    dialogVisible.value = false
}

const redefineSenha = async () => {
    const dados = {
        nova_senha: textInputs.value['input-nova-senha']
    }
    try {
        isLoading.value = true
        const response = await redefinirSenhaUsuarioClinica(props.userData.id, dados)
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
</script>

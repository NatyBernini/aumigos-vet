<template>
    <v-dialog v-model="dialogVisible" width="50%" max-width="500px" persistent>
        <v-card v-if="!isLoading" id="card-modal-cadastro">
            <row class="row-close-modal">
                <v-btn id="btn-close-modal" @click="cancel">X</v-btn>
            </row>
            <v-card-title>
                <v-icon color="#ff8200" class="mr-2">mdi-alert-circle</v-icon> Cadastrar Usuário
            </v-card-title>

            <v-card-text>
                <v-alert v-if="showAlert" :type="alertType" class="mt-3" dismissible @click:close="showAlert = false">
                    {{ alertMessage }}
                </v-alert>
                <inputText label="Nome Completo" type="text" :ocultaContador="true"
                    v-model:valueInput="textInputs['input-nome']" />
                <inputText label="CPF" type="text" :ocultaContador="true"
                    v-model:valueInput="textInputs['input-cpf']" />
                <inputText label="E-mail" type="text" :ocultaContador="true"
                    v-model:valueInput="textInputs['input-email']" />
                <inputText label="E-mail de acesso" type="text" :ocultaContador="true"
                    v-model:valueInput="textInputs['input-email-acesso']" />
                <inputText label="Data de Nascimento" type="date" :ocultaContador="true"
                    v-model:valueInput="textInputs['input-data-nasc']" />
                <inputText label="Nova senha*" v-model:valueInput="textInputs[`input-senha`]" id="input-senha"
                    :type="showNewPassword ? 'text' : 'password'"
                    :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showNewPassword = !showNewPassword" required :maxLength="0" />

            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn class="btn-padrao" :loading="loading" @click="cadastrarUsuario">Cadastrar </v-btn>
            </v-card-actions>
        </v-card>
        <v-container v-if="isLoading" class="d-flex align-center justify-center">
            <v-progress-circular indeterminate color="primary" size="40" width="5"></v-progress-circular>
        </v-container>
    </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref, onMounted } from 'vue';

// COMPONENTES
import inputText from '@/components/inputText.vue';

// SERVICES
import { cadastrarUsuarioClinica } from '@/services/clinica';

const props = defineProps<{
    isOpen: boolean;
}>();


const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void;
}>();

const dialogVisible = ref(props.isOpen);
const isLoading = ref(false);
const textInputs = ref<Record<string, string>>({})
const showNewPassword = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error');

watch(
    () => props.isOpen,
    (val: any) => {
        dialogVisible.value = val;
    }
);

watch(dialogVisible, (val: any) => {
    emit('update:isOpen', val);
});

function cancel() {
    dialogVisible.value = false;
}

const loading = ref(false);


const cadastrarUsuario = async () => {
    // Monta o payload com os dados do formulário
    const dados = {
        email: textInputs.value['input-email'],
        senha: textInputs.value['input-senha'],
        tipo_usuario: 'veterinario', // ou outro valor que faça sentido
        first_name: textInputs.value['input-nome'].split(' ')[0] || '',
        last_name: textInputs.value['input-nome'].split(' ').slice(1).join(' ') || '',
        pessoa: {
            nome_completo: textInputs.value['input-nome'],
            cpf: textInputs.value['input-cpf'],
            data_nascimento: textInputs.value['input-data-nasc'] || ''
        },
        contato: {
            email: textInputs.value['input-email-acesso'] || ''
        }
    };

    let response;
    try {
        isLoading.value = true;
        response = await cadastrarUsuarioClinica(dados);

        alertMessage.value = 'Usuário cadastrado com sucesso!';
        alertType.value = 'success';
        showAlert.value = true;

        // Fecha o diálogo após cadastro
        dialogVisible.value = false;

        setTimeout(() => {
            showAlert.value = false;
        }, 5000);
    } catch (error: any) {
        // Captura erro de validação do backend
        if (error.tipo === 'VALIDATION' && error.errors) {
            const firstKey = Object.keys(error.errors)[0];
            alertMessage.value = error.errors[firstKey][0];
        } else if (error.tipo === 'ERROR') {
            alertMessage.value = error.msg;
        } else {
            alertMessage.value = 'Ocorreu um erro inesperado';
        }

        alertType.value = 'error';
        showAlert.value = true;

        setTimeout(() => {
            showAlert.value = false;
        }, 5000);

        throw error;
    } finally {
        isLoading.value = false;
    }
};
</script>
<style lang="scss">
.row-close-modal {
    display: flex;
    width: 100%;
    justify-content: flex-end;

    .v-btn {
        background: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        display: flex;
        justify-content: flex-end;
        color: #b0b0b0 !important;
        font-size: 18px !important;

        &:hover>.v-btn__overlay {
            opacity: 0 !important;
        }
    }
}

#card-modal-cadastro {
    padding-bottom: 21px !important;
    padding: 21px;
    align-items: start;
    justify-content: left;
    min-height: 150px;

    .v-card-title {
        padding: 0;
        font-weight: 700;
        font-size: 16px;
        line-height: 16px;
        letter-spacing: 0%;
        color: #ff8200;
        text-wrap: auto !important;
    }

    .v-card-text {
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0%;
        text-align: center;
        color: #6c6c6c;
        padding: 0px;
        text-wrap: auto !important;
    }

    button {
        padding: 12px;
        height: auto;
    }

    #btn-close-modal {
        background-color: #e8e8e8;
        color: #6c6c6c;
        font-weight: 500;
        font-size: 13px;
        line-height: 12.8px;
        letter-spacing: 0%;
        text-align: center;
        border-radius: 10px;
        text-transform: none;
        transition: none;

        &:hover {
            background-color: #d9d9d9;
            color: #434343;
        }
    }

}
</style>
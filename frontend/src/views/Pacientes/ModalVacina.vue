<template>
    <v-dialog v-model="dialogVisible" width="95%" max-width="500px" persistent>
        <v-card v-if="!isLoading" id="card-modal-cadastro">
            <row class="row-close-modal">
                <v-btn id="btn-close-modal" @click="cancel">X</v-btn>
            </row>
            <v-card-title class="mb-5">
                <v-icon color="#ff8200" class="mr-2">mdi-needle</v-icon> Adicionar Vacina
            </v-card-title>

            <v-card-text class="w-100 d-flex flex-column flex-wrap ga-4">
                <v-alert v-if="showAlert" :type="alertType" class="mt-3" dismissible @click:close="showAlert = false">
                    {{ alertMessage }}
                </v-alert>
                <inputText label="Nome*" type="text" :ocultaContador="true"
                    v-model:valueInput="textInputs['input-nome']" />
                <inputText label="Fabricante*" type="text" :ocultaContador="true"
                    v-model:valueInput="textInputs['input-fabricante']" />
                <inputText label="Lote*" type="text" :ocultaContador="true"
                    v-model:valueInput="textInputs['input-lote']" />
                <inputText label="Data de Aplicação*" type="date" :ocultaContador="true"
                    v-model:valueInput="textInputs['input-data-aplicacao']" />
                <inputText label="Data da Próxima Aplicação*" type="date" :ocultaContador="true"
                    v-model:valueInput="textInputs['input-data-prox-aplicacao']" />
                <TextArea :modelValue="textarea.vacinas" @update:modelValue="(value: any) => (textarea.vacinas = value)"
                    :label="'Observação'" class="wrap-textarea" :maxLength="300" placeholder="Observações...">
              </TextArea>
                <div class="container-btn mt-5">
                    <p class="msg-auxiliar">Campos Obrigatórios*</p>
                </div>
            </v-card-text>
            <v-card-actions class="mt-5 pa-0 w-100 d-flex justify-end flex-row">
                <v-btn class="btn-padrao" :loading="loading" @click="cancel">Cancelar</v-btn>
                <v-spacer />
                <v-btn class="btn-padrao" :loading="loading" @click="cadastrarVacina">Salvar </v-btn>
            </v-card-actions>
        </v-card>
        <v-container v-if="isLoading" class="d-flex align-center justify-center">
            <v-progress-circular indeterminate color="primary" size="40" width="5"></v-progress-circular>
        </v-container>
    </v-dialog>
    <modalCamposObrigatorios v-if="!isLoading" :isOpen="showModalConfirmation"
        @update:isOpen="showModalConfirmation = $event" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref, onMounted } from 'vue';
import { salvarVacinas, editarVacinas } from '@/services/paciente';

// COMPONENTES
import inputText from '@/components/inputText.vue';
import TextArea from '@/components/textArea.vue';
import modalCamposObrigatorios from '@/components/modalCamposObrigatorios.vue';

const props = defineProps({
    modoEdicao: Boolean,
    vacinaSelecionada: Object,
    isOpen: Boolean,
    id_animal: Number
})

const dialogVisible = ref(props.isOpen);
const showModalConfirmation = ref(false);
const isLoading = ref(false);
const textInputs = ref<Record<string, string>>({});
const textarea = ref({ vacinas: '' });
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error');
const idVacinaSeleciona = ref()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void;
    (e: 'vacinaCadastrado', novaVacina: any): void; 
}>();

watch(() => props.isOpen, (val: boolean) => {
    if (props.modoEdicao && props.vacinaSelecionada) {
        textInputs.value['input-nome'] = props.vacinaSelecionada.nome || '';
        textInputs.value['input-fabricante'] = props.vacinaSelecionada.fabricante || '';
        textInputs.value['input-lote'] = props.vacinaSelecionada.lote || '';
        textInputs.value['input-data-aplicacao'] = props.vacinaSelecionada.data_aplicacao || '';
        textInputs.value['input-data-prox-aplicacao'] = props.vacinaSelecionada.data_proxima_dose || '';
        textarea.value.vacinas = props.vacinaSelecionada.observacao || '';
        idVacinaSeleciona.value = props.vacinaSelecionada.id;
    } else {
        limparCampos()
    }
    dialogVisible.value = val;
});

watch(dialogVisible, (val: boolean) => {
    emit('update:isOpen', val);
});

function limparCampos() {
  Object.keys(textInputs.value).forEach((key) => (textInputs.value[key] = ''))
  textarea.value.vacinas = ''
  idVacinaSeleciona.value = undefined
}

function cancel() {
    limparCampos()
    dialogVisible.value = false;
}

const loading = ref(false);

const cadastrarVacina = async () => {
    // valida campos obrigatórios
    const obrigatoriosPreenchidos =
        textInputs.value['input-nome'] &&
        textInputs.value['input-data-aplicacao'] &&
        textInputs.value['input-data-prox-aplicacao'] &&
        textInputs.value['input-fabricante'] &&
        textInputs.value['input-lote'];

    if (!obrigatoriosPreenchidos) {
        showModalConfirmation.value = true;
        return;
    }

    const dados: any = {
        nome: textInputs.value['input-nome'],
        data_aplicacao: textInputs.value['input-data-aplicacao'],
        data_proxima_dose: textInputs.value['input-data-prox-aplicacao'],
        fabricante: textInputs.value['input-fabricante'],
        lote: textInputs.value['input-lote'],
        observacao: textarea.value.vacinas || '',
    };

    try {
        isLoading.value = true;

        if (props.modoEdicao && !props.vacinaSelecionada) {
            const response = await salvarVacinas(props.id_animal, dados);
            dados.id = response.id;
        }

        if(props.modoEdicao && props.vacinaSelecionada){
            await editarVacinas(idVacinaSeleciona.value, dados)
            dados.id = idVacinaSeleciona.value
        }

        emit('vacinaCadastrado', dados);

    } catch (error: any) {
        alertMessage.value = error?.msg || 'Ocorreu um erro inesperado';
        alertType.value = 'error';
        showAlert.value = true;
        setTimeout(() => (showAlert.value = false), 5000);
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
        font-size: 18px;
        line-height: 16px;
        letter-spacing: 0%;
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
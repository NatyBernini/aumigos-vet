<template>
  <v-dialog v-model="dialogVisible" width="95%" max-width="500px" persistent>
    <v-card v-if="!isLoading" id="card-modal-cadastro">
      <row class="row-close-modal">
        <v-btn id="btn-close-modal" @click="cancel">X</v-btn>
      </row>

      <v-card-title class="mb-5">
        <v-icon color="#ff8200" class="mr-2">mdi-pill</v-icon>
        Adicionar Vermífugo
      </v-card-title>

      <v-card-text class="w-100 d-flex flex-column flex-wrap ga-4">
        <v-alert
          v-if="showAlert"
          :type="alertType"
          class="mt-3"
          dismissible
          @click:close="showAlert = false"
        >
          {{ alertMessage }}
        </v-alert>

        <inputText
          label="Nome do Vermífugo*"
          type="text"
          :ocultaContador="true"
          v-model:valueInput="textInputs['input-nome']"
        />

        <inputText
          label="Fabricante*"
          type="text"
          :ocultaContador="true"
          v-model:valueInput="textInputs['input-fabricante']"
        />

        <inputText
          label="Lote*"
          type="text"
          :ocultaContador="true"
          v-model:valueInput="textInputs['input-lote']"
        />

            <inputText
          label="Dosagem*"
          type="text"
          :ocultaContador="true"
          v-model:valueInput="textInputs['input-dosagem']"
        />

        <inputText
          label="Data de Aplicação*"
          type="date"
          :ocultaContador="true"
          v-model:valueInput="textInputs['input-data-aplicacao']"
        />

        <inputText
          label="Data da Próxima Dose*"
          type="date"
          :ocultaContador="true"
          v-model:valueInput="textInputs['input-data-prox-dose']"
        />

        <TextArea
          :modelValue="textarea.vermifugos"
          @update:modelValue="(value: any) => (textarea.vermifugos = value)"
          label="Observações"
          class="wrap-textarea"
          :maxLength="300"
          placeholder="Observações..."
        />

        <div class="container-btn mt-5">
          <p class="msg-auxiliar">Campos obrigatórios*</p>
        </div>
      </v-card-text>

      <v-card-actions class="mt-5 pa-0 w-100 d-flex justify-end flex-row">
        <v-btn class="btn-padrao" :loading="loading" @click="cancel">Cancelar</v-btn>
        <v-spacer />
        <v-btn class="btn-padrao" :loading="loading" @click="cadastrarVermifugo">Salvar</v-btn>
      </v-card-actions>
    </v-card>

    <v-container v-if="isLoading" class="d-flex align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="40" width="5" />
    </v-container>
  </v-dialog>

  <modalCamposObrigatorios
    v-if="!isLoading"
    :isOpen="showModalConfirmation"
    @update:isOpen="showModalConfirmation = $event"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref } from 'vue'

// COMPONENTES
import inputText from '@/components/inputText.vue'
import TextArea from '@/components/textArea.vue'
import modalCamposObrigatorios from '@/components/modalCamposObrigatorios.vue'

// SERVICES
import { salvarVermifugos } from '@/services/paciente'

const props = defineProps<{
  isOpen: boolean
  id_animal: number
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'vermifugoCadastrado'): void
}>()

const dialogVisible = ref(props.isOpen)
const showModalConfirmation = ref(false)
const isLoading = ref(false)
const textInputs = ref<Record<string, string>>({})
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'error' | 'success' | 'info' | 'warning'>('error')
const textarea = ref({ vermifugos: '' })
const loading = ref(false)

watch(
  () => props.isOpen,
  (val: boolean) => {
    dialogVisible.value = val
  }
)

watch(dialogVisible, (val: boolean) => {
  emit('update:isOpen', val)
})

function cancel() {
  Object.keys(textInputs.value).forEach((k) => (textInputs.value[k] = ''))
  dialogVisible.value = false
}

const cadastrarVermifugo = async () => {
  const obrigatoriosPreenchidos =
    textInputs.value['input-nome'] &&
    textInputs.value['input-data-aplicacao'] &&
    textInputs.value['input-data-prox-dose'] &&
    textInputs.value['input-fabricante'] &&
    textInputs.value['input-lote'] &&
    textInputs.value['input-dosagem']
 
  if (!obrigatoriosPreenchidos) {
    showModalConfirmation.value = true
    return
  }

  const dados = {
    nome: textInputs.value['input-nome'],
    data_aplicacao: textInputs.value['input-data-aplicacao'],
    data_proxima_dose: textInputs.value['input-data-prox-dose'],
    fabricante: textInputs.value['input-fabricante'],
    lote: textInputs.value['input-lote'],
    dosagem: textInputs.value['input-dosagem'],
    observacao: textarea.value.vermifugos
  }

  try {
    isLoading.value = true
    // await salvarVermifugos(props.id_animal, dados)

    emit('vermifugoCadastrado')
    alertMessage.value = 'Vermífugo cadastrado com sucesso!'
    alertType.value = 'success'
    showAlert.value = true

    setTimeout(() => {
      showAlert.value = false
    }, 5000)
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

    setTimeout(() => {
      showAlert.value = false
    }, 5000)

    throw error
  } finally {
    isLoading.value = false
  }
}
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

    &:hover > .v-btn__overlay {
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

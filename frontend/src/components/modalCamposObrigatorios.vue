<template>
  <v-dialog v-model="dialogVisible" width="95%" max-width="450px" persistent>
    <v-card v-if="!isLoading" id="card-modal-campos-obrigatorios">
 
      <v-card-title class="mb-5">
        <v-icon color="#ff8200" class="mr-2">mdi-alert</v-icon>
        Formulário incompleto
      </v-card-title>

      <v-card-text class="w-100">
        Existem <strong>campos obrigatórios</strong> que precisam ser preenchidos antes de {{ props.acao }}.
      </v-card-text>

      <v-card-actions class="mt-5 pa-0">
        <!-- Editar -->
        <v-btn class="btn-padrao" text color="primary"
          @click="cancel">Fechar</v-btn>

      
      </v-card-actions>
    </v-card>

    <v-container v-if="isLoading" class="d-flex align-center justify-center">
      <v-progress-circular indeterminate color="#ff8200" size="40" width="5"></v-progress-circular>
    </v-container>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  acao: {
    type: String,
    default: 'Salvar',
    required: false
  }
})


const dialogVisible = ref(false)
const isLoading = ref(false)

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()


watch(
  () => props.isOpen,
  (val) => (dialogVisible.value = val)
)

watch(dialogVisible, (val) => {
  emit('update:isOpen', val)
})

function cancel() {
  dialogVisible.value = false
}

</script>
<style lang="scss">
#card-modal-campos-obrigatorios {
    display: flex;
    text-align: center;
    align-items: center;
    padding: 20px;

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
}
</style>

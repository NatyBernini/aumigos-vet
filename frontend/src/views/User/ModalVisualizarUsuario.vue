<template>
  <v-dialog v-model="dialogVisible" width="95%" max-width="500px" persistent>
    <v-card v-if="!isLoading" id="card-modal-cadastro">
      <row class="row-close-modal">
        <v-btn id="btn-close-modal" @click="cancel">X</v-btn>
      </row>

      <v-card-title class="mb-5">
        <v-icon color="#ff8200" class="mr-2">mdi-account</v-icon>
        Visualizar Usuário
      </v-card-title>

      <v-card-text class="w-100 d-flex flex-column flex-wrap ga-4">
        <inputText label="Nome Completo" type="text" v-model:valueInput="textInputs['input-nome']" :ocultaContador="true"
          :disabled="!isEditing" />
        <inputText label="CPF" type="text" v-model:valueInput="textInputs['input-cpf']" :ocultaContador="true"
          :disabled="!isEditing" />
        <inputText label="E-mail" type="text" v-model:valueInput="textInputs['input-email']" :ocultaContador="true"
          :disabled="!isEditing" />
        <inputText label="E-mail de acesso" type="text" v-model:valueInput="textInputs['input-email-acesso']" :ocultaContador="true"
          :disabled="!isEditing" />
        <inputText label="Data de Nascimento" type="date" v-model:valueInput="textInputs['input-data-nasc']" :ocultaContador="true"
          :disabled="!isEditing" />
        <combo v-model="responsavelAtendimento" :items="tipoUsuario" :extra-items="tipoUsuarioExtra"
          label="Tipo de Usuário*" variant="outlined" id="tipo-user" :isRequired="false"
          :isMultipleSelect="false" class="container-combobox-padrao combo-box-tipo-usuario"
          placeholder="Selecione um tipo" :disabled="!isEditing" />
      </v-card-text>

      <v-card-actions class="mt-5 pa-0 w-100 d-flex justify-end flex-row">
        <!-- Editar -->
        <v-btn class="btn-padrao" text color="primary" v-if="!isEditing"
          @click="habilitarEdicao">Editar</v-btn>

        <!-- Salvar -->
        <v-btn class="btn-padrao" text color="success" v-if="isEditing" @click="salvarAlteracoes">
          Salvar
        </v-btn>

        <!-- Desfazer -->
        <v-btn class="btn-padrao ml-2" text color="warning" v-if="isEditing" @click="desfazerAlteracoes">
          Desfazer
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-container v-if="isLoading" class="d-flex align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="40" width="5"></v-progress-circular>
    </v-container>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import inputText from '@/components/inputText.vue'
import combo from '@/components/select.vue'

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
const isEditing = ref(false)
const textInputs = ref<Record<string, string>>({})
const responsavelAtendimento = ref('')

// backup dos dados originais
const originalData = ref<any>(null)

const tipoUsuario = ['admin_clinica', 'caixa', 'veterinario']
const tipoUsuarioExtra = [
  { descricao: 'admin_clinica', id: 'admin_clinica' },
  { descricao: 'caixa', id: 'caixa' },
  { descricao: 'veterinario', id: 'veterinario' }
]

watch(
  () => props.isOpen,
  (val) => (dialogVisible.value = val)
)

watch(dialogVisible, (val) => {
  emit('update:isOpen', val)
  if (val) preencherCampos()
  else isEditing.value = false
})

function preencherCampos() {
  if (!props.userData) return

  // preencher os inputs
  textInputs.value['input-nome'] = `${props.userData.nome}`
  textInputs.value['input-email'] = props.userData.email_contato
  textInputs.value['input-email-acesso'] = props.userData.email
  textInputs.value['input-cpf'] = props.userData.cpf || ''
  textInputs.value['input-data-nasc'] = props.userData.data_nascimento || ''
  responsavelAtendimento.value = props.userData.tipo

  // guardar cópia original
  originalData.value = {
    nome: textInputs.value['input-nome'],
    email: textInputs.value['input-email'],
    emailAcesso: textInputs.value['input-email-acesso'],
    cpf: textInputs.value['input-cpf'],
    dataNasc: textInputs.value['input-data-nasc'],
    tipo: responsavelAtendimento.value
  }
}

function cancel() {
  dialogVisible.value = false
}

function habilitarEdicao() {
  isEditing.value = true
}

function desfazerAlteracoes() {
  if (!originalData.value) return
  textInputs.value['input-nome'] = originalData.value.nome
  textInputs.value['input-email'] = originalData.value.email
  textInputs.value['input-email-acesso'] = originalData.value.emailAcesso
  textInputs.value['input-cpf'] = originalData.value.cpf
  textInputs.value['input-data-nasc'] = originalData.value.dataNasc
  responsavelAtendimento.value = originalData.value.tipo
  isEditing.value = false
}

async function salvarAlteracoes() {
  isLoading.value = true
  try {
    const [first_name, ...rest] = textInputs.value['input-nome'].split(' ')
    const last_name = rest.join(' ')
    const dadosAtualizados = {
      first_name,
      last_name,
      email: textInputs.value['input-email-acesso'],
      tipo_usuario: responsavelAtendimento.value
    }
    // await atualizarUsuarioClinica(props.userData.id, dadosAtualizados)
    emit('usuarioAtualizado')
    isEditing.value = false
    dialogVisible.value = false
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

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
        <inputText
          label="Nome Completo"
          type="text"
          v-model:valueInput="textInputs['input-nome']"
          :ocultaContador="true"
          :disabled="!isEditing"
        />
        <inputText
          label="CPF"
          type="text"
          v-model:valueInput="textInputs['input-cpf']"
          :ocultaContador="true"
          :disabled="!isEditing"
        />
        <inputText
          label="E-mail"
          type="text"
          v-model:valueInput="textInputs['input-email']"
          :ocultaContador="true"
          :disabled="!isEditing"
        />
        <inputText
          label="E-mail de acesso"
          type="text"
          v-model:valueInput="textInputs['input-email-acesso']"
          :ocultaContador="true"
          :disabled="!isEditing"
        />
        <inputText
          label="Data de Nascimento"
          type="date"
          v-model:valueInput="textInputs['input-data-nasc']"
          :ocultaContador="true"
          :disabled="!isEditing"
        />
        <combo
          v-model="responsavelAtendimento"
          :items="tipoUsuario"
          :extra-items="tipoUsuarioExtra"
          label="Tipo de Usuário*"
          variant="outlined"
          id="tipo-user"
          :isRequired="false"
          :isMultipleSelect="false"
          class="container-combobox-padrao combo-box-tipo-usuario"
          placeholder="Selecione um tipo"
          :disabled="!isEditing"
        />
      </v-card-text>

      <v-card-actions class="mt-5 pa-0 w-100 d-flex justify-end flex-row">
        <v-btn class="btn-padrao" text color="primary" v-if="!isEditing" @click="habilitarEdicao">Editar</v-btn>

        <v-btn class="btn-padrao" text color="success" v-if="isEditing" @click="salvarAlteracoes">
          Salvar
        </v-btn>

        <v-btn class="btn-padrao ml-2" text color="warning" v-if="isEditing" @click="desfazerAlteracoes">
          Desfazer
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-container v-if="isLoading" class="d-flex align-center justify-center">
      <v-progress-circular indeterminate color="#ff8200" size="40" width="5" />
    </v-container>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import inputText from '@/components/inputText.vue'
import combo from '@/components/select.vue'
import { editarUsuarioClinica } from '@/services/clinica'
import type { Usuario } from '@/services/types'

const props = defineProps<{
  userData: Usuario | null
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
const originalData = ref<any>(null)

const tipoUsuario = ['admin_clinica', 'atendente', 'veterinario']
const tipoUsuarioExtra = [
  { descricao: 'Administrador da clínica', id: 'admin_clinica' },
  { descricao: 'Atendente', id: 'atendente' },
  { descricao: 'Veterinário', id: 'veterinario' }
]

// sincroniza abertura do modal
watch(() => props.isOpen, (val) => (dialogVisible.value = val))

watch(dialogVisible, (val) => {
  emit('update:isOpen', val)
  if (val) preencherCampos()
  else isEditing.value = false
})

function preencherCampos() {
  if (!props.userData) return

  const user = props.userData

  textInputs.value['input-nome'] = user.pessoa?.nome_completo || ''
  textInputs.value['input-email'] = user.email || ''
  textInputs.value['input-email-acesso'] = user.email || ''
  textInputs.value['input-cpf'] = user.pessoa?.cpf || ''
  textInputs.value['input-data-nasc'] = user.pessoa?.data_nascimento || ''
  responsavelAtendimento.value = user.tipo_usuario || ''

  // backup
  originalData.value = JSON.parse(JSON.stringify({
    nome: textInputs.value['input-nome'],
    email: textInputs.value['input-email'],
    emailAcesso: textInputs.value['input-email-acesso'],
    cpf: textInputs.value['input-cpf'],
    dataNasc: textInputs.value['input-data-nasc'],
    tipo: responsavelAtendimento.value
  }))
}

function cancel() {
  dialogVisible.value = false
}

function habilitarEdicao() {
  isEditing.value = true
}

function desfazerAlteracoes() {
  if (!originalData.value) return
  Object.entries(originalData.value).forEach(([k, v]) => {
    if (k === 'tipo') responsavelAtendimento.value = v as string
    else textInputs.value[`input-${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`] = v as string
  })
  isEditing.value = false
}

async function salvarAlteracoes() {
  if (!props.userData) return
  isLoading.value = true
  try {
    const [first_name, ...rest] = textInputs.value['input-nome'].split(' ')
    const last_name = rest.join(' ')
    const dadosAtualizados = {
      first_name,
      last_name,
      pessoa: {
        nome_completo: textInputs.value['input-nome'],
        cpf: textInputs.value['input-cpf'],
        data_nascimento: textInputs.value['input-data-nasc'],
      },
      contato: { email: textInputs.value['input-email-acesso'] },
      tipo_usuario: responsavelAtendimento.value
    }

    await editarUsuarioClinica(props.userData.id, dadosAtualizados)
    emit('usuarioAtualizado')
    dialogVisible.value = false
    isEditing.value = false
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

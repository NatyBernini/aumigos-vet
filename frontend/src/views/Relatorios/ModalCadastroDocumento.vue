<template>
  <!-- Modal principal -->
  <v-dialog max-width="700" persistent>
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" class="btn-padrao">
        Adicionar novo documento
      </v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="Enviar Documento">
        <v-card-text>
          <p class="mb-4">
            Anexe documentos importantes relacionados ao paciente ou atendimento da clínica veterinária.
          </p>

          <v-form ref="form">
            <!-- Input de arquivo -->
            <v-file-input
              v-model="selectedFile"
              label="Selecione o arquivo"
              accept=".pdf,.docx,.png,.jpeg,.jpg"
              outlined
              dense
              required
              @change="validateFile"
            ></v-file-input>

          </v-form>

          <p class="msg-tipos-arquivos">
            Tipos de arquivos aceitos: <strong>PDF, DOCX, PNG e JPEG</strong>.
          </p> 
          <div class="container-input-nome mt-4"> <inputText v-if="selectedFile" label="Nome do Documento*" type="text" required v-model:valueInput="textInputs['input-nome']"
                  id="input-nome" @update:valueInput="(value: any) => updateInput('input-nome', value)"/></div>
       
          <TextArea v-if="selectedFile" :modelValue="textarea.ObservacoesGerais"
              @update:modelValue="(value: any) => (textarea.ObservacoesGerais = value)" label="Descrição"
              class="wrap-textarea" :maxLength="300" placeholder="Texto descritivo que irá aparecer na tela de Relatórios e Documentos...">
            </TextArea>
        </v-card-text>

        <v-card-actions class="pa-5">
            <v-btn
              v-if="selectedFile"
              class="btn-padrao mt-2"
              @click="previewDialog = true"
            >
              Visualizar documento
            </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="isActive.value = false">Cancelar</v-btn>
          <v-btn class="btn-padrao" @click="saveFile(isActive)" :disabled="!selectedFile">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

  <!-- Modal de preview -->
  <v-dialog v-model="previewDialog" max-width="800">
    <v-card  class="pa-3">
      <v-card-title>Visualizar Arquivo</v-card-title>
      <v-card-text class="d-flex justify-center">
        <template v-if="selectedFile">
          <img
            v-if="isImage(selectedFile)"
            :src="previewUrl"
            alt="Preview"
            style="max-width:100%; max-height:400px;"
          />
          <iframe
            v-else-if="isPDF(selectedFile)"
            :src="previewUrl"
            style="width:100%; height:80vh;"
          ></iframe>
          <p v-else>
            Arquivo selecionado: <strong>{{ selectedFile.name }}</strong>
          </p>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="btn-padrao" text @click="previewDialog = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// COMPONENTES
import TextArea from '@/components/textArea.vue'
import inputText from '@/components/inputText.vue'


const selectedFile = ref<File | null>(null)
const previewDialog = ref(false)
const previewUrl = ref<string>('')

const textarea = ref({ ObservacoesGerais: '' })

const textInputs = ref<Record<string, string>>({});
const updateInput = (id: string, newValue: string) => {
  textInputs.value[id] = newValue;
};

const allowedTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg'
]

// Validação ao selecionar o arquivo
const validateFile = () => {
  if (!selectedFile.value) return

  if (!allowedTypes.includes(selectedFile.value.type)) {
    alert('Tipo de arquivo inválido! Apenas PDF, DOCX, PNG ou JPEG são permitidos.')
    selectedFile.value = null
    previewUrl.value = ''
  }
}

// Cria URL de preview quando a imagem ou PDF muda
watch(selectedFile, (file) => {
  if (!file) return
  if (isImage(file) || isPDF(file)) {
    previewUrl.value = URL.createObjectURL(file)
  } else {
    previewUrl.value = ''
  }
})

const saveFile = (isActive: { value: boolean }) => {
  if (!selectedFile.value) return
  console.log('Arquivo selecionado:', selectedFile.value)
  isActive.value = false
  selectedFile.value = null
  previewUrl.value = ''
}

const isImage = (file: File) => ['image/png', 'image/jpeg'].includes(file.type)
const isPDF = (file: File) => file.type === 'application/pdf'
</script>

<style lang="scss">
.container-input-nome {
    max-width: 300px;
}
.msg-tipos-arquivos {
  font-size: 14px;
}
</style>

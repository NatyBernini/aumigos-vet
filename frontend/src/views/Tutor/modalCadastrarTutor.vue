<template>
  <!-- ‑‑‑ Botão que abre o diálogo ‑‑‑ -->
  <v-dialog max-width="700">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        class="btn-padrao"
        :text="readOnly ? 'Ver Tutor' : 'Cadastrar Tutor'"
        variant="flat"
      />
    </template>

    <!-- ‑‑‑ Conteúdo do modal ‑‑‑ -->
    <template #default="{ isActive }">
      <v-card :title="readOnly ? 'Dados do Tutor' : 'Cadastrar Tutor'">
        <v-card-text>

          <!-- FORM only roda validação se NÃO estiver read‑only -->
          <form @submit.prevent="readOnly ? isActive.value = false : submit">
            <!-- Informações básicas -->
            <p>Informações Básicas</p>
            <v-col>
              <v-row class="row-info-basicas">
                <v-text-field
                  v-model="nameTutor.value.value"
                  :disabled="readOnly"
                  :error-messages="nameTutor.errorMessage.value"
                  label="Nome*"
                  max-width="300px"
                />
              </v-row>

              <v-row class="row-info-basicas">
                <v-text-field
                  v-model="cpf.value.value"
                  :disabled="readOnly"
                  :error-messages="cpf.errorMessage.value"
                  label="CPF*"
                  maxlength="14"
                  max-width="150px"
                />

                <v-text-field
                  v-model="rg.value.value"
                  :disabled="readOnly"
                  :error-messages="rg.errorMessage.value"
                  label="RG*"
                  type="number"
                  max-width="150px"
                />
              </v-row>
            </v-col>

            <!-- Contatos -->
            <p>Informações para Contato</p>
            <v-col>
              <v-row
                class="row-info-basicas"
                v-for="(item, index) in phones"
                :key="index"
              >
                <v-text-field
                  v-model="item.number"
                  :disabled="readOnly"
                  label="Telefone*"
                  placeholder="(00) 00000-0000"
                  maxlength="15"
                  max-width="180px"
                />

                <!-- Botões de adicionar / remover só no modo edição -->
                <template v-if="!readOnly">
                  <v-btn
                    icon
                    class="btn-padrao btn-plus-phone"
                    @click="addPhone"
                    v-if="index === phones.length - 1"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    class="btn-padrao btn-plus-phone"
                    @click="removePhone(index)"
                    v-if="phones.length > 1"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-row>

              <v-row class="row-info-basicas">
                <v-text-field
                  v-model="email.value.value"
                  :disabled="readOnly"
                  :error-messages="email.errorMessage.value"
                  label="E‑mail"
                  max-width="400px"
                />
              </v-row>
            </v-col>

            <!-- Endereço -->
            <p>Informações de Endereço</p>
            <v-col>
              <v-row class="row-info-basicas">
                <v-text-field
                  v-model="estado.value.value"
                  :disabled="readOnly"
                  :error-messages="estado.errorMessage.value"
                  label="Estado*"
                  max-width="150px"
                />

                <v-text-field
                  v-model="cidade.value.value"
                  :disabled="readOnly"
                  :error-messages="cidade.errorMessage.value"
                  label="Cidade*"
                  max-width="250px"
                />
              </v-row>

              <v-row class="row-info-basicas">
                <v-text-field
                  v-model="bairro.value.value"
                  :disabled="readOnly"
                  :error-messages="bairro.errorMessage.value"
                  label="Bairro*"
                  max-width="150px"
                />

                <v-text-field
                  v-model="rua.value.value"
                  :disabled="readOnly"
                  :error-messages="rua.errorMessage.value"
                  label="Rua*"
                  max-width="250px"
                />
              </v-row>

              <v-row class="row-info-basicas">
                <v-text-field
                  v-model="numero.value.value"
                  :disabled="readOnly"
                  :error-messages="numero.errorMessage.value"
                  label="N*"
                  type="number"
                  max-width="70px"
                />

                <v-text-field
                  v-model="complemento.value.value"
                  :disabled="readOnly"
                  :error-messages="complemento.errorMessage.value"
                  label="Complemento*"
                  max-width="250px"
                />
              </v-row>
            </v-col>

            <!-- Rodapé / botões -->
            <div class="container-btn mt-5">
              <p v-if="!readOnly" class="msg-auxiliar">Campos Obrigatórios*</p>
            </div>

            <div class="mt-5 container-btn">
              <v-btn
                class="me-4 btn-padrao"
                :text="readOnly ? 'Fechar' : 'Cancelar'"
                @click="isActive.value = false"
              />

              <v-btn
                v-if="!readOnly"
                class="me-4 btn-padrao"
                type="submit"
              >
                Salvar
              </v-btn>
            </div>
          </form>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
/* ───── imports ───── */
import { ref, watch, watchEffect, computed } from 'vue'
import { useField, useForm } from 'vee-validate'
import { pacientesMock } from '../../mock/pacientesMock'

/* ───── props ───── */
const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'view'
    patientId?: number | null
  }>(),
  {
    mode: 'create',
    patientId: null,
  },
)

const readOnly = computed(() => props.mode === 'view')

/* ───── formulário / validação (só quando edição) ───── */
const { handleSubmit } = useForm({
  validationSchema: readOnly.value
    ? {} // sem validação no modo visualização
    : {
        nameTutor: v => v?.length > 0 || 'Campo obrigatório.',
        rg: v => v?.length > 0 || 'Campo obrigatório.',
        cpf: v => v?.length > 0 || 'Campo obrigatório.',
        phone: v => /^\d{7,}$/.test((v ?? '').replace(/\D/g, '')) || 'Telefone inválido.',
        email: v =>
          !v || /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v) || 'E‑mail inválido.',
        estado: v => v?.length > 0 || 'Campo obrigatório.',
        cidade: v => v?.length > 0 || 'Campo obrigatório.',
        bairro: v => v?.length > 0 || 'Campo obrigatório.',
        rua: v => v?.length > 0 || 'Campo obrigatório.',
        numero: v => v?.length > 0 || 'Campo obrigatório.',
        complemento: v => v?.length > 0 || 'Campo obrigatório.',
      },
})

/* ───── fields ───── */
const nameTutor = useField('nameTutor')
const rg = useField('rg')
const cpf = useField('cpf')
const email = useField('email')

/* telefone(s) */
const phones = ref<{ number: string }[]>([{ number: '' }])

/* endereço */
const estado = useField('estado')
const cidade = useField('cidade')
const bairro = useField('bairro')
const rua = useField('rua')
const numero = useField('numero')
const complemento = useField('complemento')

/* ───── helpers ───── */
const submit = handleSubmit(values =>
  alert(JSON.stringify({ ...values, phones: phones.value }, null, 2)),
)

function addPhone() {
  phones.value.push({ number: '' })
}
function removePhone(i: number) {
  phones.value.splice(i, 1)
}

/* formatadores */
function formatPhoneNumber(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 11)
  return digits.length <= 10
    ? digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    : digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}
function formatCPF(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 11)
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').replace(/[-.]$/, '')
}

/* watchers para formatação */
watch(
  phones,
  ps =>
    ps.forEach((p, i) => {
      const f = formatPhoneNumber(p.number)
      if (f !== p.number) phones.value[i].number = f
    }),
  { deep: true },
)
watch(
  () => cpf.value.value as string | undefined,
  (newValue, oldValue) => {
    const formatted = formatCPF(newValue ?? '')
    if (formatted !== newValue) {
      cpf.value.value = formatted
    }
  }
)

/* ───── carregar tutor a partir do patientId ───── */
watchEffect(() => {
  if (!props.patientId) return

  const paciente = pacientesMock.find(p => p.id === props.patientId)
  if (!paciente) return

  /* popular campos */
  nameTutor.value.value = paciente.tutor
  cpf.value.value = paciente.tutorCpf
  rg.value.value = paciente.tutorRg
  email.value.value = paciente.tutorEmail

  estado.value.value = paciente.estado ?? ''
  cidade.value.value = paciente.cidade ?? ''
  bairro.value.value = paciente.bairro ?? ''
  rua.value.value = paciente.rua ?? ''
  numero.value.value = paciente.numero ?? ''
  complemento.value.value = paciente.complemento ?? ''

  phones.value = (paciente.tutorPhones ?? ['']).map(n => ({ number: n }))
})
</script>


<style  lang="scss">
.v-overlay__content {
    background-color: #fff;
    border-radius: 50px;

    .v-card {
        
    border-radius: 20px!important;
    max-height: 85vh;
    }
}

.btn-plus-phone {
        width: 30px!important;
    height: 30px!important;
}

</style>
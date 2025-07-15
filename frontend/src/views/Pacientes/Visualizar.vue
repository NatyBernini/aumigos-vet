<!-- src/views/Paciente/Visualizar.vue -->
<template>
  <v-card>
    <!-- Cabeçalho / Breadcrumb -->
    <p class="title-page">
      Cadastro do Paciente
      <img src="../../assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
    </p>
    <p class="sub-page">
      Pacientes /
      <span class="aba-atual">Visualizar</span>
      <img src="../../assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
    </p>

    <!-- Abas -->
    <v-tabs v-model="tab">
      <v-tab value="one">Informações do Paciente</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one" class="pt-5">
          <modal-cadastrar-tutor mode="view" :patient-id="pacienteId"/>

          <!-- Formulário -->
          <form class="mt-5" @submit.prevent="submit">
            <!-- Origem -->
            <div class="row-info-radios">
              <v-radio-group inline>
                <v-radio label="Doméstico" value="domestico" />
                <v-radio label="Resgatado" value="resgatado" />
              </v-radio-group>
            </div>

            <!-- Espécie -->
            <p>Espécie*</p>
            <div class="row-info-radios">
              <v-radio-group
                v-model="especie.value.value"
                :error-messages="especie.errorMessage.value"
                inline
                max-width="300px"
              >
                <v-radio label="Canina" value="especieCan" />
                <v-radio label="Felina" value="especieFel" />
                <v-radio label="Outra" value="especieOutra" />
              </v-radio-group>

              <v-text-field
                v-if="especie.value.value === 'especieOutra'"
                v-model="outraEspecie.value.value"
                :error-messages="outraEspecie.errorMessage.value"
                label="Especificar Outra Espécie"
                placeholder="Especifique a outra espécie"
                max-width="300px"
              />
            </div>

            <!-- Informações básicas -->
            <p>Informações Básicas</p>
            <v-col>
              <v-row class="row-info-basicas">
                <v-text-field
                  v-model="name.value.value"
                  :error-messages="name.errorMessage.value"
                  label="Nome*"
                  placeholder="Nome"
                  max-width="300px"
                />

                <v-text-field
                  v-model="idade.value.value"
                  :error-messages="idade.errorMessage.value"
                  label="Idade*"
                  placeholder="Idade"
                  max-width="150px"
                />
              </v-row>

              <v-row class="row-info-basicas">
                <v-text-field
                  v-model="peso.value.value"
                  :error-messages="peso.errorMessage.value"
                  label="Peso*"
                  placeholder="Peso"
                  type="number"
                  max-width="150px"
                />

                <v-text-field
                  v-model="raca.value.value"
                  :error-messages="raca.errorMessage.value"
                  label="Raça*"
                  placeholder="Raça"
                  max-width="300px"
                />

                <v-text-field
                  v-model="pelagem.value.value"
                  :error-messages="pelagem.errorMessage.value"
                  label="Pelagem*"
                  placeholder="Pelagem"
                  max-width="300px"
                />
              </v-row>
            </v-col>

            <!-- Porte -->
            <p>Porte</p>
            <div class="row-info-radios">
              <v-radio-group v-model="porte.value.value" inline>
                <v-radio label="Pequeno" value="porteP" />
                <v-radio label="Médio" value="porteM" />
                <v-radio label="Grande" value="porteG" />
              </v-radio-group>
            </div>

            <!-- Sexo -->
            <p>Sexo*</p>
            <div class="row-info-radios">
              <v-radio-group
                v-model="sexo.value.value"
                :error-messages="sexo.errorMessage.value"
                inline
              >
                <v-radio label="Masculino" value="sexoM" />
                <v-radio label="Feminino" value="sexoF" />
              </v-radio-group>
            </div>

            <!-- Castração -->
            <p>Castrado?*</p>
            <div class="row-info-radios">
              <v-radio-group
                v-model="castrado.value.value"
                :error-messages="castrado.errorMessage.value"
                inline
                max-width="150px"
              >
                <v-radio label="Sim" value="castradoS" />
                <v-radio label="Não" value="castradoN" />
              </v-radio-group>

              <v-text-field
                v-if="castrado.value.value === 'castradoS'"
                v-model="dataCastrado.value.value"
                :error-messages="dataCastrado.errorMessage.value"
                label="Data*"
                type="date"
                max-width="150px"
              />
            </div>

            <!-- Vermifugação -->
            <p>Vermifugado?*</p>
            <div class="row-info-radios">
              <v-radio-group
                v-model="vermifugado.value.value"
                :error-messages="vermifugado.errorMessage.value"
                inline
                max-width="150px"
              >
                <v-radio label="Sim" value="vermifugadoS" />
                <v-radio label="Não" value="vermifugadoN" />
              </v-radio-group>

              <v-text-field
                v-if="vermifugado.value.value === 'vermifugadoS'"
                v-model="dataVermifugado.value.value"
                :error-messages="dataVermifugado.errorMessage.value"
                label="Data*"
                type="date"
                max-width="150px"
              />
            </div>

            <!-- Vacinas -->
            <p>Vacinado?*</p>
            <div class="row-info-radios">
              <v-radio-group
                v-model="vacina.value.value"
                :error-messages="vacina.errorMessage.value"
                inline
                max-width="150px"
              >
                <v-radio label="Sim" value="vacinadoS" />
                <v-radio label="Não" value="vacinadoN" />
              </v-radio-group>
            </div>

            <v-textarea
              class="mb-4"
              v-if="vacina.value.value === 'vacinadoS'"
              v-model="quaisVacinas.value.value"
              :error-messages="quaisVacinas.errorMessage.value"
              :rules="rules"
              label="Quais Vacinas?*"
              counter
              maxlength="300"
              max-width="500px"
              placeholder="Detalhe quais vacinas foram tomadas..."
            />

            <!-- Observações -->
            <v-textarea
              v-model="textarea.ObservacoesGerais"
              :rules="rules"
              label="Observações"
              counter
              maxlength="300"
              max-width="500px"
              placeholder="Detalhe algum ponto extra sobre o paciente..."
            />

            <!-- Botões -->
            <div class="container-btn mt-5">
              <p class="msg-auxiliar">Campos Obrigatórios*</p>
            </div>
            <div class="container-btn mt-5">
              <v-btn class="me-4 btn-padrao" type="submit"> Salvar </v-btn>
            </div>
          </form>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
/* ------------------------------------------------- */
/* Imports                                           */
/* ------------------------------------------------- */
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import modalCadastrarTutor from '../Tutor/modalCadastrarTutor.vue'
import { pacientesMock } from '../../mock/pacientesMock'

/* ------------------------------------------------- */
/* Tabs                                              */
/* ------------------------------------------------- */
defineOptions({ name: 'PacienteVisualizar' })
const tab = ref('one')

/* ------------------------------------------------- */
/* Validação (vee-validate)                          */
/* ------------------------------------------------- */
const { handleSubmit } = useForm({
  validationSchema: {
    name: v => v?.length > 0 || 'Campo obrigatório.',
    idade: v => v?.length > 0 || 'Campo obrigatório.',
    raca: v => v?.length > 0 || 'Campo obrigatório.',
    peso: v => v?.length > 0 || 'Campo obrigatório.',
    pelagem: v => v?.length > 0 || 'Campo obrigatório.',
    especie: v => !!v || 'Selecione uma espécie.',
    outraEspecie(value) {
      if (especie.value.value === 'especieOutra') return !!value || 'Campo Obrigatório.'
      return true
    },
    sexo: v => !!v || 'Informe o sexo.',
    porte: v => !!v || 'Informe o porte.',
    castrado: v => !!v || 'Informe se é castrado.',
    vermifugado: v => !!v || 'Informe se é vermifugado.',
    vacina: v => !!v || 'Informe se é vacinado.',
    dataCastrado(value) {
      if (castrado.value.value === 'castradoS') return !!value || 'Informe a data.'
      return true
    },
    dataVermifugado(value) {
      if (vermifugado.value.value === 'vermifugadoS') return !!value || 'Informe a data.'
      return true
    },
    quaisVacinas(value) {
      if (vacina.value.value === 'vacinadoS') return !!value || 'Informe as vacinas.'
      return true
    },
    nameTutor: v => v?.length > 0 || 'Campo obrigatório.',
    rg: v => v?.length > 0 || 'Campo obrigatório.',
    cpf: v => v?.length > 0 || 'Campo obrigatório.',
    phone(value) {
      const digits = String(value ?? '').replace(/\D/g, '')  // ← garante string
      if (digits.length === 0) return 'Telefone é obrigatório.'
      return digits.length >= 7 || 'Telefone precisa ter ao menos 7 dígitos.'
    },
    email: v => /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v) || 'E-mail inválido.',
  },
})

/* ------------------------------------------------- */
/* useField – Paciente                               */
/* ------------------------------------------------- */
const name = useField('name')
const raca = useField('raca')
const peso = useField('peso')
const pelagem = useField('pelagem')
const idade = useField('idade')
const especie = useField('especie')
const outraEspecie = useField('outraEspecie')
const porte = useField('porte')
const sexo = useField('sexo')
const castrado = useField('castrado')
const dataCastrado = useField('dataCastrado')
const vermifugado = useField('vermifugado')
const dataVermifugado = useField('dataVermifugado')
const vacina = useField('vacina')
const quaisVacinas = useField('quaisVacinas')

/* ------------------------------------------------- */
/* useField – Tutor                                  */
/* ------------------------------------------------- */
const nameTutor = useField('nameTutor')
const rg = useField('rg')
const cpf = useField('cpf')
const phone = useField('phone')
const email = useField('email')

/* ------------------------------------------------- */
/* Telefones                                         */
/* ------------------------------------------------- */
const phones = ref<{ number: string }[]>([{ number: '' }])

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 10)
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}

watch(
  phones,
  newPhones => {
    newPhones.forEach((item, i) => {
      const formatted = formatPhoneNumber(item.number)
      if (formatted !== item.number) phones.value[i].number = formatted
    })
  },
  { deep: true },
)

/* ------------------------------------------------- */
/* Regras / textarea                                 */
/* ------------------------------------------------- */
const rules = [v => v.length <= 300 || 'Máximo 300 caracteres']
const textarea = ref({ ObservacoesGerais: '' })

/* ------------------------------------------------- */
/* Submit                                            */
/* ------------------------------------------------- */
const submit = handleSubmit(values => {
  alert(JSON.stringify({ ...values, phones: phones.value }, null, 2))
})

/* ------------------------------------------------- */
/* Carregar dados do mock                            */
/* ------------------------------------------------- */
const route = useRoute()
const pacienteId = Number(route.params.id) || 0

function carregarPaciente() {
  const paciente = pacientesMock.find(p => p.id === pacienteId)
  if (!paciente) {
    console.warn('Paciente não encontrado')
    return
  }

  /* --- Básico --- */
  name.value.value = paciente.nome
  idade.value.value = paciente.idade.toString()
  peso.value.value = paciente.peso.toString()
  raca.value.value = paciente.raca
  pelagem.value.value = paciente.pelagem
  especie.value.value = paciente.especie
  outraEspecie.value.value = paciente.outraEspecie ?? ''
  porte.value.value = paciente.porte
  sexo.value.value = paciente.sexo

  /* --- Castração / vermifugação / vacina --- */
  castrado.value.value = paciente.castrado
  dataCastrado.value.value = paciente.dataCastrado ?? ''
  vermifugado.value.value = paciente.vermifugado
  dataVermifugado.value.value = paciente.dataVermifugado ?? ''
  vacina.value.value = paciente.vacina
  quaisVacinas.value.value = paciente.quaisVacinas ?? ''
  textarea.value.ObservacoesGerais = paciente.observacoes ?? ''

  /* --- Tutor --- */
  nameTutor.value.value = paciente.tutor
  rg.value.value = paciente.tutorRg
  cpf.value.value = paciente.tutorCpf
  email.value.value = paciente.tutorEmail
  phones.value = paciente.tutorPhones.map(number => ({ number }))
}

onMounted(carregarPaciente)
/* Recarrega se navegar entre pacientes sem descarregar o componente */
watch(
  () => route.params.id,
  () => {
    carregarPaciente()
  },
)
</script>


<style lang="scss">
.v-slide-group {
  border-bottom: 1px solid #ABABAB;
}

.v-tab__slider {
  background: #d31b2773 !important;
  border-radius: 5px;
  height: 3px !important;
}

.v-btn {
  text-transform: initial;

}

.v-tab-item--selected {
  .v-btn__content {
    color: #d31b27;
  }
}

.v-card {
  box-shadow: none !important;
}

.row-info-basicas {
  gap: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.row-info-radios {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 20px;
}
</style>
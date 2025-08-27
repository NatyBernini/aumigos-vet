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
          <modal-cadastrar-tutor mode="view" :patient-id="pacienteId" />

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
                v-model="especie"
                :error-messages="especieError"
                inline
                max-width="300px"
              >
                <v-radio label="Canina" value="especieCan" />
                <v-radio label="Felina" value="especieFel" />
                <v-radio label="Outra" value="especieOutra" />
              </v-radio-group>

              <v-text-field
                v-if="especie === 'especieOutra'"
                v-model="outraEspecie"
                :error-messages="outraEspecieError"
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
                  v-model="name"
                  :error-messages="nameError"
                  label="Nome*"
                  placeholder="Nome"
                  max-width="300px"
                />

                <v-text-field
                  v-model="idade"
                  :error-messages="idadeError"
                  label="Idade*"
                  placeholder="Idade"
                  max-width="150px"
                />
              </v-row>

              <v-row class="row-info-basicas">
                <v-text-field
                  v-model="peso"
                  :error-messages="pesoError"
                  label="Peso*"
                  placeholder="Peso"
                  type="number"
                  max-width="150px"
                />

                <v-text-field
                  v-model="raca"
                  :error-messages="racaError"
                  label="Raça*"
                  placeholder="Raça"
                  max-width="300px"
                />

                <v-text-field
                  v-model="pelagem"
                  :error-messages="pelagemError"
                  label="Pelagem*"
                  placeholder="Pelagem"
                  max-width="300px"
                />
              </v-row>
            </v-col>

            <!-- Porte -->
            <p>Porte</p>
            <div class="row-info-radios">
              <v-radio-group v-model="porte" inline>
                <v-radio label="Pequeno" value="porteP" />
                <v-radio label="Médio" value="porteM" />
                <v-radio label="Grande" value="porteG" />
              </v-radio-group>
            </div>

            <!-- Sexo -->
            <p>Sexo*</p>
            <div class="row-info-radios">
              <v-radio-group
                v-model="sexo"
                :error-messages="sexoError"
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
                v-model="castrado"
                :error-messages="castradoError"
                inline
                max-width="150px"
              >
                <v-radio label="Sim" value="castradoS" />
                <v-radio label="Não" value="castradoN" />
              </v-radio-group>

              <v-text-field
                v-if="castrado === 'castradoS'"
                v-model="dataCastrado"
                :error-messages="dataCastradoError"
                label="Data*"
                type="date"
                max-width="150px"
              />
            </div>

            <!-- Vermifugação -->
            <p>Vermifugado?*</p>
            <div class="row-info-radios">
              <v-radio-group
                v-model="vermifugado"
                :error-messages="vermifugadoError"
                inline
                max-width="150px"
              >
                <v-radio label="Sim" value="vermifugadoS" />
                <v-radio label="Não" value="vermifugadoN" />
              </v-radio-group>

              <v-text-field
                v-if="vermifugado === 'vermifugadoS'"
                v-model="dataVermifugado"
                :error-messages="dataVermifugadoError"
                label="Data*"
                type="date"
                max-width="150px"
              />
            </div>

            <!-- Vacinas -->
            <p>Vacinado?*</p>
            <div class="row-info-radios">
              <v-radio-group
                v-model="vacina"
                :error-messages="vacinaError"
                inline
                max-width="150px"
              >
                <v-radio label="Sim" value="vacinadoS" />
                <v-radio label="Não" value="vacinadoN" />
              </v-radio-group>
            </div>

            <v-textarea
              class="mb-4"
              v-if="vacina === 'vacinadoS'"
              v-model="quaisVacinas"
              :error-messages="quaisVacinasError"
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
              <v-btn class="me-4 btn-padrao" type="submit">Salvar</v-btn>
            </div>
          </form>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">

import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import modalCadastrarTutor from '../Tutor/modalCadastrarTutor.vue'
import { pacientesMock } from '../../mock/pacientesMock'

defineOptions({ name: 'PacienteVisualizar' })
const tab = ref('one')

const { handleSubmit } = useForm({
  validationSchema: {
    name: (v: unknown) => typeof v === 'string' && v.length > 0 || 'Campo obrigatório.',
    idade: (v: unknown) => typeof v === 'string' && v.length > 0 || 'Campo obrigatório.',
    raca: (v: unknown) => typeof v === 'string' && v.length > 0 || 'Campo obrigatório.',
    peso: (v: unknown) => typeof v === 'string' && v.length > 0 || 'Campo obrigatório.',
    pelagem: (v: unknown) => typeof v === 'string' && v.length > 0 || 'Campo obrigatório.',
    especie: (v: unknown) => !!v || 'Selecione uma espécie.',
    outraEspecie(value: unknown) {
      if (especie.value === 'especieOutra') {
        return typeof value === 'string' && value.length > 0 || 'Campo Obrigatório.'
      }
      return true
    },
    sexo: (v: unknown) => !!v || 'Informe o sexo.',
    porte: (v: unknown) => !!v || 'Informe o porte.',
    castrado: (v: unknown) => !!v || 'Informe se é castrado.',
    vermifugado: (v: unknown) => !!v || 'Informe se é vermifugado.',
    vacina: (v: unknown) => !!v || 'Informe se é vacinado.',
    dataCastrado(value: unknown) {
      if (castrado.value === 'castradoS') {
        return typeof value === 'string' && value.length > 0 || 'Informe a data.'
      }
      return true
    },
    dataVermifugado(value: unknown) {
      if (vermifugado.value === 'vermifugadoS') {
        return typeof value === 'string' && value.length > 0 || 'Informe a data.'
      }
      return true
    },
    quaisVacinas(value: unknown) {
      if (vacina.value === 'vacinadoS') {
        return typeof value === 'string' && value.length > 0 || 'Informe as vacinas.'
      }
      return true
    },
    nameTutor: (v: unknown) => typeof v === 'string' && v.length > 0 || 'Campo obrigatório.',
    rg: (v: unknown) => typeof v === 'string' && v.length > 0 || 'Campo obrigatório.',
    cpf: (v: unknown) => typeof v === 'string' && v.length > 0 || 'Campo obrigatório.',
    phone(value: unknown) {
      const digits = String(value ?? '').replace(/\D/g, '')
      if (digits.length === 0) return 'Telefone é obrigatório.'
      return digits.length >= 7 || 'Telefone precisa ter ao menos 7 dígitos.'
    },
    email: (v: unknown) =>
      typeof v === 'string' && /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v) || 'E-mail inválido.',
  },
})

// Paciente
const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: idade, errorMessage: idadeError } = useField<string>('idade')
const { value: raca, errorMessage: racaError } = useField<string>('raca')
const { value: peso, errorMessage: pesoError } = useField<string>('peso')
const { value: pelagem, errorMessage: pelagemError } = useField<string>('pelagem')
const { value: especie, errorMessage: especieError } = useField<string>('especie')
const { value: outraEspecie, errorMessage: outraEspecieError } = useField<string>('outraEspecie')
const { value: porte, errorMessage: porteError } = useField<string>('porte')
const { value: sexo, errorMessage: sexoError } = useField<string>('sexo')
const { value: castrado, errorMessage: castradoError } = useField<string>('castrado')
const { value: dataCastrado, errorMessage: dataCastradoError } = useField<string>('dataCastrado')
const { value: vermifugado, errorMessage: vermifugadoError } = useField<string>('vermifugado')
const { value: dataVermifugado, errorMessage: dataVermifugadoError } = useField<string>('dataVermifugado')
const { value: vacina, errorMessage: vacinaError } = useField<string>('vacina')
const { value: quaisVacinas, errorMessage: quaisVacinasError } = useField<string>('quaisVacinas')

// Tutor
const { value: nameTutor, errorMessage: nameTutorError } = useField<string>('nameTutor')
const { value: rg, errorMessage: rgError } = useField<string>('rg')
const { value: cpf, errorMessage: cpfError } = useField<string>('cpf')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: email, errorMessage: emailError } = useField<string>('email')

// Telefones                                         
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

const rules = [(v: string) => v.length <= 300 || 'Máximo 300 caracteres']
const textarea = ref({ ObservacoesGerais: '' })

const submit = handleSubmit(values => {
  alert(JSON.stringify({ ...values, phones: phones.value }, null, 2))
})

const route = useRoute()
const pacienteId = Number(route.params.id) || 0

function carregarPaciente() {
  const paciente = pacientesMock.find(p => p.id === pacienteId)
  if (!paciente) {
    console.warn('Paciente não encontrado')
    return
  }

  name.value = paciente.nome
  idade.value = paciente.idade.toString()
  peso.value = paciente.peso.toString()
  raca.value = paciente.raca
  pelagem.value = paciente.pelagem
  especie.value = paciente.especie
  outraEspecie.value = paciente.outraEspecie ?? ''
  porte.value = paciente.porte
  sexo.value = paciente.sexo

  /* --- Castração / vermifugação / vacina --- */
  castrado.value = paciente.castrado
  dataCastrado.value = paciente.dataCastrado ?? ''
  vermifugado.value = paciente.vermifugado
  dataVermifugado.value = paciente.dataVermifugado ?? ''
  vacina.value = paciente.vacina
  quaisVacinas.value = paciente.quaisVacinas ?? ''
  textarea.value.ObservacoesGerais = paciente.observacoes ?? ''

  /* --- Tutor --- */
  nameTutor.value = paciente.tutor
  rg.value = paciente.tutorRg
  cpf.value = paciente.tutorCpf
  email.value = paciente.tutorEmail
  phones.value = paciente.tutorPhones.map(number => ({ number }))
}

onMounted(carregarPaciente)
watch(() => route.params.id, carregarPaciente)
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
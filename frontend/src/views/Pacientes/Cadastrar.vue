<template>
  <v-card>
    <!-- Cabeçalho / Breadcrumb -->
    <p class="title-page">
      Cadastro do Paciente
      <img src="../../assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
    </p>
    <p class="sub-page">
      Pacientes /
      <span class="aba-atual">Cadastrar</span>
      <img src="../../assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
    </p>

    <!-- Abas -->
    <v-tabs v-model="tab">
      <v-tab value="paciente">Informações do Paciente</v-tab>
      <v-tab value="tutor">Informações do Responsável</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="paciente">
          <!-- <div>
                <v-btn
                      color="accent"
                      large
                      @click.stop="showScheduleForm = true"
                      class="btn-novo-cadastro"
                    >
                      Cadastrar Tutor
                      <v-icon class="icon-close ml-3">mdi-format-align-left</v-icon>
                    </v-btn>
                  </div> -->

          <!-- Formulário -->
          <form @submit.prevent="submit">
            <!-- Origem -->
            <div class="row-info-radios">
              <v-radio-group v-model="origem" :error-messages="origemError" inline>
                <v-radio label="Doméstico" value="domestico" />
                <v-radio label="Resgatado" value="resgatado" />
              </v-radio-group>
            </div>

            <!-- Espécie -->
            <p>Espécie*</p>
            <div class="row-info-radios">
              <v-radio-group v-model="especie" :error-messages="especieError" inline max-width="300px">
                <v-radio label="Canina" value="especieCan" />
                <v-radio label="Felina" value="especieFel" />
                <v-radio label="Outra" value="especieOutra" />
              </v-radio-group>

              <inputText v-if="especie === 'especieOutra'" label="Especificar Outra Espécie*" type="text" required
                v-model:valueInput="textInputs['input-especificar-outra-especie']"
                id="input-especificar-outra-especie" />
            </div>

            <!-- Informações básicas -->
            <p>Informações Básicas</p>
            <v-col>
              <v-row class="row-info-basicas">
                <inputText label="Nome*" type="text" required v-model:valueInput="textInputs['input-nome']"
                  id="input-nome" @update:valueInput="(value: any) => updateInput('input-nome', value)" />
                <inputText label="Idade*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-idade`]" id="input-idade" />


              </v-row>

              <v-row class="row-info-basicas">
                <inputText label="Peso*" classe="input-locador" type="text" required suffix="gramas"
                  v-model:valueInput="textInputs[`input-peso`]" :id="`input-peso`" @input="validateDecimalInput($event)"
                  :maxLength="0" />

                <inputText label="Raça*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-raca`]" id="input-raca" />

                <inputText label="Pelagem*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-pelagem`]" id="input-pelagem" />

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
              <v-radio-group v-model="sexo" :error-messages="sexoError" inline>
                <v-radio label="Masculino" value="sexoM" />
                <v-radio label="Feminino" value="sexoF" />
              </v-radio-group>
            </div>

            <!-- Castração -->
            <p>Castrado?*</p>
            <div class="row-info-radios">
              <v-radio-group v-model="castrado" :error-messages="castradoError" inline max-width="150px">
                <v-radio label="Sim" value="castradoS" />
                <v-radio label="Não" value="castradoN" />
              </v-radio-group>

              <v-text-field v-if="castrado === 'castradoS'" v-model="dataCastrado" :error-messages="dataCastradoError"
                label="Data*" type="date" max-width="150px" />
            </div>

            <!-- Vermifugação -->
            <p>Vermifugado?*</p>
            <div class="row-info-radios">
              <v-radio-group v-model="vermifugado" :error-messages="vermifugadoError" inline max-width="150px">
                <v-radio label="Sim" value="vermifugadoS" />
                <v-radio label="Não" value="vermifugadoN" />
              </v-radio-group>

              <v-text-field v-if="vermifugado === 'vermifugadoS'" v-model="dataVermifugado"
                :error-messages="dataVermifugadoError" label="Data*" type="date" max-width="150px" />
            </div>

            <!-- Vacinas -->
            <p>Vacinado?*</p>
            <div class="row-info-radios">
              <v-radio-group v-model="vacina" :error-messages="vacinaError" inline max-width="150px">
                <v-radio label="Sim" value="vacinadoS" />
                <v-radio label="Não" value="vacinadoN" />
              </v-radio-group>

              <TextArea v-if="vacina === 'vacinadoS'" :modelValue="textarea.vacinas"
                @update:modelValue="(value: any) => (textarea.vacinas = value)" :label="'Quais Vacinas?*'"
                class="wrap-textarea" :maxLength="300" placeholder="Detalhe quais vacinas foram tomadas...">
              </TextArea>
            </div>

            <!-- Observações -->

            <TextArea :modelValue="textarea.ObservacoesGerais"
              @update:modelValue="(value: any) => (textarea.ObservacoesGerais = value)" label="Observações/Detalhamento"
              class="wrap-textarea" :maxLength="300" placeholder="Detalhe algum ponto extra sobre o paciente...">
            </TextArea>
            <!-- Botões -->
            <div class="container-btn mt-5">
              <p class="msg-auxiliar">Campos Obrigatórios*</p>
            </div>

            <div class="container-btn mt-5">
              <v-btn class="btn-padrao" @click="resetFormCustom">
                Limpar Tudo
              </v-btn>
              <v-btn class="me-4 btn-padrao" type="submit">Salvar</v-btn>
            </div>
          </form>
        </v-tabs-window-item>
        <v-tabs-window-item value="tutor" class="pt-5">

          <v-form ref="form">

            <!-- Informações básicas -->
            <p>Informações Básicas</p>
            <v-col>
              <v-row class="row-info-basicas">

                <inputText label="Nome do Responsável*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-nome-tutor`]" id="input-nome-tutor" />

              </v-row>

              <v-row class="row-info-basicas">
                <inputText label="CPF*" type="text" v-model:valueInput="textInputs['input-cpf']" id="input-cpf"
                  @update:valueInput="(value: any) => {
                    const formatado = formatCpf(value);
                    updateInput('input-cpf', formatado);
                  }" :maxLength="14" required />
                <inputText label="RG*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-rg`]" id="input-rg" />

              </v-row>
            </v-col>

            <!-- Contatos -->
            <p>Informações para Contato</p>
            <v-col>
              <v-row class="row-info-basicas" v-for="(item, index) in phones" :key="index">
                <inputText label="Telefone*" classe="input-locador" type="text" required @input="onPhoneInput(index, $event)"
                  v-model:valueInput="item.number" :id="'input-telefone-' + index" :maxLength="0"/>

                <!-- Botões de adicionar / remover só no modo edição -->
             
                <v-btn icon class="btn-padrao btn-plus-phone" @click="removePhone(index)" v-if="phones.length > 1">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                   <v-btn icon class="btn-padrao btn-plus-phone" @click="addPhone" v-if="index === phones.length - 1">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-row>

              <v-row class="row-info-basicas">
                <inputText label="E-mail*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-email`]" id="input-email" />
              </v-row>
            </v-col>


            <!-- Endereço -->
            <p>Informações de Endereço</p>
            <v-col>
              <v-row class="row-info-basicas">
                <inputText label="Estado*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-estado`]" id="input-estado" />

                <inputText label="Cidade*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-cidade`]" id="input-cidade" />

              </v-row>

              <v-row class="row-info-basicas">
                <inputText label="Bairro*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-bairro`]" id="input-bairro" />

                <inputText label="Rua*" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-rua`]" id="input-rua" />

              </v-row>

              <v-row class="row-info-basicas">
                <inputText label="Número" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-numero-endereco`]" id="input-numero-endereco" />

                <inputText label="Complemento" classe="input-locador" type="text" required
                  v-model:valueInput="textInputs[`input-complemento`]" id="input-complemento" />

              </v-row>
            </v-col>

            <!-- <v-row>
                <v-col cols="12" sm="12">
                  <multipleCombobox
                  class="container-combobox-padrao combo-box-tipo-concessionaria"
                  :v-model="combos.tipoConcessionarias"
                  :items="tiposConcessionariasItems"
                  label="Tipo de concessionária* "
                  placeholder="Tipo de concessionaria"
                  variant="outlined"
                  integer
                  id="tipo-estrutura"
                  :isRequired="true"
                  :extraItems="tiposConcessionariasItemsResponse"
                  :isMultipleSelect="false"
                  required
                >
                </multipleCombobox>
                </v-col>
              </v-row> -->
            <v-col cols="12" sm="12">
              <v-btn text="Cadastrar" id="btn-salvar-concessionaria"></v-btn>
            </v-col>
          </v-form>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>

  <!-- <ModalCadastrarTutor :visible="showScheduleForm" @close="showScheduleForm = false" /> -->
</template>

<script setup lang="ts">

import { ref, nextTick   } from 'vue'
import { useField, useForm } from 'vee-validate'
import { formatCpf } from '@/utils/formaUtils'

// COMPONENTES
import inputText from '@/components/inputText.vue'
import TextArea from '@/components/textArea.vue'
// import ModalCadastrarTutor from '../Tutor/modalCadastrarTutor.vue'

defineOptions({ name: 'PacienteCadastro' })
const tab = ref('paciente')

const showScheduleForm = ref(false);

const { handleSubmit, handleReset } = useForm({
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

function resetFormCustom() {
  handleReset();
  textarea.value.ObservacoesGerais = '';
}

// Paciente
const { value: especie, errorMessage: especieError } = useField<string>('especie')
const { value: origem, errorMessage: origemError } = useField<string>('origem')
const { value: porte, errorMessage: porteError } = useField<string>('porte')
const { value: sexo, errorMessage: sexoError } = useField<string>('sexo')
const { value: castrado, errorMessage: castradoError } = useField<string>('castrado')
const { value: dataCastrado, errorMessage: dataCastradoError } = useField<string>('dataCastrado')
const { value: vermifugado, errorMessage: vermifugadoError } = useField<string>('vermifugado')
const { value: dataVermifugado, errorMessage: dataVermifugadoError } = useField<string>('dataVermifugado')
const { value: vacina, errorMessage: vacinaError } = useField<string>('vacina')

// Telefones
const phones = ref<{ number: string }[]>([{ number: '' }])

function addPhone() {
  phones.value.push({ number: '' })
}

function removePhone(index: number) {
  phones.value.splice(index, 1)
}

// Formata e limita o número em tempo real
function formatPhoneNumberRaw(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  } else {
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
  }
}

function onPhoneInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const oldValue = input.value
  const onlyNumbers = oldValue.replace(/\D/g, '').slice(0, 11)
  const newValue = formatPhoneNumberRaw(onlyNumbers)

  const cursorPos = input.selectionStart || 0

  // Atualiza o v-model sem travar o backspace
  phones.value[index].number = newValue

  // Ajusta cursor de forma inteligente
  nextTick(() => {
    let newCursor = cursorPos

    // Se usuário está apagando e o cursor está antes do final, mantém cursor
    if (newValue.length < oldValue.length) {
      newCursor = cursorPos
    } else {
      // Se adicionando, ajusta para a máscara
      const diff = newValue.length - oldValue.length
      newCursor = cursorPos + diff
    }

    if (newCursor < 0) newCursor = 0
    if (newCursor > newValue.length) newCursor = newValue.length

    input.setSelectionRange(newCursor, newCursor)
  })
}

// Validação para números com até 2 casas decimais
const validateDecimalInput = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;

  // 1. Só dígitos
  let digits = inputElement.value.replace(/\D/g, '');

  // 2. Remove zeros à esquerda,
  //    mas garante pelo menos “0” para não ficar string vazia
  digits = digits.replace(/^0+/, '');
  if (digits === '') digits = '0';

  // 3. Limita a 8 dígitos (6 + 2)
  if (digits.length > 8) digits = digits.slice(0, 8);

  // 4. Monta o valor com vírgula
  let formatted: string;
  if (digits.length <= 2) {
    // até 2 dígitos → centavos
    formatted = '0,' + digits.padStart(2, '0');
  } else {
    const before = digits.slice(0, -2).slice(-6); // máximo 6
    const after = digits.slice(-2);
    formatted = `${before},${after}`;
  }

  // 5. Atualiza input / v‑model só se mudou
  if (inputElement.value !== formatted) {
    inputElement.value = formatted;
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));

    const id = inputElement.id;
    if (textInputs.value && id) textInputs.value[id] = formatted;
  }
};
const textInputs = ref<Record<string, string>>({});
const updateInput = (id: string, newValue: string) => {
  textInputs.value[id] = newValue;
};

const textarea = ref({ ObservacoesGerais: '', vacinas: '' })

const submit = handleSubmit(values => {
  alert(JSON.stringify({ ...values, phones: phones.value }, null, 2))
})

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
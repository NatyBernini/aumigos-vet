<template>
  <v-container fluid>
    <v-textarea
      :model-value="modelValue"
      :rules="computedRules"
      :label="label"
      variant="outlined"
      :maxlength="maxLength"
      :class="textClass"
      :disabled="disabled"
      @focus="onFocus"
      @blur="handleBlur"
      @input="onInput"
      :placeholder="placeholder"
    ></v-textarea>

    <span v-if="showCounter && !isLimitExceeded" :class="counterClass">
      Caracteres {{ charCount }} / {{ maxLength }}
    </span>

    <span v-if="showMaxText && !isLimitExceeded" :class="maxTextClass"> Limite de {{ maxLength }} caracteres </span>

    <span v-if="isLimitExceeded" :class="maxTextClass">
      Limite de caracteres excedido! {{ maxLength }}
      <span class="total-caracteres-text-area-{{ maxLength }}">/{{ maxLength }}</span>
    </span>

    <span v-if="isRequired && showRequiredMessage" class="text-red"> Atenção, campo obrigatório! </span>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'TextareaDiagnostico200', // 🔹 Nome mantido
  props: {
    modelValue: {
      type: [String, Object],
      required: true
    },
    label: {
      type: String,
      default: 'Observações/Detalhamento'
    },
    placeholder: {
      type: String
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 200
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      rules: [(v: string | undefined) => !v || (typeof v === 'string' && v.length <= this.maxLength)],
      showMaxText: true,
      showCounter: false,
      isLimitExceeded: false,
      charCount: 0,
      showRequiredMessage: false,
      isFocused: false
    };
  },
  computed: {
    textClass() {
      this.isLimitExceeded = this.charCount >= this.maxLength;
      return this.isLimitExceeded || this.isInvalid ? 'error-border' : '';
    },
    counterClass() {
      return this.isLimitExceeded ? 'text-red' : 'textInfo';
    },
    maxTextClass() {
      return this.isLimitExceeded ? 'text-red' : 'textInfo';
    },
    computedRules() {
      const baseRules = [...this.rules];
      if (this.isRequired) {
        baseRules.push((v: string | undefined) => !!v || false);
      }
      return baseRules;
    },
    isInvalid() {
      return this.isRequired && !this.modelValue;
    }
  },
  methods: {
    onFocus() {
      this.showMaxText = false;
      this.showCounter = true;
      this.isFocused = true;
      this.showRequiredMessage = false;
    },
    handleBlur(event: FocusEvent) {
      const target = event.target as HTMLTextAreaElement;
      this.$emit('update:modelValue', target.value);

      if (this.isRequired && !target.value) {
        this.showRequiredMessage = true;
      }

      this.onBlur();
    },
    onBlur() {
      this.showMaxText = true;
      this.showCounter = false;
    },
    onInput(value: any) {
      let stringValue = typeof value === 'object' ? value.target?.value || '' : value;
      this.charCount = stringValue.length;
      this.$emit('update:value', stringValue);
    }
  }
};
</script>
<style lang="scss">
.wrap-textarea {
  padding: 0;
  .v-field__input {
    height: 80px !important;
    color: var(--cinza-escuro, #797979);
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 142.857% */
  }

  .textInfo {
    display: flex;
    align-items: center;
    justify-content: end;
    font-size: 0.7rem;
    width: 100%;
    max-width: 500px;
    text-align: left;
    opacity: 0.8;
    color: var(--placeholder-campo, #b0b0b0);
    font-family: Inter;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
  }

  .v-messages,
  .v-input__details {
    display: none !important;
  }

  .max-text {
    font-size: 14px;
    color: grey;
    margin-top: 8px;
  }

  .text-red {
    display: flex;
    align-items: center;
    justify-content: end;
    width: 100%;
    max-width: 500px;
    text-align: left;
    border-color: rgb(var(--v-theme-error)) !important;
    opacity: 1;

    color: var(--error, #d14a4a);
    font-family: Inter;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
  }

  .total-caracteres-text-area-200 {
    color: var(--placeholder-campo, #b0b0b0);
    font-family: Inter;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
  }
  .v-input {
    width: 100%;
    max-width: 500px;
    .v-label {
      top: 10px;
      color: var(--placeholder-campo, #b0b0b0);
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      opacity: 1;
      line-height: 14px;
      margin-inline-start: 12px;
    }
    .v-field__outline {
      border-radius: 10px;
      color: rgb(var(--v-theme-inputGray));
      --v-field-border-width: 1px !important;
    }
    .v-field.v-field--active .v-label.v-field-label--floating {
      color: var(--cinza-escuro, #797979);
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 14px;
      margin-left: 4px;
    }
  }

  .v-field--dirty .v-field__outline {
    color: #797979;
    --v-field-border-opacity: 1;
  }
  .v-field--variant-outlined.v-field--focused .v-field__outline {
    --v-field-border-width: 1px !important;
  }
  .v-input input::placeholder {
    font-size: 0.9rem;
  }

  /** Estilização do Scroll da Lista */
  .v-field__input::-webkit-scrollbar {
    width: 4px; /* Largura da barra de rolagem */
  }

  .v-field__input::-webkit-scrollbar-thumb {
    background-color: rgb(var(--v-theme-dvColor)); /* Cor da "bolinha" de rolagem */
    border-radius: 10px; /* Deixa a borda arredondada */
  }

  .v-field__input::-webkit-scrollbar-track {
    // background-color: rgb(var(--v-theme-gray400)); /* Cor do fundo da área de rolagem */
    border-radius: 4px; /* Bordas arredondadas para o track */
  }

  .error-border {
    .v-field__outline {
      color: rgb(var(--v-theme-error)) !important;
    }
  }
}
</style>

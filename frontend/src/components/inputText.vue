<template>
  <div class="input-text-container mb-4">
    <v-text-field :label="label" :type="type" :model-value="valueInput" class="inputLocator"
      @update:model-value="handleInput" :class="{
        'filled-class': valueInput,
        'error-field': showError
      }" :id="id" :suffix="suffix" :append-inner-icon="appendInnerIcon"
      @click:append-inner="$emit('click:append-inner')" validate-on="submit" variant="outlined" autocomplete="off"
      :maxlength="maxLength !== 0 ? maxLength : undefined" :rules="validationRules" :disabled="disabled"
      :error="showError" :error-messages="errorMessage" @blur="validateField" />
    <div v-if="maxLength && maxLength !== 0" class="char-counter">
      Caracteres {{ valueInput?.length || 0 }}/{{ maxLength }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'InputText',
  props: {
    label: {
      type: String,
      required: false
    },
    valueInput: {
      type: String,
      required: false
    },
    classe: {
      type: String
    },
    id: {
      type: String,
      required: false
    },
    suffix: {
      type: String
    },
    maxLength: {
      type: Number,
      required: false,
      default: 100
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    appendInnerIcon: {
      type: String,
      default: ''
    },

    required: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    showValidationError: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasBlurred: false,
      forceShowError: false
    };
  },
  computed: {
    isFieldRequired() {
      return this.required || this.isRequired;
    },
    showError() {
      if (!this.isFieldRequired) return false;
      return (
        (this.hasBlurred || this.showValidationError || this.forceShowError) && !String(this.valueInput || '').trim()
      );
    },
    errorMessage() {
      if (this.showError) {
        return 'Campo obrigatório';
      }
      return '';
    },
    validationRules() {
      const rules = [];
      if (this.isFieldRequired) {
        rules.push((v: any) => (v !== null && v !== undefined && String(v).trim().length > 0) || 'Campo obrigatório');
      }
      if (this.type === 'email') {
        rules.push((v: any) =>
          !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido'
        );
      }
      if (this.maxLength) {
        rules.push((v: any) => !v || v.length <= this.maxLength || `Máximo de ${this.maxLength} caracteres`);
      }
      return rules;
    }

  },
  watch: {
    valueInput() {
      if (this.valueInput && String(this.valueInput).trim() !== '') {
        this.forceShowError = false;
      }
    },
    showValidationError(newVal) {
      const isInputEmpty = !String(this.valueInput || '').trim();

      if (newVal && this.isFieldRequired && isInputEmpty) {
        this.forceShowError = true;
      }
    }
  },
  methods: {
    handleInput(value: any) {
      if (this.maxLength && value && value.length > this.maxLength) {
        value = value.substring(0, this.maxLength);
      }
      this.$emit('update:valueInput', value);
    },
    validateField() {
      this.hasBlurred = true;
    },
    validate() {
      if (this.isFieldRequired && !String(this.valueInput || '').trim()) {
        this.forceShowError = true;
        return false;
      }
      this.forceShowError = false;
      return true;
    },
    clearValidation() {
      this.hasBlurred = false;
      this.forceShowError = false;
    }
  }
};
</script>

<style lang="scss">
.inputLocator {
  width: 100%;
  min-width: 250px;
  max-width: 540px;
  border: none !important;
  border-radius: 10px !important;

  .v-input__details {
    position: absolute;
    transform: translateY(35px);
  }

  &.filled-class .v-input__control .v-field__outline {
    color: #797979 !important;
    --v-field-border-opacity: 1;
  }

  .v-input__control {
    height: 40px !important;
    border-radius: 10px !important;
    border-color: rgb(207, 207, 207) !important;
    transition: border-color 0.3s ease;

    .v-label {
      color: rgb(var(--v-theme-placeholderCampo));
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      opacity: 1;
    }

    .v-field--variant-outlined {
      border-radius: 10px !important;
      color: rgb(var(--v-theme-placeholderCampo));
      opacity: 1;
      --v-field-border-opacity: 1;

      .v-field__outline__start {
        flex: 0 0 8px;
      }
    }

    .v-input.v-field .v-field--active {
      opacity: 1;
    }

    &:focus-within {
      border-radius: 10px !important;
      box-shadow: none !important;
      border: none !important;
    }
  }

  .v-field__input {
    padding: 8px 12px;
    min-height: auto;
    height: 100% !important;
    color: #6f6f6f !important;
    border-radius: 10px !important;
    font-family: Inter;
    font-size: 14px !important;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    opacity: 1;
  }

  .v-field--variant-outlined.v-field--focused .v-field__outline {
    --v-field-border-width: 1px;
    color: var(--cinza-escuro, #797979);
  }

  .v-field--variant-outlined .v-label.v-field-label--floating {
    color: var(--cinza-texto, #797979) !important;
    --v-field-border-opacity: 1;
    background-color: rgb(var(--v-theme-white)) !important;
    font-family: Inter;
    font-size: 12px !important;
    font-style: normal;
    font-weight: 500 !important;
    line-height: 16px;
    opacity: 1;
  }
}

.v-text-field__suffix {
  min-height: auto;
  padding-top: 13px;
  padding-bottom: 0;
  color: rgb(var(--v-theme-placeholderCampo));
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
}

.input-text-container {
  display: flex;
  flex-direction: column;
  min-width: 160px;
  max-width: 540px;
}

.char-counter {
  font-size: 12px;
  color: rgb(var(--v-theme-placeholderCampo));
  bottom: 4px;
  right: 10px;
  pointer-events: none;
  margin-top: 4px;
  align-self: flex-end;
}

.error-field :deep(.v-field--error) {
  border-color: #8f2c3d !important;
}

.error-field :deep(.v-field__outline) {
  border-color: #8f2c3d !important;
}

.error-field :deep(.v-field--error .v-field__outline) {
  border-color: #8f2c3d !important;
}

.error-field :deep(.v-input--error .v-field__outline) {
  color: #8f2c3d !important;
}
</style>

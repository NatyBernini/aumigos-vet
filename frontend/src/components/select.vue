<template>
  <v-tooltip
    :disabled="isTooltipDisabled"
    :text="formattedTooltipText"
    open-delay="200"
    close-delay="0"
    max-width="300"
    location="bottom"
    class="custom-tooltip"
  >
    <template v-slot:activator="{ props }">
      <v-select
        v-model="internalValue"
        :items="localItems"
        :label="label"
        :placeholder="placeholder"
        :multiple="isMultipleSelect"
        v-bind="{ ...$attrs, ...props }"
        @update:modelValue="onInput"
        density="compact"
        dense
        rounded="lg"
        :menu-icon="
          isCustomCombobox
            ? isFocused
              ? 'mdi-magnify'
              : internalValue?.length
              ? ''
              : 'mdi-chevron-down'
            : 'mdi-chevron-down'
        "
        :class="{
          'filled-combobox': isFilled,
          'custom-combobox': isCustomCombobox,
          'disabled-combobox': !isMultipleSelect
        }"
        :menu-props="{ id: 'list-combo-box-' + id, closeOnContentClick: false }"
        autocomplete="off"
        :isRequired="isRequired"
        :rules="isRequired ? [requiredRule] : []"
        :error-messages="errorMessages"
        :data-complemento="idEncontrado"
        @focus="handleFocus"
        @blur="handleBlur"
      ></v-select>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
import type { PropType } from 'vue';

export default {
  name: 'SelectNoEditable',
  props: {
    modelValue: {
      type: [Array, String],
      default: () => []
    },
    extraItems: {
      type: Array as any,
      default: () => []
    },
    items: {
      type: Array as any,
      required: true
    },
    label: String,
    placeholder: String,
    customClass: {
      type: String,
      default: ''
    },
    tooltip: String,
    isCustomCombobox: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    },
    isMultipleSelect: {
      type: Boolean,
      default: true
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    dataComplemento: {
      type: Array as PropType<number[] | null>,
      default: null
    }
  },
  data() {
    return {
      idEncontrado: null as number[] | null,
      internalValue: this.modelValue,
      localItems: [...this.items],
      isFocused: false,
      isTooltipDisabled: false,
      errorMessages: [] as string[],
      requiredRule: (value: string | unknown[]) => {
        if (Array.isArray(value) && value.length === 0) return 'Atenção, campo obrigatório!';
        if (typeof value === 'string' && !value) return 'Atenção, campo obrigatório!';
        return true;
      }
    };
  },
  mounted() {
    if (this.dataComplemento) {
      if (Array.isArray(this.dataComplemento) && this.dataComplemento.every((el) => typeof el === 'number')) {
        this.idEncontrado = this.dataComplemento;
      } else {
        console.warn('dataComplemento não é um array de números válido');
        this.idEncontrado = null;
      }
    }
  },
  methods: {
    onInput(val: any) {
      this.$emit('update:modelValue', val);

      if (this.isRequired) {
        const isValid = this.requiredRule(this.internalValue);
        this.errorMessages = isValid === true ? [] : [isValid as string];
      }

      if (this.isMultipleSelect) {
        const ids: number[] = [];
        if (Array.isArray(this.internalValue)) {
          this.internalValue.forEach((descricao: any) => {
            const item = this.extraItems.find((i: { descricao: any }) => i.descricao === descricao);
            if (item) ids.push(item.id);
          });
        }
        this.idEncontrado = ids.length > 0 ? ids : null;
      } else {
        const item = this.extraItems.find((i: { descricao: any }) => i.descricao === this.internalValue);
        this.idEncontrado = item ? item.id : null;
      }
    },
    handleFocus() {
      this.isFocused = true;
      this.isTooltipDisabled = true;

      if (!this.isMultipleSelect) {
        this.localItems = [...this.items]; // força lista completa
      }
    },
    handleBlur() {
      this.isFocused = false;
      if (this.internalValue && this.internalValue.length > 0) {
        this.isTooltipDisabled = false;
      }
    },
    handleKeydown(event: KeyboardEvent) {
      if (!this.isMultipleSelect) event.preventDefault();
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        this.internalValue = val;
        this.isTooltipDisabled = Array.isArray(val) ? val.length === 0 : !val;

        if (this.isMultipleSelect && Array.isArray(val)) {
          const ids: number[] = [];
          val.forEach((descricao: any) => {
            const item = this.extraItems.find((i: any) => i.descricao === descricao);
            if (item) ids.push(item.id);
          });
          this.idEncontrado = ids.length ? ids : null;
        } else {
          const item = this.extraItems.find((i: any) => i.descricao === val);
          this.idEncontrado = item ? item.id : null;
        }
      }
    },
    items(newItems) {
      this.localItems = [...newItems];
    },
    internalValue(newVal) {
      this.isTooltipDisabled = Array.isArray(newVal) ? newVal.length === 0 : !newVal;
    }
  },
  computed: {
    isFilled() {
      return this.internalValue && this.internalValue.length > 0;
    },
    formattedTooltipText(): string {
      return Array.isArray(this.internalValue) ? this.internalValue.join(', ') : (this.internalValue as string);
    }
  }
};
</script>

<style lang="scss">

/* Tooltip */
.v-tooltip > .v-overlay__content {
  background-color: #f1f1f1 !important;
  color: #6f6f6f !important;
  border-radius: 8px !important;
  font-family:  'Poppins';
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.24px;
  transition: none !important;
}

/* Cursor invisível para inputs desabilitados */
*:not(input):not(textarea),
.disabled-combobox input {
  caret-color: transparent;
}

/* Cursor visível em inputs normais */
input,
textarea {
  caret-color: #000;
}

/* Ícones em comboboxes */
.combo-customizavel i.mdi-close,
.combo-customizavel i.mdi-magnify {
  color: #ffc38b !important;
  transition: none;
  font-size: 16px;
}

/* Combobox genérico */
.combo-customizavel .v-field,
.container-combobox-filtros .v-field,
.container-combobox-padrao .v-field {
  min-width: 150px!important;
  color: #6f6f6f !important;
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  opacity: 1 !important;
  height: 40px !important;
  align-items: center;
  transition: none;
  border-radius: 12px !important;
  border: 1px solid rgb(var(--v-theme-bgComponent));
  padding-left: 15px !important;

  .v-label.v-field-label {
    margin-left: 0px;
    color: #6f6f6f;
    font-family:  'Poppins';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 14px;
    opacity: 1;
  }
  .v-label.v-field-label.v-field-label--floating{
    margin-left: 5px;
  }

  ::placeholder {
    opacity: 1 !important;
    color: #ababab !important;
    font-family:  'Poppins';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 14px;
  }

  &:focus-within {
    background: rgb(var(--v-theme-white)) !important;
    box-shadow: none;
  }

  .v-field__field {
    padding-right: 6px !important;
  }

  .v-field__input {
    flex: 1 0;
    grid-area: field;
    position: relative;
    align-items: center;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-wrap: nowrap;
    max-width: 100%;
    width: 100%;
    justify-content: flex-start;
    padding-left: 0px !important;

    input {
      flex: auto !important;
      min-width: 0px !important;
    }
  }
}

// .v-field--variant-outlined.v-field--focused .v-label.v-field-label--floating {
//     transform: translate(-8px,-17px)!important;
//   }
// .v-field--variant-outlined.v-field--focused .v-field__outline__notch{
//   border-top: 1px solid #ffc38b!important;
// }
/* Clearable icons */
.v-field__clearable {
  margin: 0 !important;
  transition: none !important;
  color: #ffc38b;

  i {
    font-size: 16px !important;

    &::before {
      content: '\F0156' !important;
    }
  }
}

.v-field[aria-expanded='false'] .v-field__clearable { opacity: 1 !important; }
.v-field[aria-expanded='true'] .v-field__clearable { opacity: 0 !important; }

/* Campos obrigatórios */
.campo-obrigatorio .v-field:not(.v-field--focused) {
  background-color: rgb(var(--v-theme-bgComponent)) !important;
  border: 1px solid rgb(var(--v-theme-madatory)) !important;
  color: rgb(var(--v-theme-madatory)) !important;

  .v-label.v-field-label {
    color: rgb(var(--v-theme-madatory)) !important;
  }
}

/* Combobox containers */
.container-combobox-filtros,
.container-combobox-padrao {
  .v-input__details {
    position: absolute;
  }

  font-family:  'Poppins' !important;
  font-size: 14px;
  font-style: normal !important;
  font-weight: 500;
  line-height: 32px;

  &.combo-preenchido .v-field {
    background: rgb(var(--v-theme-white)) !important;
  }

  &.combo-preenchido .v-field__outline {
    color: #6f6f6f !important;
    --v-field-border-opacity: 1 !important;
    --v-field-border-width: 1px !important;
  }

  .v-field--variant-outlined:focus-within .v-field__outline {
    color: #ffc38b;
  }

  .v-field--variant-outlined .v-field__outline {
    color: #6f6f6f;
    border-color: transparent;
  }

  .v-field--variant-outlined.v-field--focused .v-field__outline {
    --v-field-border-width: 1px !important;
  }

  // .v-field--variant-outlined .v-label.v-field-label--floating {
  //   margin: 0 4px;
  //   margin-left: 4px !important;
  //   color: var(--vermelho-cereja, #8f2c3d) !important;
  //   font-size: 12px !important;
  // }

  .v-field--rounded.v-field--variant-outlined .v-field__outline__start,
  [class^='rounded-'].v-field--variant-outlined .v-field__outline__start,
  [class*=' rounded-'].v-field--variant-outlined .v-field__outline__start {
    flex-basis: calc(var(--v-input-control-height) / 2 + -10.5px) !important;
  }
}

/* Listagem combobox */
.v-menu:not(.menu-usuario) > .v-overlay__content {
  padding-bottom: 14px;
  padding-top: 10px;
  padding-right: 4px;
  border-radius: 8px;
  border: 1px solid rgba(143, 44, 61, 0.19);
  background: #fff;
  box-shadow: 1px 0px 9px 0px rgba(172, 172, 172, 0.25);
  max-height: 216px;
  max-width: 100px !important;

  .v-list {
    box-shadow: none !important;
    padding: 0;
  }

  /* Scroll */
  .v-list::-webkit-scrollbar { width: 4px; }
  .v-list::-webkit-scrollbar-thumb {
    background-color: rgb(var(--v-theme-dvColor));
    border-radius: 10px;
  }
  .v-list::-webkit-scrollbar-track {
    background-color: #6f6f6f;
    border-radius: 4px;
  }

  .v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
    padding: 0 !important;
    border-radius: 8px !important;
    height: 32px;
    margin: 11px;
    margin-top: 0;
    align-content: center;
    min-height: inherit;
    transition: none;
  }

  .v-selection-control__input > .v-icon {
    font-size: 14px !important;
    color: rgb(var(--v-theme-ftText));
    height: 2px !important;
    width: 22px !important;
    border-radius: 50%;
    opacity: 1 !important;
  }

  .v-selection-control__input:hover .v-icon {
    background: rgb(var(--v-theme-cherryCircle));
  }

  .v-list-item__content .v-list-item-title .v-select__mask {
    background: rgb(var(--v-theme-cherryCircle)) !important;
    border-radius: 8px;
  }

  .v-list-item__content .v-list-item-title {
    color: #6f6f6f;
    font-family:  'Poppins';
    font-size: 14px;
    font-weight: 500;
    line-height: 32px;
    position: relative;
    z-index: 10;
  }

  .v-list-item--variant-text .v-list-item__overlay {
    background: transparent !important;
  }

  .v-list-item:hover {
    opacity: 1 !important;
    background: rgb(var(--v-theme-cherryHover)) !important;
    color: #fff !important;
  }

  .v-list-item--active > .v-list-item__overlay,
  .v-list-item[aria-haspopup='menu'][aria-expanded='true'] > .v-list-item__overlay:hover {
    background: transparent !important;
    opacity: 1 !important;
  }

  .v-selection-control__wrapper .v-selection-control__input > .v-icon.mdi-checkbox-marked {
    color: #ffc38b !important;
  }
}

/* Combobox específicos (tipo-construcao / tipo-estrutura) */
.v-menu#list-combo-box-tipo-construcao,
.v-menu#list-combo-box-tipo-estrutura {
  .v-overlay__content {
    padding-bottom: 0;
    padding-top: 0;
  }

  .v-list-item:hover {
    opacity: 1 !important;
    background: #f2f2f2 !important;
    color: #6f6f6f !important;
  }

  .v-list-item__content .v-list-item-title {
    padding-left: 10px;
    line-height: 22px;
  }

  .v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
    margin: 6px;
    padding: 0;
  }
}

/* Campos com erro */
.v-field--error:not(.v-field--disabled) .v-field__outline,
.v-field--error:not(.v-field--disabled) .v-label.v-field-label,
.v-field--error:not(.v-field--disabled) .v-field__append-inner > .v-icon {
  color: #d14a4a !important;
  font-weight: 400;
}

.v-messages__message {
  color: var(--error, #d14a4a);
  font-family:  'Poppins';
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
}

</style>

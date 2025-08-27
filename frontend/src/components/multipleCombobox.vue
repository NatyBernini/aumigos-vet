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
      <v-combobox
        v-model="internalValue"
        :items="localItems"
        :label="label"
        :placeholder="placeholder"
        :editable="isMultipleSelect"
        @keydown="handleKeydown"
        v-bind="{ ...$attrs, ...props }"
        @update:modelValue="onInput"
        @focus="(isFocused = true), (isTooltipDisabled = true)"
        @blur="handlerBlur"
        density="compact"
        :id="id"
        dense
        rounded="lg"
        :menu-icon="
          isCustomCombobox
            ? isFocused
              ? 'mdi-magnify'
              : internalValue.length
              ? ''
              : 'mdi-chevron-down'
            : 'mdi-chevron-down'
        "
        :class="{
          'filled-combobox': isFilled,
          'custom-combobox': isCustomCombobox,
          'disabled-combobox': !isMultipleSelect
        }"
        :menu-props="{ id: 'list-combo-box-' + id }"
        autocomplete="off"
        :isRequired="isRequired"
        :rules="isRequired ? [requiredRule] : []"
        :error-messages="errorMessages"
        :data-complemento="idEncontrado"
      ></v-combobox>
    </template>
  </v-tooltip>
</template>
<script lang="ts">
import type { PropType } from 'vue';
export default {
  name: 'MultipleCombobox',
  props: {
    modelValue: {
      type: [Array, String],
      default: () => []
    },
    extraItems: {
      type: Array as any,
      default: () => [] // Lista extra como prop
    },
    items: {
      type: Array as any,
      required: true
    },
    label: {
      type: String,
      required: false
    },
    placeholder: {
      type: String,
      required: false
    },
    customClass: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String
    },
    // TRUE: estilo de multiselect / FALSE: estilo padrão de select
    isCustomCombobox: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    },
    // Multipla seleção TRUE: permite / FALSE: não permite
    isMultipleSelect: {
      type: Boolean,
      default: true
    },
    // OBRIGATORIEDADE DE SELEÇÃO TRUE: obrigatório / FALSE: não obrigatório
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
      isFocused: false, // Estado para controlar o foco
      isTooltipDisabled: false, // Estado para controlar a exibição do tooltip

      errorMessages: [] as string[],
      requiredRule: (value: string | unknown[]) => {
        if (Array.isArray(value) && value.length === 0) {
          return 'Atenção, campo obrigatório!';
        } else if (typeof value === 'string' && !value) {
          return 'Atenção, campo obrigatório!';
        }
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
      const newValue = Array.isArray(val) ? val[val.length - 1] : val;
      // const newValue = val[val.length - 1];
      this.$emit('update:modelValue', val);

      this.$nextTick(() => {
        if (this.isRequired) {
          const isValid = this.requiredRule(this.internalValue);
          if (isValid === true) {
            this.errorMessages = []; // Limpa as mensagens de erro
          } else {
            this.errorMessages = [isValid as string]; // Adiciona a mensagem de erro
          }
        }
      });

      if (this.isMultipleSelect) {
        const idsEncontrados: number[] = [];
        if (Array.isArray(this.internalValue)) {
          this.internalValue.forEach((descricao: any) => {
            // Encontra o item cujo 'descricao' corresponde ao valor da opção
            const item = this.extraItems.find((item: { descricao: any }) => item.descricao === descricao);

            // Se o item for encontrado, adiciona seu id ao array de IDs
            if (item) {
              idsEncontrados.push(item.id);
            }
          });
        }

        this.idEncontrado = idsEncontrados.length > 0 ? idsEncontrados : null;
      } else {
        // CASOS ONDE NÃO É MULTIPLESELECT
        const item = this.extraItems.find(
          (item: { descricao: string | any[] }) => item.descricao === this.internalValue
        );

        this.idEncontrado = item ? item.id : null;
      }
    },
    handlerBlur() {
      this.isFocused = false;
      if (this.internalValue && this.internalValue.length > 0) {
        this.isTooltipDisabled = false;
      }
    },
    handleKeydown(event: KeyboardEvent) {
      // Bloqueia a digitação
      if (!this.isMultipleSelect) {
        event.preventDefault();
      }
    }
  },

  watch: {
    modelValue: {
      immediate: true, // executa também na montagem inicial
      handler(val) {
        this.internalValue = val;

        if (Array.isArray(val)) {
          this.isTooltipDisabled = val.length === 0;
        } else {
          this.isTooltipDisabled = !val;
        }

        const idsEncontrados: any = [];

        if (this.isMultipleSelect && Array.isArray(val)) {
          val.forEach((descricao) => {
            const item = this.extraItems.find((item: any) => item.descricao === descricao);
            if (item) {
              idsEncontrados.push(item.id);
            }
          });

          this.idEncontrado = idsEncontrados.length > 0 ? idsEncontrados : null;
        } else {
          const item = this.extraItems.find((item: any) => item.descricao === val);
          this.idEncontrado = item ? item.id : null;
        }
      }
    },

    items(newItems) {
      this.localItems = [...newItems];
    },

    internalValue(newValue) {
      if (Array.isArray(newValue)) {
        this.isTooltipDisabled = newValue.length === 0;
      } else {
        this.isTooltipDisabled = !newValue;
      }
    }
  },

  computed: {
    isFilled() {
      return this.internalValue && this.internalValue.length > 0;
    },
    formattedTooltipText(): string {
      if (Array.isArray(this.internalValue)) {
        // Concatena os valores do array em uma string

        return this.internalValue.join(', ');
      }

      return this.internalValue as string;

      // if (Array.isArray(this.internalValue)) {
      //   // Concatena os valores do array em uma string
      //   return this.internalValue.join(', ');
      // }
    }
  }
};
</script>

<style lang="scss">

/* Tooltip */
.v-tooltip > .v-overlay__content {
  background-color: rgb(var(--v-theme-grayBgTooltip)) !important;
  color: rgb(var(--v-theme-grayTextTooltip)) !important;
  border-radius: 8px !important;
  font-family: Inter;
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
.custom-combobox i.mdi-close,
.custom-combobox i.mdi-magnify {
  color: rgb(var(--v-theme-primary)) !important;
  transition: none;
  font-size: 16px;
}

/* Combobox genérico */
.custom-combobox .v-field,
.container-combobox-filtros .v-field,
.container-combobox-padrao .v-field {
  color: rgb(var(--v-theme-ftText)) !important;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 14px;
  opacity: 1 !important;
  height: 32px !important;
  align-items: center;
  transition: none;
  border-radius: 10px !important;
  border: 1px solid rgb(var(--v-theme-bgComponent));
  padding-left: 9px !important;

  .v-label.v-field-label {
    margin-left: 0px;
    color: #6f6f6f;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 14px;
    opacity: 1;
  }

  ::placeholder {
    opacity: 1 !important;
    color: #ababab !important;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 14px;
  }

  &:hover {
    background: rgb(var(--v-theme-gray600)) !important;
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

/* Clearable icons */
.v-field__clearable {
  margin: 0 !important;
  transition: none !important;
  color: rgb(var(--v-theme-primary));

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

  font-family: Inter !important;
  font-size: 14px;
  font-style: normal !important;
  font-weight: 500;
  line-height: 32px;

  &.filled-combobox .v-field {
    background: rgb(var(--v-theme-white)) !important;
  }

  &.filled-combobox .v-field__outline {
    color: rgb(var(--v-theme-primary)) !important;
    --v-field-border-opacity: 1 !important;
    --v-field-border-width: 1px !important;
  }

  .v-field--variant-outlined:focus-within .v-field__outline {
    color: rgb(var(--v-theme-primary));
  }

  .v-field--variant-outlined .v-field__outline {
    color: rgb(var(--v-theme-bgComponent));
    border-color: transparent;
  }

  .v-field--variant-outlined.v-field--focused .v-field__outline {
    --v-field-border-width: 1px !important;
  }

  .v-field--variant-outlined .v-label.v-field-label--floating {
    margin: 0 4px;
    margin-left: 4px !important;
    color: var(--vermelho-cereja, #8f2c3d) !important;
    font-size: 12px !important;
  }

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
    background-color: rgb(var(--v-theme-gray400));
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
    height: 22px !important;
    width: 22px !important;
    border-radius: 50%;
    opacity: 1 !important;
  }

  .v-selection-control__input:hover .v-icon {
    background: rgb(var(--v-theme-cherryCircle));
  }

  .v-list-item__content .v-list-item-title .v-combobox__mask {
    background: rgb(var(--v-theme-cherryCircle)) !important;
    border-radius: 8px;
  }

  .v-list-item__content .v-list-item-title {
    color: #6f6f6f;
    font-family: Inter;
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
    color: rgb(var(--v-theme-primary)) !important;
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
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
}

</style>

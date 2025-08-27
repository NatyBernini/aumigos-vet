<template>
  <v-container fluid>
    <v-textarea
      :model-value="modelValue"
      :rules="rules"
      :label="label"
      variant="outlined"
      :maxlength="300"
      :class="textClass"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      :placeholder="placeholder"
    ></v-textarea>
    <span v-if="showCounter" :class="counterClass">Caracteres {{ charCount }} / 300</span>
    <span v-if="showMaxText" :class="maxTextClass">Limite de 300 caracteres</span>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'TextArea',
  props: {
    modelValue: {
      type: [String, Object],
      required: true
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    }
  },
  data() {
    return {
      // rules: [(v) => typeof v === 'string' && v.length <= 299],
      rules: [(v: string | undefined) => !v || (typeof v === 'string' && v.length <= 299)],
      showMaxText: true,
      showCounter: false,
      charCount: 0 // Inicializa com a contagem de caracteres
    };
  },
  computed: {
    textClass() {
      return this.charCount >= 300 ? 'error-border' : '';
    },
    counterClass() {
      return this.charCount >= 300 ? 'text-red' : 'textInfo';
    },
    maxTextClass() {
      return this.charCount >= 300 ? 'text-red' : 'textInfo';
    }
  },
  methods: {
    onFocus() {
      this.showMaxText = false;
      this.showCounter = true;
    },
    onBlur() {
      this.showMaxText = true;
      this.showCounter = false;
    },
    onInput(value: any) {
      let stringValue = '';
      if (typeof value === 'object') {
        stringValue = value.target ? value.target.value : '';
      } else if (typeof value === 'string') {
        stringValue = value;
      }
      this.charCount = stringValue.length;
      this.$emit('update:value', stringValue);
    }
  }
};
</script>
<style scoped lang="scss">
.textInfo {
  display: flex;
  align-items: center;
  justify-content: end;
  font-size: 0.7rem;
  width: 565px;
  text-align: left;
  opacity: 0.8;
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
  font-size: 0.7rem;
  width: 565px;
  text-align: left;
  color: rgb(var(--v-theme-error)) !important;
  border-color: rgb(var(--v-theme-error)) !important;
  opacity: 0.8;
}
.v-input {
  width: 570px;
  .v-field__outline {
    border-radius: 10px;
    color: rgb(var(--v-theme-inputGray));
  }
}

.v-input input::placeholder {
  font-size: 0.9rem;
}
</style>
 
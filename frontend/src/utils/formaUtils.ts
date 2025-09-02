// src/utils/formatUtils.ts

// CPF
export function formatCpf(value: string): string {
  let digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length > 9) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else if (digits.length > 6) {
    return digits.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3')
  } else if (digits.length > 3) {
    return digits.replace(/(\d{3})(\d{0,3})/, '$1.$2')
  }
  return digits
}

// RG
export function formatRg(value: string): string {
  let digits = value.replace(/\D/g, '').slice(0, 9)

  if (digits.length > 8) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
  } else if (digits.length > 5) {
    return digits.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3')
  } else if (digits.length > 2) {
    return digits.replace(/(\d{2})(\d{0,3})/, '$1.$2')
  }

  return digits
}

// Telefone
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits.length <= 10
    ? digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    : digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

/**
 * FUNÇÃO RESPONSÁVEL POR CONVERTER A VÍRGULA
 * EM PONTO PARA O ENVIO DOS VALORES AO ENDPOINT
 * @param value
 */
export const replaceCommaWithDot = (value: any) => {
  if (value === '' || value == null) {
    return undefined;
  }
  return Number(value.toString().replace(',', '.')) || 0;
};

export function removeSpaces(value: string | null): string {
  return value ? value.replace(/\s+/g, '') : '';
}

/**
 * Extrai o número final de cada opção do checklist
 * @param checkboxList
 * @returns
 */
export const recuperaIdsListaCheckbox = (checkboxList: any) => {
  const lista = checkboxList
    .map((item: string) => {
      const match = item.match(/^(.+?)(\d+)$/); // Captura tudo antes do número + o número
      if (match) {
        return {
          descricao: match[1], // Parte textual antes do número
          id: Number(match[2]) // Parte numérica ao final
        };
      }
      return undefined;
    })
    .filter((item: any) => item !== undefined) as { descricao: string; id: number }[];

  return lista;
};

/**
 * Extrai o número do final de uma string.
 * Ex: "Opção12" -> 12
 * Retorna undefined se a string for nula ou não terminar com um número.
 */
export const extrairIdDaString = (valor: any) => {
  if (!valor) return undefined;

  const match = valor.match(/\d+$/);
  if (match) {
    return Number(match[0]);
  }

  return undefined;
};

export function capitalizeWords(text: string): string {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatarData(data: string | undefined): string {
  if (!data) return '';

  const partes = data.split('/');
  if (partes.length !== 3) return '';

  const [dia, mes, ano] = partes;
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

export function formatarDataCampo([ano, mes, dia]: [number, number, number]): string {
  const diaFormatado = dia.toString().padStart(2, '0');
  const mesFormatado = mes.toString().padStart(2, '0');
  return `${diaFormatado}/${mesFormatado}/${ano}`;
}

export const formatCep = (cep: string): string => {
  if (!cep) return '-'
  const cepFormatado = cep.replace(/\D/g, '') // Remove tudo que não for número
  return cepFormatado.replace(/^(\d{5})(\d{3})$/, '$1-$2') // Aplica o formato 00000-000
}

export const capitalizeFirstLetter = (text: string): string => {
  const alwaysUppercase = ['EE']
  const lowercaseWords = ['de', 'da', 'do', 'das', 'dos', 'e']

  return text
    .split(' ')
    .map((word, index) => {
      if (alwaysUppercase.includes(word.toUpperCase())) {
        return word.toUpperCase()
      }
      if (lowercaseWords.includes(word.toLowerCase()) && index !== 0) {
        return word.toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

export const parseRadioToBoolean = (value: any) => {
  if (value === 'sim') return true;
  if (value === 'nao') return false;
  return undefined;
};

export const getRadioValue = (existe: any) => {
  if (existe === null) return '';
  return existe ? 'sim' : 'nao';
};

// Formata e limita o número em tempo real
export function formatPhoneNumberRaw(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  } else {
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
  }
}
// const validateIntegerInput = (event: Event) => {
//   const inputElement = event.target as HTMLInputElement;
//   let value = inputElement.value;

//   // Remove qualquer caractere que não seja número
//   let cleanValue = value.replace(/\D/g, '');

//   // Atualiza o valor do input se estiver diferente
//   if (inputElement.value !== cleanValue) {
//     inputElement.value = cleanValue;

//     // Dispara evento para atualizar o v-model
//     inputElement.dispatchEvent(new Event('input', { bubbles: true }));

//     const fieldId = inputElement.id;
//     if (textInputs.value && fieldId) {
//       textInputs.value[fieldId] = cleanValue;
//     }
//   }
// };

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

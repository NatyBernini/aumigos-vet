import { isEmpty } from '../helpers';

const rest = (cpf: number[], count: number) =>
  ((cpf.slice(0, count - 12).reduce((soma: number, el: number, index: number) => soma + el * (count - index), 0) * 10) %
    11) %
  10;

const validate = (value: string) => {
  const cpf = value.replace(/\D+/g, '');

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  const aCpf = cpf.split('').map((el: string) => +parseInt(el));

  return rest(aCpf, 10) === aCpf[9] && rest(aCpf, 11) === aCpf[10];
};

export const cpf = (value: unknown): boolean => {
  if (isEmpty(value)) return true;

  const pattern = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

  if (Array.isArray(value)) {
    return value.every((val) => pattern.test(String(val)) && validate(String(val)));
  }

  return pattern.test(String(value)) && validate(String(value));
};

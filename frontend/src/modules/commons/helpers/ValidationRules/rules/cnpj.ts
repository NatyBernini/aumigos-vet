import { isEmpty } from '../helpers';

const calc = (cnpj: string, x: number) => {
  const n = cnpj.substring(0, x);
  let y = x - 7;
  let s = 0;
  let r = 0;

  for (let i = x; i >= 1; i--) {
    s += parseInt(n.charAt(x - i)) * y--;
    if (y < 2) y = 9;
  }

  r = 11 - (s % 11);
  return r > 9 ? 0 : r;
};
const calcular = (str: string) => {
  const cnpj = str.replace(/\D+/g, '');

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  const d = cnpj.substring(12);
  const d1 = parseInt(d.charAt(0));
  const d2 = parseInt(d.charAt(1));
  return calc(cnpj, 12) === d1 && calc(cnpj, 13) === d2;
};

export const cnpj = (value: unknown): boolean => {
  if (isEmpty(value)) return true;

  const pattern = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;

  if (Array.isArray(value)) {
    return value.every((val) => pattern.test(String(val)) && calcular(String(val)));
  }

  return pattern.test(String(value)) && calcular(String(value));
};

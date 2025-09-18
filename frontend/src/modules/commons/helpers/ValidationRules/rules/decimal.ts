import { isEmpty } from '../helpers';

export const decimal = (value: unknown) => {
  if (isEmpty(value)) return true;

  const pattern = /^-?\d*(\.\d+)?$/;

  if (Array.isArray(value)) {
    return value.every((val) => pattern.test(String(val)));
  }

  return pattern.test(String(value));
};

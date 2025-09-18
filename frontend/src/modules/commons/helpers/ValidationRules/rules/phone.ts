import { isEmpty } from '../helpers';

export const phone = (value: unknown) => {
  if (isEmpty(value)) return true;

  const pattern = /^\(?0?\d{2,3}\)?\s*((\d?[- ]*\d{4}[- ]*\d{4})|(\d{3}[- ]*\d{3}[- ]*\d{3}))$/;

  if (Array.isArray(value)) {
    return value.every((val) => pattern.test(String(val)));
  }

  return pattern.test(String(value));
};

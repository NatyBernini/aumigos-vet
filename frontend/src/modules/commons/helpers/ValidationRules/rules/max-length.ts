import { isEmpty } from '../helpers';

export const maxLength = (value: unknown, params: { length: string | number }): boolean => {
  if (isEmpty(value)) return true;

  const { length } = params;

  if (Array.isArray(value)) {
    return value.length <= Number(length);
  }

  return String(value).length <= Number(length);
};

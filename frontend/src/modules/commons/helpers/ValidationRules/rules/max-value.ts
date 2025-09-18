import { isEmpty } from '../helpers';

export const maxValue = (value: unknown, params: { max: string | number }): boolean => {
  if (isEmpty(value)) return true;

  const { max } = params;

  if (Array.isArray(value)) {
    return value.length > 0 && value.every((val) => Number(val) <= Number(max));
  }

  return Number(value) <= Number(max);
};

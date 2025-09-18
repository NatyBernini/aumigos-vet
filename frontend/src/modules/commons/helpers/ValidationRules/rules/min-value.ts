import { isEmpty } from '../helpers';

export const minValue = (value: unknown, params: { min: string | number }): boolean => {
  if (isEmpty(value)) return true;

  const { min } = params;

  if (Array.isArray(value)) {
    return value.length > 0 && value.every((val) => Number(val) >= Number(min));
  }

  return Number(value) >= Number(min);
};

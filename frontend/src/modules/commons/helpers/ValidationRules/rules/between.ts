import { isEmpty } from '@/modules/commons/helpers/ValidationRules/helpers';

const validate = (value: number, min: number, max: number) => min <= value && max >= value;

export const between = (value: unknown, params: { min: string | number; max: string | number }): boolean => {
  if (isEmpty(value)) return true;

  const { min, max } = params;

  if (Array.isArray(value)) {
    return value.every((val) => validate(Number(val), Number(min), Number(max)));
  }

  return validate(Number(value), Number(min), Number(max));
};

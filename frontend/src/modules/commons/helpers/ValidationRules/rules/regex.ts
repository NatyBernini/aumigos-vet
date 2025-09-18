import { isEmpty } from '@/modules/commons/helpers/ValidationRules/helpers';

export const regex = (value: unknown, params: { regex: RegExp | string }): boolean => {
  if (isEmpty(value)) return true;

  const regex = typeof params.regex === 'string' ? new RegExp(params.regex) : params.regex;

  if (Array.isArray(value)) {
    return value.every((val) => regex.test(String(val)));
  }

  return regex.test(String(value));
};

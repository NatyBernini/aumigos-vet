import { isEmpty } from '../helpers';

export const url = (value: unknown, params: { regex?: string | RegExp }) => {
  if (isEmpty(value)) return true;

  let pattern = params?.regex;

  if (typeof pattern === 'string') {
    pattern = new RegExp(pattern);
  }

  try {
    // eslint-disable-next-line no-new
    new URL(String(value));
  } catch {
    return false;
  }

  return pattern?.test(String(value)) ?? true;
};

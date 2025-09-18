import { describe, expect, it } from 'vitest';
import ValidationRules from './ValidationRules';

describe('ValidationRules', () => {
  it('should validate correctly required', () => {
    const required = (value: any) => ValidationRules.required(value, 'erro');

    expect(required(null)).toBe('erro');
    expect(required(undefined)).toBe('erro');
    expect(required('')).toBe('erro');
    expect(required('    ')).toBe('erro');
    expect(required([])).toBe('erro');
    expect(required([[]])).toBe('erro');

    expect(required(123)).toBe(true);
    expect(required('teste')).toBe(true);
    expect(required({})).toBe(true);
    expect(required([0])).toBe(true);
    expect(required(['1'])).toBe(true);
    expect(required([{}])).toBe(true);
    expect(required([0, 1])).toBe(true);
  });

  it('should validate correctly email', () => {
    const email = (value: any) => ValidationRules.email(value, 'erro');

    expect(email(null)).toBe(true);
    expect(email(undefined)).toBe(true);
    expect(email('')).toBe(true);
    expect(email('    ')).toBe(true);
    expect(email([])).toBe(true);
    expect(email([[]])).toBe(true);

    expect(email('123@123')).toBe('erro');
    expect(email(['123@123', '123@123.com'])).toBe('erro');

    expect(email('123@123.com')).toBe(true);
    expect(email('123@123.br')).toBe(true);
    expect(email('123@123.com.br')).toBe(true);
    expect(email('123@123.gov.br')).toBe(true);
  });

  it('should validate correctly cpf', () => {
    const cpf = (value: any) => ValidationRules.cpf(value, 'erro');

    expect(cpf(null)).toBe(true);
    expect(cpf(undefined)).toBe(true);
    expect(cpf('')).toBe(true);
    expect(cpf('    ')).toBe(true);
    expect(cpf([])).toBe(true);
    expect(cpf([[]])).toBe(true);

    expect(cpf('123.456.789-00')).toBe('erro');
    expect(cpf('111.111.111-11')).toBe('erro');
    expect(cpf('999.999.999-99')).toBe('erro');
    expect(cpf(['999.999.999-99', '333.064.330-71'])).toBe('erro');

    expect(cpf('333.064.330-71')).toBe(true);
    expect(cpf('124.154.500-65')).toBe(true);
    expect(cpf('698.080.200-38')).toBe(true);
    expect(cpf('999.427.180-60')).toBe(true);
  });

  it('should validate correctly cnpj', () => {
    const cnpj = (value: any) => ValidationRules.cnpj(value, 'erro');

    expect(cnpj(null)).toBe(true);
    expect(cnpj(undefined)).toBe(true);
    expect(cnpj('')).toBe(true);
    expect(cnpj('    ')).toBe(true);
    expect(cnpj([])).toBe(true);
    expect(cnpj([[]])).toBe(true);

    expect(cnpj('11.111.111/1111-11')).toBe('erro');
    expect(cnpj('11.111.111/0001-11')).toBe('erro');
    expect(cnpj('99.999.999/9999-99')).toBe('erro');
    expect(cnpj('99.999.999/0001-99')).toBe('erro');
    expect(cnpj(['99.999.999/0001-99', '51.660.811/0001-50'])).toBe('erro');

    expect(cnpj('51.660.811/0001-50')).toBe(true);
    expect(cnpj('65.558.517/0001-46')).toBe(true);
    expect(cnpj('39.124.852/0001-26')).toBe(true);
    expect(cnpj('67.708.447/0001-90')).toBe(true);
  });

  it('should validate correctly phone', () => {
    const phone = (value: any) => ValidationRules.phone(value, 'erro');

    expect(phone(null)).toBe(true);
    expect(phone(undefined)).toBe(true);
    expect(phone('')).toBe(true);
    expect(phone('    ')).toBe(true);
    expect(phone([])).toBe(true);
    expect(phone([[]])).toBe(true);

    expect(phone('(099) 9999-9999')).toBe(true);
    expect(phone('(99) 9999 9999')).toBe(true);
    expect(phone('(99) 99999-9999')).toBe(true);
    expect(phone('(99) 99999 9999')).toBe(true);
    expect(phone('(99) 9 9999-9999')).toBe(true);
    expect(phone('(99) 9 9999 9999')).toBe(true);
    expect(phone('(99) 999-999-999')).toBe(true);
    expect(phone('(199) 999 999 999')).toBe(true);

    expect(phone(['99 9999-9999', '99 9999 9999'])).toBe(true);
    expect(phone(['99 99999-9999', '099 99999 9999'])).toBe(true);
    expect(phone('99 9 9999-9999')).toBe(true);
    expect(phone('99 9 9999 9999')).toBe(true);
    expect(phone('99 999-999-999')).toBe(true);
    expect(phone('99 999 999 999')).toBe(true);
    expect(phone('999999999999')).toBe(true);
    expect(phone('99999999999')).toBe(true);

    expect(phone('99999999')).toBe('erro');
    expect(phone('999999999')).toBe('erro');
    expect(phone('9999999999999')).toBe('erro');
    expect(phone('99999999999999')).toBe('erro');
    expect(phone('999999999999999')).toBe('erro');
  });

  it('should validate correctly decimal', () => {
    const decimal = (value: any) => ValidationRules.decimal(value, 'erro');

    expect(decimal(null)).toBe(true);
    expect(decimal(undefined)).toBe(true);
    expect(decimal('')).toBe(true);
    expect(decimal('    ')).toBe(true);
    expect(decimal([])).toBe(true);
    expect(decimal([[]])).toBe(true);

    expect(decimal('9')).toBe(true);
    expect(decimal('9.9')).toBe(true);
    expect(decimal(9.9)).toBe(true);
    expect(decimal('9.99')).toBe(true);
    expect(decimal('9.999')).toBe(true);
    expect(decimal('9.9999')).toBe(true);
    expect(decimal('9.99999')).toBe(true);

    expect(decimal('99,99')).toBe('erro');
    expect(decimal('9,99999')).toBe('erro');
    expect(decimal(['9,99999', 9.9])).toBe('erro');
  });

  it('should validate correctly integer', () => {
    const integer = (value: any) => ValidationRules.integer(value, 'erro');

    expect(integer(null)).toBe(true);
    expect(integer(undefined)).toBe(true);
    expect(integer('')).toBe(true);
    expect(integer('    ')).toBe(true);
    expect(integer([])).toBe(true);
    expect(integer([[]])).toBe(true);

    expect(integer('9')).toBe(true);
    expect(integer('99')).toBe(true);
    expect(integer('999')).toBe(true);
    expect(integer('9999')).toBe(true);
    expect(integer('99999')).toBe(true);
    expect(integer(99999)).toBe(true);

    expect(integer(99.999)).toBe('erro');
    expect(integer('99.999')).toBe('erro');
    expect(integer('99,999')).toBe('erro');
    expect(integer(['99,999', 99999])).toBe('erro');
  });

  it('should validate correctly max value', () => {
    const maxValue = (value: any) => ValidationRules.maxValue(value, 'erro', { max: 3 });

    expect(maxValue(null)).toBe(true);
    expect(maxValue(undefined)).toBe(true);
    expect(maxValue('')).toBe(true);
    expect(maxValue('    ')).toBe(true);
    expect(maxValue([])).toBe(true);
    expect(maxValue([[]])).toBe(true);
    expect(maxValue('2')).toBe(true);
    expect(maxValue(2)).toBe(true);
    expect(maxValue(3)).toBe(true);
    expect(maxValue('3')).toBe(true);

    expect(maxValue([1, 2, 3, 4])).toBe('erro');
    expect(maxValue('4')).toBe('erro');
    expect(maxValue(4)).toBe('erro');
  });

  it('should validate correctly min value', () => {
    const minValue = (value: any) => ValidationRules.minValue(value, 'erro', { min: 3 });

    expect(minValue(null)).toBe(true);
    expect(minValue(undefined)).toBe(true);
    expect(minValue('')).toBe(true);
    expect(minValue('    ')).toBe(true);
    expect(minValue([])).toBe(true);
    expect(minValue([[]])).toBe(true);

    expect(minValue('3')).toBe(true);
    expect(minValue('4')).toBe(true);
    expect(minValue(4)).toBe(true);
    expect(minValue(3)).toBe(true);

    expect(minValue([1, 2, 3, 4])).toBe('erro');
    expect(minValue('2')).toBe('erro');
    expect(minValue(2)).toBe('erro');
  });

  it('should validate correctly min length', () => {
    const minLength = (value: any) => ValidationRules.minLength(value, 'erro', { length: 3 });

    expect(minLength(null)).toBe(true);
    expect(minLength(undefined)).toBe(true);
    expect(minLength('')).toBe(true);
    expect(minLength('    ')).toBe(true);
    expect(minLength([])).toBe(true);
    expect(minLength([[]])).toBe(true);

    expect(minLength(123)).toBe(true);
    expect(minLength([])).toBe(true);
    expect(minLength([[]])).toBe(true);
    expect(minLength('teste')).toBe(true);
    expect(minLength('123')).toBe(true);
    expect(minLength([0, 1, 3])).toBe(true);
    expect(minLength(['0', [], {}])).toBe(true);

    expect(minLength([0])).toBe('erro');
    expect(minLength(['1'])).toBe('erro');
    expect(minLength([{}])).toBe('erro');
    expect(minLength([0, 1])).toBe('erro');
  });

  it('should validate correctly max length', () => {
    const maxLength = (value: any) => ValidationRules.maxLength(value, 'erro', { length: 3 });

    expect(maxLength(null)).toBe(true);
    expect(maxLength(undefined)).toBe(true);
    expect(maxLength('')).toBe(true);
    expect(maxLength('    ')).toBe(true);
    expect(maxLength([])).toBe(true);
    expect(maxLength([[]])).toBe(true);

    expect(maxLength(123)).toBe(true);
    expect(maxLength([])).toBe(true);
    expect(maxLength([[]])).toBe(true);
    expect(maxLength('123')).toBe(true);
    expect(maxLength([0, 1, 3])).toBe(true);
    expect(maxLength(['0', [], {}])).toBe(true);

    expect(maxLength('teste')).toBe('erro');
    expect(maxLength([0, 1, 2, 3])).toBe('erro');
    expect(maxLength('1234')).toBe('erro');
    expect(maxLength([0, 1, 2, 3, 4])).toBe('erro');
    expect(maxLength(['0', 1, 2, 3, 4])).toBe('erro');
  });

  it('should validate correctly numeric value', () => {
    const numeric = (value: any) => ValidationRules.numeric(value, 'erro');

    expect(numeric(null)).toBe(true);
    expect(numeric(undefined)).toBe(true);
    expect(numeric('')).toBe(true);
    expect(numeric('    ')).toBe(true);
    expect(numeric([])).toBe(true);
    expect(numeric([[]])).toBe(true);

    expect(numeric(123)).toBe(true);
    expect(numeric('123')).toBe(true);
    expect(numeric('123.123')).toBe(true);

    expect(numeric('123,123')).toBe('erro');
    expect(numeric('123.123,123')).toBe('erro');
    expect(numeric('123,123.123')).toBe('erro');
    expect(numeric('123.123.123')).toBe('erro');
    expect(numeric('123,123,123')).toBe('erro');
    expect(numeric('123.123.123,123')).toBe('erro');
    expect(numeric('123,123,123.123')).toBe('erro');
    expect(numeric('123.123,123.123')).toBe('erro');
    expect(numeric('123,123.123,123')).toBe('erro');
    expect(numeric('teste')).toBe('erro');
    expect(numeric('123.')).toBe('erro');
    expect(numeric('123,')).toBe('erro');
    expect(numeric(['123,', 123])).toBe('erro');
  });

  it('should validate correctly url', () => {
    const url = (value: any) => ValidationRules.url(value, 'erro');

    expect(url(null)).toBe(true);
    expect(url(undefined)).toBe(true);
    expect(url('')).toBe(true);
    expect(url('    ')).toBe(true);
    expect(url([])).toBe(true);
    expect(url([[]])).toBe(true);

    expect(url('http://www.google.com')).toBe(true);
    expect(url('https://www.google.com')).toBe(true);
    expect(url('http://www.google.com.br')).toBe(true);
    expect(url('https://www.google.com.br')).toBe(true);
    expect(url('http://www.google.com.br/')).toBe(true);
    expect(url('https://www.google.com.br/')).toBe(true);
    expect(url('http://www.google.com.br/123')).toBe(true);
    expect(url('https://www.google.com.br/123')).toBe(true);
    expect(url('http://www.google.com.br/123/')).toBe(true);
    expect(url('https://www.google.com.br/123/')).toBe(true);
  });

  it('should validate correctly url regex', () => {
    const url = (value: any) =>
      ValidationRules.url(value, 'erro', { regex: '^(http|https)://www.teste.gov.br(/?\\S*)*$' });

    expect(url('http://www.teste.gov.br/')).toBe(true);
    expect(url('https://www.teste.gov.br/')).toBe(true);
    expect(url('http://www.teste.gov.br/123')).toBe(true);
    expect(url('https://www.teste.gov.br/123/123/')).toBe(true);
    expect(url('https://www.teste.gov.br/123/123/123/123')).toBe(true);

    expect(url('http://www.google.com')).toBe('erro');
    expect(url('https://www.google.com')).toBe('erro');
    expect(url('http://www.google.gov.br')).toBe('erro');
    expect(url('https://www.google.gov.br')).toBe('erro');
    expect(url('123')).toBe('erro');
  });

  it('should validate correctly regex', () => {
    const regex = (value: any) => ValidationRules.regex(value, 'erro', { regex: /^\d{4}(\s?\d{4}){3}$/ });

    expect(regex(null)).toBe(true);
    expect(regex(undefined)).toBe(true);
    expect(regex('')).toBe(true);
    expect(regex('    ')).toBe(true);
    expect(regex([])).toBe(true);
    expect(regex([[]])).toBe(true);

    expect(regex('4916 4424 2030 0559')).toBe(true);
    expect(regex('4916442420300559')).toBe(true);
    expect(regex(['4532 0515 5910 5442', '4929 3673 0256 8392'])).toBe(true);

    expect(regex('11111111111')).toBe('erro');
    expect(regex('222')).toBe('erro');
    expect(regex('33333333333333333')).toBe('erro');
  });

  it('should validate correctly between two dates', () => {
    const between = (value: any) =>
      ValidationRules.between(value, 'erro', { min: new Date('2023-01-01'), max: new Date('2023-12-31') });

    expect(between(null)).toBe(true);
    expect(between(undefined)).toBe(true);
    expect(between('')).toBe(true);
    expect(between('    ')).toBe(true);
    expect(between([])).toBe(true);
    expect(between([[]])).toBe(true);

    expect(between(new Date('2023-04-01'))).toBe(true);
    expect(between(new Date('2023-06-30'))).toBe(true);
    expect(between(new Date('2023-09-12'))).toBe(true);

    expect(between(new Date('2022-09-12'))).toBe('erro');
    expect(between(new Date('2020-09-12'))).toBe('erro');
    expect(between([new Date('2020-09-12'), new Date('2023-01-01')])).toBe('erro');
  });
});

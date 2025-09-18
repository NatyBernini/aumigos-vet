
import * as rules from './rules';

const rule =
  (rule: any, errorMessage: string = 'error') =>
  (value: any, message: string = errorMessage, config?: any) =>
    rule(value, config) || message;

export default {
  required: rule(rules.required,"O campo é obrigatório."),
  minLength: rule(rules.minLength, "Obrigatório o tamanho mínimo."),
  maxLength: rule(rules.maxLength, "Obrigatório o tamanho máximo."),
  minValue: rule(rules.minValue,  "O valor deve ser maior."),
  maxValue: rule(rules.maxValue,  "O valor deve ser menor."),
  email: rule(rules.email, "O email é inválido."),
  cpf: rule(rules.cpf,"O CPF é inválido."),
  cnpj: rule(rules.cnpj,"O CNPJ é inválido."),
  phone: rule(rules.phone,"O telefone é inválido."),
  integer: rule(rules.integer, "Número inválido."),
  decimal: rule(rules.decimal,"Número decimal inválido."),
  between: rule(rules.between,"O valor deve estar entre o mínimo e o máximo."),
  numeric: rule(rules.numeric, "O valor deve ser numérico."),
  regex: rule(rules.regex, "Formato inválido"),
  url: rule(rules.url, "URL inválida")
};

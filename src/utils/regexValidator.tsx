import { NAME_REGEX, PASSWORD_REGEX, ONLY_DIGIT_REGEX, EMAIL_REGEX } from '../constant/regex';

export const UserNameValidate = (value: string) => NAME_REGEX.test(value);

export const isValidPassword = (value: string) => PASSWORD_REGEX.test(value);

export const isValidText = (text: string) => new RegExp(ONLY_DIGIT_REGEX, 'g').test(text);

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value);

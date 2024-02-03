
export const PASSWORD_REGEX = /^(?=.*[a-zA-z])(?=.*\d)(?=.*[@$!%*?+&~`#^_=|"':;,.()-])[A-Za-z\d@$!%*?&~`#^_=|"':;,.()-].*$/;

export const ONLY_DIGIT_REGEX = '^[0-9]*$';

export const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9.,$;]{2,15}$/;

export const PASSWORD = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

export const STRING_CHECK = /[^\s]+/;

export const NUMBER_ONLY = /^[0-9]+$/;

export const NUMBER_ONLY_WITH_DECIMAL = /^\d{0,10}(\.\d{0,2})?$/;

export const EMAIL_REGEX =
  /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

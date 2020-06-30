import { UI } from '@solid/lit-vocab-common';

export const PERMISSIONS = {
  APPEND: 'Append',
  READ: 'Read',
  WRITE: 'Write',
  CONTROL: 'Control'
};

export const InputTextTypes = {
  [UI.SingleLineTextField]: 'text',
  [UI.EmailField]: 'email',
  [UI.PhoneField]: 'phone',
  [UI.DecimalField]: 'number',
  [UI.FloatField]: 'number',
  [UI.IntegerField]: 'number'
};

/* See <https://date-fns.org/v2.8.1/docs/format> for format explanations */
export const DATE_FORMAT = {
  DATE: 'yyyy-MM-dd',
  TIME: 'kk:mm:ss'
};

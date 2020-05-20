import { UI } from '@inrupt/lit-generated-vocab-common';

export const PERMISSIONS = {
  APPEND: 'Append',
  READ: 'Read',
  WRITE: 'Write',
  CONTROL: 'Control'
};

export const InputTextTypes = {
  [UI.SingleLineTextField.value]: 'text',
  [UI.EmailField.value]: 'email',
  [UI.PhoneField.value]: 'phone',
  [UI.DecimalField.value]: 'number',
  [UI.FloatField.value]: 'number',
  [UI.IntegerField.value]: 'number'
};

/* See <https://date-fns.org/v2.8.1/docs/format> for format explanations */
export const DATE_FORMAT = {
  DATE: 'yyyy-MM-dd',
  TIME: 'kk:mm:ss'
};

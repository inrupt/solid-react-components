export const PERMISSIONS = {
  APPEND: 'Append',
  READ: 'Read',
  WRITE: 'Write',
  CONTROL: 'Control'
};

export const ACL_PREFIXES = {
  acl: 'http://www.w3.org/ns/auth/acl#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  n: 'http://www.w3.org/2006/vcard/ns#',
  a: 'http://www.w3.org/ns/auth/acl#type'
};

export const FORM_MODEL = {
  MULTIPLE_TYPE: 'http://www.w3.org/ns/ui#Multiple'
};

export const UITypes = {
  SingleLineTextField: 'http://www.w3.org/ns/ui#SingleLineTextField',
  MultiLineTextField: 'http://www.w3.org/ns/ui#MultiLineTextField',
  DecimalField: 'http://www.w3.org/ns/ui#DecimalField',
  FloatField: 'http://www.w3.org/ns/ui#FloatField',
  IntegerField: 'http://www.w3.org/ns/ui#IntegerField',
  EmailField: 'http://www.w3.org/ns/ui#EmailField',
  PhoneField: 'http://www.w3.org/ns/ui#PhoneField',
  BooleanField: 'http://www.w3.org/ns/ui#BooleanField',
  TriStateField: 'http://www.w3.org/ns/ui#TriStateField',
  ColorField: 'http://www.w3.org/ns/ui#ColorField',
  DateField: 'http://www.w3.org/ns/ui#DateField',
  DateTimeField: 'http://www.w3.org/ns/ui#DateTimeField',
  TimeField: 'http://www.w3.org/ns/ui#TimeField',
  Classifier: 'http://www.w3.org/ns/ui#Classifier',
  Heading: 'http://www.w3.org/ns/ui#Heading',
  Comment: 'http://www.w3.org/ns/ui#Comment'
};

export const InputTextTypes = {
  'http://www.w3.org/ns/ui#SingleLineTextField': 'text',
  'http://www.w3.org/ns/ui#EmailField': 'email',
  'http://www.w3.org/ns/ui#PhoneField': 'phone',
  'http://www.w3.org/ns/ui#DecimalField': 'number',
  'http://www.w3.org/ns/ui#FloatField': 'number',
  'http://www.w3.org/ns/ui#IntegerField': 'number'
};

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
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
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

export const FormModelUI = {
  UI_VALUE: 'ui:value',
  UI_LABEL: 'ui:label',
  UI_NAME: 'ui:name',
  UI_DEFAULT: 'ui:default',
  RDF_TYPE: 'rdf:type',
  MIN_VALUE: 'ui:minValue',
  MAX_VALUE: 'ui:maxValue',
  MAX_DATE_OFFSET: 'ui:maxdateOffset',
  MIN_DATE_OFFSET: 'ui:mindateOffset',
  MAX_DATETIME_OFFSET: 'ui:maxdatetimeOffset',
  MIN_DATETIME_OFFSET: 'ui:mindatetimeOffset'
};

export const NotificationTypes = {
  ACCEPT: 'https://www.w3.org/ns/activitystreams#Accept',
  ADD: 'https://www.w3.org/ns/activitystreams#',
  ANNOUNCE: 'https://www.w3.org/ns/activitystreams#Announce',
  ARRIVE: 'https://www.w3.org/ns/activitystreams#Arrive',
  BLOCK: 'https://www.w3.org/ns/activitystreams#Block',
  CREATE: 'https://www.w3.org/ns/activitystreams#Create',
  DELETE: 'https://www.w3.org/ns/activitystreams#Delete',
  DISLIKE: 'https://www.w3.org/ns/activitystreams#Dislike',
  FLAG: 'https://www.w3.org/ns/activitystreams#Flag',
  FOLLOW: 'https://www.w3.org/ns/activitystreams#Follow',
  IGNORE: 'https://www.w3.org/ns/activitystreams#Ignore',
  INVITE: 'https://www.w3.org/ns/activitystreams#Invite',
  JOIN: 'https://www.w3.org/ns/activitystreams#Join',
  LEAVE: 'https://www.w3.org/ns/activitystreams#Leave',
  LIKE: 'https://www.w3.org/ns/activitystreams#Like',
  LISTEN: 'https://www.w3.org/ns/activitystreams#Listen',
  MOVE: 'https://www.w3.org/ns/activitystreams#Move',
  OFFER: 'https://www.w3.org/ns/activitystreams#Offer',
  READ: 'https://www.w3.org/ns/activitystreams#Read',
  REJECT: 'https://www.w3.org/ns/activitystreams#Reject',
  QUESTION: 'https://www.w3.org/ns/activitystreams#Question',
  TENTATIVEACCEPT: 'https://www.w3.org/ns/activitystreams#TentativeAccept',
  TENTATIVEREJECT: 'https://www.w3.org/ns/activitystreams#TentativeReject',
  TRAVEL: 'https://www.w3.org/ns/activitystreams#Travel',
  REMOVE: 'https://www.w3.org/ns/activitystreams#Remove',
  UNDO: 'https://www.w3.org/ns/activitystreams#Undo',
  UPDATE: 'https://www.w3.org/ns/activitystreams#Update',
  VIEW: 'https://www.w3.org/ns/activitystreams#View'
};

/* See <https://date-fns.org/v2.8.1/docs/format> for format explanations */
export const DATE_FORMAT = {
  DATE: 'yyyy-MM-dd',
  TIME: 'kk:mm:ss'
};

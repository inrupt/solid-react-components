export type Provider = {
  description: String,
  image: String,
  label: String,
  value: String
};

export type SelectOptions = {
  label: string,
  value: string
};

export type UploadedFiles = {
  uri: String,
  name: String
};

export type SolidError = {
  type: String,
  statusText: String,
  code: number
};

export type Annotation = {
  type: String,
  predicate: String,
  object: {}
};

export type FormFocus = {
  value: String,
  name: String,
  parentSubject: ?String,
  parentPredicate: ?String
};

export type FormValue = {
  _formFocus: FormFocus
};

export type Expressions = {
  annotations: ?Array<Annotation>,
  predicate: String,
  type: String,
  valueExpr: any,
  _formValues: ?Array<FormValue>
};

export type Expression = {
  expressions: Array<Expressions>,
  type: String,
  _formFocus: ?FormFocus
};

export type Shape = {
  expression: ?Expression,
  id: String,
  type: String
};

export type ShexJ = {
  '@context': String,
  shapes: Array<Shape>,
  start: ?String,
  type: String,
  expression: ?Expression
};

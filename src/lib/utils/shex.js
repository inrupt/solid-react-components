/* eslint-disable no-restricted-syntax */
import ldflex from '@solid/query-ldflex';
import { namedNode } from '@rdfjs/data-model';
import unique from 'unique-string';

/**
 * Return annotations from ShexJ
 * @param key
 * @param annotations
 * @param language
 * @returns {null| Annotations}
 */
const findAnnotation = (
  key: String,
  annotations: Object,
  language: ?String = 'es'
) => {
  if (annotations) {
    return annotations.find(
      annotation =>
        annotation.predicate.includes(key) &&
        ((annotation.object.language &&
          annotation.object.language.includes(language)) ||
          (!annotation.object.language || !language))
    );
  }
  return null;
};

/**
 * Create a unique Node Id (Link)
 * @param documentUri
 * @param seed
 * @returns {string}
 */
const createIdNode = (documentUri: String, seed: number) => {
  const randomId = Date.parse(new Date()) + (seed + 1);
  const doc = documentUri || 'https://example.org';
  const id = `${doc.split('#')[0]}#id${randomId}`;

  return id;
};

/**
 * Return label name from shex annotations or predicate
 * @param data
 * @param language
 * @returns {string}
 */
const formLabel = (data: Object, language: ?String) => {
  if (data.annotations) {
    const annotation = findAnnotation('label', data.annotations, language);
    if (annotation) {
      return annotation.object.value;
    }
  }
  const { predicate } = data;

  return (
    predicate &&
    (predicate.includes('#')
      ? predicate.split('#')[1]
      : predicate.split('/').pop())
  );
};

/**
 * Create new Field(expression with formValues and formFocus) if this is a link
 * will create a unique link id to point into document and will update children expression values
 * with new unique name and empty value(this is recursive).
 *
 * @param { Expression } expression shexJ object
 * @param { boolen } isLink to deep or not into children expressions.
 * @param { Object } parentSubject the Node of the subject
 */
const createField = (
  expression: Expression,
  parentSubject: Object,
  settings: object
) => {
  let nodeValue = '';
  let newExpression;
  /** if this expression is a link to other expression shape will deep into children expression */
  if (expression.expression && expression.expression.expressions) {
    nodeValue = createIdNode(settings.documentUri, settings.seed);
    const updatedExp = expression.expression.expressions.map(exp => {
      const newExpr = exp._formValues.map(frm => {
        return createField(frm, { parentSubject: nodeValue });
      });
      /** Return an expression with new name and empty value in _formValues */
      return { ...exp, _formValues: [newExpr[0]] };
    });

    newExpression = { expression: { expressions: updatedExp } };
  }
  /** Return a new expression */
  return {
    ...expression,
    ...newExpression,
    _formFocus: {
      ...expression._formFocus,
      ...parentSubject,
      name: unique(),
      value: nodeValue,
      isNew: true
    }
  };
};

const renderFieldValue = (annotations: Array<Annotation>, value: String) => {
  const hasPrefix = findAnnotation('layoutprefix', annotations);
  if (hasPrefix && typeof value === 'string') {
    return value.split(hasPrefix.object.value).pop();
  }
  return value;
};

/**
 * return predicate if expressions is a dropdown
 * @param parent
 * @param expression
 * @returns {null || parentPredicate}
 */
const parentLinkOnDropDowns = (parent: Object, expression: Object) => {
  return (parent &&
    parent.predicate &&
    parent.expression &&
    parent.expression.expressions.legnth > 0) ||
    (expression &&
      expression.expression &&
      expression.expression.expressions.length > 0)
    ? parent.predicate
    : null;
};

/**
 * Allow or not new fields according to shex
 * @param data
 * @returns {boolean}
 */
const allowNewFields = (data: Object) => {
  const totalData = data._formValues.length;

  return (!data.min && !data.max) || data.max > totalData || data.max === -1;
};

/**
 * check if field value was updated
 * @param value
 * @param defaultValue
 * @returns {boolean}
 */
const isValueChanged = (value, defaultValue) => {
  return value !== defaultValue;
};

/**
 * Map into _formValues and check which field was updated from POD
 * @params {Object} rootExpression
 * @params {Function} callBack using to make any action on formValues
 */
const mapExpFormValues = async (rootExpression, callback, linkUri) => {
  let updatedExpressions = [];

  if (rootExpression && rootExpression.expressions) {
    for await (const expression of rootExpression.expressions) {
      let updatedFormValues = [];
      let index = 0;

      for await (const node of ldflex[linkUri][expression.predicate]) {
        updatedFormValues = [
          ...updatedFormValues,
          callback(
            expression._formValues[index] ||
              createField(expression._formValueClone, linkUri, {
                linkUri,
                seed: index
              }),
            updatedExpressions,
            renderFieldValue(expression.annotations, node.value),
            linkUri
          )
        ];

        if (updatedFormValues[index].expression) {
          updatedFormValues[index] = {
            ...updatedFormValues[index],
            expression: {
              expressions: await mapExpFormValues(
                updatedFormValues[index].expression,
                callback,
                updatedFormValues[index]._formFocus.value
              )
            }
          };
        }

        index += 1;
      }

      if (updatedFormValues.length === 0) {
        updatedFormValues = [
          ...updatedFormValues,
          callback(
            expression._formValues[index] ||
              createField(expression._formValueClone, linkUri, {
                linkUri,
                seed: index
              }),
            updatedExpressions,
            '',
            linkUri
          )
        ];
      }

      updatedExpressions = [
        ...updatedExpressions,
        {
          ...expression,
          _formValues: updatedFormValues
        }
      ];
    }
  }

  return updatedExpressions;
};

/**
 * Map into all shexJ _formValues objects
 * @params {Object} Shape
 * @params {Function} callBack using to make any action on formValues
 */
const mapFormValues = (shape: Shape, callBack: String) => {
  try {
    let newExpressions = [];

    for (const expression of shape.expression.expressions) {
      let newFormValues = [];
      let formValuesindex = 0;

      for (const formValue of expression._formValues) {
        let newFormValue = { ...formValue };

        newFormValue = callBack(newFormValue, expression, formValuesindex);

        if (
          newFormValue &&
          newFormValue.expression &&
          newFormValue.expression.expressions
        ) {
          const expressions = mapFormValues(newFormValue, callBack);
          newFormValue = { ...newFormValue, expression: { expressions } };
        }

        // eslint-disable-next-line no-nested-ternary
        newFormValues = newFormValue
          ? Array.isArray(newFormValue)
            ? [...newFormValues, ...newFormValue]
            : [...newFormValues, newFormValue]
          : newFormValues;

        formValuesindex += 1;
      }

      newExpressions = [
        ...newExpressions,
        { ...expression, _formValues: newFormValues }
      ];
    }
    return newExpressions;
  } catch (error) {
    return error;
  }
};

const canDelete = data =>
  data.min === undefined || data.min === 1 ? data._formValues.length > 1 : true;

const isExpressionLink = valueExpr => {
  return typeof valueExpr === 'string' || null;
};

/**
 * Check if expression is an drop down when values comes.
 * @param expression
 * @returns {null|{values: *}}
 */
const isExpressionDropDown = (expression: Expression) => {
  if (Array.isArray(expression.values)) {
    return { values: expression.values };
  }
  return null;
};

/**
 * Clean values when come like uri
 * @param value
 * @returns {String|string}
 */
const cleanValue = (value: String) => {
  if (value.includes('#')) {
    return value.split('#').pop();
  }

  return value;
};

/**
 * Add field value prefix to send over POD
 * @param value
 * @param prefix
 * @returns {any}
 */
const setFieldValue = (value: String, prefix: ?String) =>
  prefix ? namedNode(`${prefix}${value}`) : value;

export {
  formLabel,
  findAnnotation,
  parentLinkOnDropDowns,
  allowNewFields,
  canDelete,
  isValueChanged,
  mapExpFormValues,
  isExpressionLink,
  isExpressionDropDown,
  createIdNode,
  mapFormValues,
  renderFieldValue,
  cleanValue,
  setFieldValue,
  createField
};

import ldflex from '@solid/query-ldflex';

const findAnnotation = (key: String, annotations: Object, language: ?String = 'es') => {
  if (annotations) {
    return annotations.find(
      annotation =>
        annotation.predicate.includes(key) &&
        ((annotation.object.language &&
          annotation.object.language.includes(language)) || (!annotation.object.language || !language))
    );
  }
  return null;
};

const formLabel = (data: Object, language: ?String) => {
  if (data.annotations) {
    const annotation = findAnnotation('label', data.annotations, language);
    if (annotation) {
      return annotation.object.value;
    }
  }
  const { predicate } = data;

  if (predicate) {
    return predicate.includes('#')
        ? predicate.split('#')[1]
        : predicate.split('/').pop();
  }
};

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

const allowNewFields = (data: Object) => {
  const totalData = data._formValues.length;

  return (
    (!data.min && !data.max) ||
    (data.max > totalData) ||
    data.max === -1
  );
};

const isValueChanged = (value, defaultValue) => {
  return value !== defaultValue;
};

/*
 * Map into _formValues and check which field was updated from POD
 * @params {Object} rootExpression
 * @params {Function} callBack using to make any action on formValues
*/
const mapExpFormValues = async (rootExpression, callback, linkUri) => {
    let updatedExpressions = [];

    if (rootExpression && rootExpression.expressions) {

        for await (let expression of rootExpression.expressions) {
            let updatedFormValues = [];
            let index = 0;

            for await (let node of ldflex[linkUri][expression.predicate]) {
                updatedFormValues = [...updatedFormValues, callback(
                    expression._formValues[index] || {...expression._formValueClone},
                    updatedExpressions,
                    renderFieldValue(expression.annotations, node.value),
                    linkUri
                )];


                if (updatedFormValues[index].expression) {
                    updatedFormValues[index] = {
                        ...updatedFormValues[index],
                        expression: {
                            expressions : await mapExpFormValues(updatedFormValues[index].expression,
                                callback, updatedFormValues[index]._formFocus.value)
                        }
                    };

                }

                index++;
            }

            if (updatedFormValues.length === 0) {
                updatedFormValues = [...updatedFormValues, callback(
                    expression._formValues[index] || {...expression._formValueClone},
                    updatedExpressions,
                    '',
                    linkUri
                )];
            }

            updatedExpressions = [...updatedExpressions, {
                ...expression,
                _formValues: updatedFormValues
            }];

        }
    }

    return updatedExpressions;
};

/*
 * Map into all shexJ _formValues objects
 * @params {Object} Shape
 * @params {Function} callBack using to make any action on formValues
*/
const mapFormValues = (shape: Shape, callBack: String) => {
    try {
        let newExpressions = [];

        for (let expression of shape.expression.expressions) {
            let newFormValues = [];
            let formValuesindex = 0;

            for (let formValue of expression._formValues) {
                let newFormValue = {...formValue};

                newFormValue = callBack(newFormValue, expression, formValuesindex);

                if (newFormValue && newFormValue.expression && newFormValue.expression.expressions) {
                    const expressions = mapFormValues(newFormValue, callBack);
                    newFormValue = {...newFormValue, expression: { expressions }}
                }

                newFormValues = newFormValue ? Array.isArray(newFormValue)
                    ? [...newFormValues, ...newFormValue]
                    : [...newFormValues, newFormValue]
                  : newFormValues;

                formValuesindex++;
            }

            newExpressions = [...newExpressions, {...expression, _formValues: newFormValues}]
        }
        return newExpressions;
    } catch (error) {
        return error;
    }
};

const canDelete = (data) => data.min === undefined || data.min === 1 ? data._formValues.length > 1 : true;

const isExpressionLink = valueExpr => {
    return typeof valueExpr === 'string' || null;
};

const renderFieldValue = (annotations: Array<Annotation>, value: String) => {
    const hasPrefix = findAnnotation('layoutprefix', annotations);
    if (hasPrefix && typeof value == 'string') {
        return value.split(hasPrefix.object.value).pop();
    }
    return value;
};

/*
     * Check if expression is an drop down when values comes.
     */
const isExpressionDropDown = (expression: Expression) => {
    if (Array.isArray(expression.values)) {
        return { values: expression.values };
    }
    return null;
};

/*
   * Create a unique Node Id (Link)
   */
const createIdNode = (documentUri: String, seed: number) => {
    const randomId = Date.parse (new Date ()) + (seed++);
    const doc = documentUri || 'https://example.org';
    const id = `${doc.split('#')[0]}#id${randomId}`;

    return id;
};

const cleanValue = (value: String) => {
    if (value.includes('#')) {
        return value.split('#').pop();
    }

    return value;
}

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
    cleanValue
};

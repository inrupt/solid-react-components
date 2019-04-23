import { useCallback, useState, useEffect } from 'react';
import data from '@solid/query-ldflex';
import shexParser from '@shexjs/parser';
import shexCore from '@shexjs/core';
import unique from 'unique-string';
import { findAnnotation } from "@utils";

export const useShex = (fileShex: String, documentUri: String) => {
    const [shexData, setShexData] = useState({});
    let shapes = [];

    const fetchShex = useCallback(async () => {
        const rootShex = await fetch(fileShex, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
        const rootShexText = await rootShex.text();

        return rootShexText.toString();
    });

    const fetchDocument = async () => {
        const document = await data[documentUri];

        return document;
    };

    const isLink = valueExpr => {
        return typeof valueExpr === 'string' || null;
    };

    const fieldValue = (annotations: Array<Object>, value: String) => {
        const hasPrefix = findAnnotation('layoutprefix', annotations);
        if (hasPrefix && typeof value == 'string') {
            return value.split(hasPrefix.object.value).pop();
        }

        return value;
    };
    const findRootShape = (shexJ: Object) => {
        return shexJ.start.split('#').pop();
    };


    const getFormFocusObject = (
      subject: String,
      valueEx: String,
      annotations?: Array<Object>,
      isNew: boolean,
    ) => {
      let value = valueEx;
      if (annotations) {
        value = fieldValue(annotations, valueEx);
      }

      return subject
        ? { value, parentSubject: subject, name: unique(), isNew }
        : { value, name: unique(), isNew };
    };

    const isDropDown = (expression: Object) => {
        if (Array.isArray(expression.values)) {
            return { values: expression.values };
        }
        return null;
    }

    const createIdNode = () => {
        const id = `${documentUri.split('#')[0]}#id${Date.parse (new Date ())}`;
        return id;
    }

    /* const buildExpression = (parentExpresion: Object) => {
        return parentExpresion ? { id: parentExpresion.valueExpr, type: parentExpresion.type } : null
    }

    const findParentExpression = (parentExpresion, expression) => {
        if (parentExpresion && parentExpresion._formFocus && parentExpresion._formFocus.value) {
            return parentExpresion._formFocus.value;
        }
        return documentUri;

    }; */

    const updateRemove = (expression, action, options) => {
        if (action === 'filter') {
            return null;
        }
        return {
            ...expression,
            _formFocus: {
                ...expression._formFocus,
                ...options.data
            }
        };
    }

    const addNewExpression = (expression: Object, parentExpresion: Object) => {
        const { formData, shexJ } = shexData;
        const newFormData = addShexJField(formData, expression, parentExpresion);

        console.log(newFormData);

        setShexData({ shexJ, formData: {...formData, expression: { expressions: newFormData }}});
    }

    const onUpdateShexJ = (key: String, action: String, data: ?Object) => {
        const { formData, shexJ } = shexData;
        const newFormData = _updateShexJ(formData, action, { key, data });

        if (newFormData) {
            setShexData({shexJ, formData: {...formData, expression: {expressions: newFormData}}});
        }
    }

    const copyChildExpression = (expressions: Array<Object>, linkId: String) => {
        return expressions.map(expression => {
           if (expression.valueExpr) {
               const childExpression =  copyChildExpression(expression._formValues, linkId);

               return {
                   ...expression,
                   _formValues: childExpression
               }
           }

           return createField(expression, false, linkId);
        });
    }

    const createField = (expression: Object, isLink: boolean = false) => {
        const name = unique();
        const value = isLink ? createIdNode() : '';
        let childExpressions;

        if (expression.expression && expression.expression.expressions) {
            const { expression: { expressions }} = expression;

            childExpressions = copyChildExpression(expressions, value);
        }

        return {
            ...expression,
            expression : { expressions: childExpressions },
            _formFocus: {
                ...expression._formFocus,
                name,
                isNew: true,
                value
            }
        }
    }


    const addShexJField = (shexJ: Object, currentExpression: Object, parent: ?Object) => {
      if (shexJ.expression) {
          const { expression : { expressions }} = shexJ;

          const newUpdated = expressions.map(expression => {
              if (
                expression &&
                (expression.predicate ===
                  currentExpression.predicate ||
                  (parent &&
                    expression.predicate === parent.predicate) ||
                  expression.predicate === currentExpression.id)
              ) {
                return {
                  ...expression,
                  _formValues: [
                    ...expression._formValues,
                    createField(expression._formValues[0])
                  ]
                };
              }

              if (isLink(expression.valueExpr) || !expression.predicate) {
                  const childExpressions = expression._formValues.map(childExpression => {
                      const updatedExpressions = addShexJField(childExpression, currentExpression, parent);

                      return {
                          ...childExpression,
                          expression: { expressions: updatedExpressions }
                      }
                  });

                  return {
                      ...expression,
                      _formValues: childExpressions
                  };
              }

              return expression;
          });
          return newUpdated;
      }
    };


    /*
     * Recursive Function to update values into ShexJ object
     * action allowed delete and update
     */
    const _updateShexJ = (rootShape: Object, action: String, options: Object) => {
        if (rootShape && rootShape.expression) {
            return rootShape.expression.expressions.map(expression => {
                if (isLink(expression.valueExpr)) {
                    const _formValues = expression._formValues[action](childExpression => {

                        if (childExpression._formFocus.name === options.key) {
                            return updateRemove(childExpression, action, options);
                        }

                        const linkExpression = _updateShexJ(childExpression, action, options);

                        return {
                            ...childExpression,
                            expression: {
                                expressions: [
                                    ...childExpression
                                        .expression
                                        .expressions,
                                    linkExpression
                                ]
                            }
                        };

                    });

                    return {
                        ...expression,
                        _formValues: _formValues
                    };

                } else {

                    const _formValues = expression._formValues[action](childExpression => {
                        if (childExpression._formFocus.name === options.key) {
                            return updateRemove(childExpression, action, options);
                        }
                        return childExpression;
                    });

                    return {
                        ...expression,
                        _formValues: [..._formValues],
                    }
                }
            });
        }

        return rootShape;
    }


    const _fillFormValues =  async (shape: Object, expression: Object, value: String = '') => {
        let isNew = value === '';

        if (isLink(expression.valueExpr)) {

            let linkValue = value;

            if (value === '') {

                linkValue = createIdNode();
            }


            const childExpression = await _fillFormData(
                {
                    id: expression.valueExpr,
                    linkValue,
                    parentSubject:
                    expression.predicate,
                    annotations:
                    expression.annotations
                },
                value === '' ? '' : data[value]
            );
            const dropDownValues = isDropDown( childExpression );

            const currentSubject = dropDownValues ? shape.linkValue || documentUri : shape.parentSubject;

            return  {
                ...expression,
                _formValues: [
                ...expression._formValues,
                {
                    id: childExpression.id,
                    type: childExpression.type,
                    ...dropDownValues,
                    _formFocus: getFormFocusObject(
                        currentSubject,
                        linkValue,
                        expression.annotations, isNew),
                    expression: childExpression.expression
                }]
            };


        }

        return  {
            ...expression,
            _formValues: [
                ...expression._formValues,
                {
                    ...expression.valueExpr,
                    _formFocus: getFormFocusObject(
                        shape.linkValue ||
                        documentUri,
                        value,
                        expression.annotations,
                        isNew
                    )
                }
            ]
        };
    }


    const _fillFormData = async (rootShape: Object, document: Object) => {
        const currentShape = shapes.find(shape => shape.id.includes(rootShape.id));
        let newExpressions = [];

        if (currentShape && currentShape.expression) {
            for await (let currentExpression of currentShape.expression.expressions) {
                let newExpression = {...currentExpression};

                if (!newExpression._formValues) {
                    newExpression._formValues = [];
                }

                if (typeof document !== 'string' && documentUri) {
                    for await (let node of document[currentExpression.predicate]) {
                        const value = node.value;
                        newExpression = await _fillFormValues(rootShape, newExpression, value);
                    }
                }

                if (newExpression._formValues.length === 0) {
                    newExpression = await _fillFormValues(rootShape, newExpression);
                }

                newExpressions = [...newExpressions, newExpression];
            }
        }
        const newShape = {...currentShape, expression: { expressions: newExpressions}}
        return newShape;
    }


    const toShexJS = useCallback(async () => {
        const shexString = await fetchShex();
        const parser = shexParser.construct(window.location.href);
        const podDocument = await fetchDocument();
        const shexJ = shexCore.Util.AStoShExJ(parser.parse(shexString));

        shapes = shexJ.shapes;

        if (shapes.length > 0) {
            const formData = await _fillFormData(
                { id: findRootShape(shexJ) },
                podDocument
            );
            setShexData({ shexJ, formData });
        }
    });

    useEffect(() => {
        toShexJS();
    }, [fileShex, documentUri]);

    return {
        shexData,
        addNewExpression,
        onUpdateShexJ
    };
};

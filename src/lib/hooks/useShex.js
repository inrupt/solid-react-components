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

    const addNewShexField = (expression: Object, parentExpresion: Object) => {
        const { formData, shexJ } = shexData;
        const newFormData = _addShexJField(formData, expression, parentExpresion);

        setShexData({ shexJ, formData: {...formData, expression: { expressions: newFormData }}});
    }

    const updateShexJ = (key: String, action: String, data: ?Object) => {
        const { formData, shexJ } = shexData;
        const newFormData = _updateShexJ(formData, action, { key, data });

        setShexData({shexJ, formData: {...formData, expression: {expressions: newFormData}}});
    }

    const _fetchDocument = async () => {
        const document = await data[documentUri];

        return document;
    };

    const _isLink = valueExpr => {
        return typeof valueExpr === 'string' || null;
    };

    const _fieldValue = (annotations: Array<Object>, value: String) => {
        const hasPrefix = findAnnotation('layoutprefix', annotations);
        if (hasPrefix && typeof value == 'string') {
            return value.split(hasPrefix.object.value).pop();
        }

        return value;
    };
    const _findRootShape = (shexJ: Object) => {
        return shexJ.start.split('#').pop();
    };


    const _getFormFocusObject = (
        subject: String,
        valueEx: String,
        annotations?: Array<Object>,
        isNew: boolean,
    ) => {
        let value = valueEx;
        if (annotations) {
            value = _fieldValue(annotations, valueEx);
        }

        return subject
            ? { value, parentSubject: subject, name: unique(), isNew }
            : { value, name: unique(), isNew };
    };

    const _isDropDown = (expression: Object) => {
        if (Array.isArray(expression.values)) {
            return { values: expression.values };
        }
        return null;
    }

    const _createIdNode = () => {
        const id = `${documentUri.split('#')[0]}#id${Date.parse (new Date ())}`;
        return id;
    }


    const _copyChildExpression = (expressions: Array<Object>, linkId: String) => {
        return expressions.map(expression => {
            if (expression.valueExpr) {
                const childExpression =  _copyChildExpression(expression._formValues, linkId);

                return {
                    ...expression,
                    _formValues: childExpression
                }
            }

            return _createField(expression, false, linkId);
        });
    }

    const _createField = (expression: Object, isLink: boolean = false) => {
        const name = unique();
        const value = isLink ? _createIdNode() : '';
        let childExpressions;

        if (expression.expression && expression.expression.expressions) {
            const { expression: { expressions }} = expression;

            childExpressions = _copyChildExpression(expressions, value);
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

    /*
     * Find into ShexJ same field then copy in the same expression and then update it with
     * custom name and value
     * and update _formFocus with new value and name
     * @params {Object} ShexJ Object
     * @params {currentExpression}
     * @params {parentExpresion}
     */
    const _addShexJField = ( shexJ: Object, currentExpression: Object, parent: ?Object) => {
      let newExpressions = shexJ.expression.expressions;

      for (let i = 0; i < newExpressions.length; i++) {
        if (
          newExpressions[i] &&
          (newExpressions[i].predicate === currentExpression.predicate ||
            (parent && newExpressions[i].predicate === parent.predicate) ||
            newExpressions[i].predicate === currentExpression.id)
        ) {
          newExpressions[i] = {
            ...newExpressions[i],
            _formValues: [
              ...newExpressions[i]._formValues,
              _createField(newExpressions[i]._formValues[0])
            ]
          };

          break;
        }

        if (
          _isLink(newExpressions[i].valueExpr) ||
          !newExpressions[i].predicate
        ) {
          for (let y = 0; y < newExpressions[i]._formValues.length; y++) {
            if (
              newExpressions[i]._formValues[y].expression &&
              newExpressions[i]._formValues[y].expression.expressions
            ) {
              const expressions = _addShexJField(
                newExpressions[i]._formValues[y],
                currentExpression,
                parent
              );

              newExpressions[i]._formValues[
                y
              ].expression.expressions = expressions;
              break;
            }
          }
        }
      }
      return newExpressions;
    };


    /*
     * Find into shexJ a _formValue (_formFocus) by name(unique id) then you can update _formFocus
     * or delete a _formValues
     * @params {Object} Shape
     * @params {String} action, could be delete or update
     * @params {Object} could be { key, data } where key is the _formFocus name( input name) and data
     * is the attributes that you want to update on _formFocus.
    */
    const _updateShexJ = (shape: Object, action: String, options: Object) => {
        let newExpressions = shape.expression.expressions;

        for (let i = 0; i < newExpressions.length; i++) {
            for (let y = 0; y < newExpressions[i]._formValues.length; y++) {

                if (newExpressions[i]._formValues[y]._formFocus.name === options.key) {

                    if (action === 'delete') {
                        newExpressions[i]._formValues.splice(y, y + 1);
                    } else  {
                        newExpressions[i]._formValues[y] = {
                            ...newExpressions[i]._formValues[y],
                            _formFocus: {
                                ...newExpressions[i]._formValues[y]._formFocus,
                                ...options.data
                            }
                        };
                    }
                    break;
                }

                if (newExpressions[i]._formValues[y].expression && newExpressions[i]._formValues[y].expression.expressions) {
                    const expressions =_updateShexJ(newExpressions[i]._formValues[y], action, options);

                    newExpressions[i]._formValues[y].expression.expressions = expressions;
                }
            }
        }
        return newExpressions;
    };


    const _fillFormValues =  async (shape: Object, expression: Object, value: String = '') => {
        let isNew = value === '';

        if (_isLink(expression.valueExpr)) {

            let linkValue = value;

            if (value === '') {

                linkValue = _createIdNode();
            }


            const childExpression = await _fillFormData(
                {
                    id: expression.valueExpr,
                    linkValue,
                    parentSubject:
                    linkValue !== '' ? linkValue : expression.predicate,
                    annotations:
                    expression.annotations
                },
                value === '' ? '' : data[value]
            );
            const dropDownValues = _isDropDown( childExpression );

            const currentSubject = dropDownValues ? shape.linkValue || documentUri : shape.parentSubject;

            return  {
                ...expression,
                _formValues: [
                    ...expression._formValues,
                    {
                        id: childExpression.id,
                        type: childExpression.type,
                        ...dropDownValues,
                        _formFocus: _getFormFocusObject(
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
                    _formFocus: _getFormFocusObject(
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
        const podDocument = await _fetchDocument();
        const shexJ = shexCore.Util.AStoShExJ(parser.parse(shexString));

        shapes = shexJ.shapes;

        if (shapes.length > 0) {
            const formData = await _fillFormData(
                { id: _findRootShape(shexJ) },
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
        addNewShexField,
        updateShexJ
    };
};

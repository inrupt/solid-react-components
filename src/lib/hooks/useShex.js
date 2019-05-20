import { useCallback, useState, useEffect } from 'react';
import data from '@solid/query-ldflex';
import shexParser from '@shexjs/parser';
import shexCore from '@shexjs/core';
import unique from 'unique-string';
import ldflex from "@solid/query-ldflex";
import { namedNode } from "@rdfjs/data-model";
import {
  findAnnotation,
  SolidError,
  fetchLdflexDocument,
  fetchSchema,
  shexParentLinkOnDropDowns,
  solidResponse,
  ShexFormValidator
} from "@utils";
import { Expression, Annotation, ShexJ, Shape } from "@entities";

type Options = {
    key: String,
    data: ?Object
}

export const useShex = (fileShex: String, documentUri: String, rootShape: String, errorCallback: ?() => void) => {
    const [shexData, setShexData] = useState({});
    const [shexError, setShexError] = useState(null);
    const [formValues, setFormValues] = useState({});
    let shapes = [];
    let seed = 1;


    const addNewShexField = useCallback((expression: Expression, parentExpresion: Expression) => {
        try {
            const {formData, shexJ} = shexData;
            const newFormData = _addShexJField(formData, expression, parentExpresion);

            setShexData({shexJ, formData: {...formData, expression: {expressions: newFormData}}});
        } catch(error) {
            onError(error);
        }
    });

    const updateShexJ = useCallback((key: String, action: String, data: ?Object) => {
        try {
            const {formData, shexJ} = shexData;
            const newFormData = _updateShexJ(formData, action, {key, data});

            setShexData({shexJ, formData: {...formData, expression: {expressions: newFormData}}});
        } catch(error) {
            onError(error);
        }
    });


    const onError = useCallback((error: Object) => {
        setShexError(error);
    });

    const _isLink = useCallback(valueExpr => {
        return typeof valueExpr === 'string' || null;
    });

    const _fieldValue = useCallback((annotations: Array<Annotation>, value: String) => {
        const hasPrefix = findAnnotation('layoutprefix', annotations);
        if (hasPrefix && typeof value == 'string') {
            return value.split(hasPrefix.object.value).pop();
        }

        return value;
    });

    /*
     * Find root shape from shexJ
     */
    const _findRootShape = useCallback((shexJ: ShexJ) => {
        try {
            return rootShape || shexJ.start.split('#').pop();
        } catch (error) {
            onError(error);
        }
    });

    /*
     * Create new object (_formFocus) with unique name, value
     */
    const _getFormFocusObject = useCallback((
        subject: String,
        parentPredicate,
        valueEx: String,
        annotations?: Array<Object>,
        isNew: boolean,
    ) => {
        let value = valueEx;
        if (annotations) {
            value = _fieldValue(annotations, valueEx);
        }

        return subject
            ? { value, parentSubject: subject, parentPredicate, name: unique(), isNew }
            : { value, name: unique(), isNew };
    });

    /*
     * Check if expression is an drop down when values comes.
     */
    const _isDropDown = useCallback((expression: Expression) => {
        if (Array.isArray(expression.values)) {
            return { values: expression.values };
        }
        return null;
    });

    /*
     * Create a unique Node Id (Link)
     */
    const _createIdNode = useCallback(() => {
        const randomId = Date.parse (new Date ()) + (seed++);
        const doc = documentUri || 'https://example.org';
        const id = `${doc.split('#')[0]}#id${randomId}`;

        return id;
    });


    const _copyChildExpression = useCallback((expressions: Array<Expression>, linkId: String) => {
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
    });

    const _createField = useCallback((expression: Expression, isLink: boolean, parentSubject: Object) => {
        const id = isLink || _createIdNode();
        let newExpression;

        if (expression.expression && expression.expression.expressions) {
            const updatedExp = expression.expression.expressions.map(exp => {
                const newExpr = exp._formValues.map(frm => {
                    return _createField(frm, false, { parentSubject: id });
                });
                // Copied only one formValue.
                return {...exp, _formValues: [newExpr[0]]};
            });

            newExpression = { expression: { expressions: updatedExp }};
        }

        return {
            ...expression,
            ...newExpression,
            _formFocus: {
                ...expression._formFocus,
                ...parentSubject,
                name: unique(),
                value: newExpression ? id : '',
                isNew: true
            }
        };
    });

    /*
     * Find into ShexJ same field then copy in the same expression and then update it with
     * custom name and value
     * and update _formFocus with new value and name
     * @params {Object} ShexJ Object
     * @params {currentExpression}
     * @params {parentExpresion}
     */
    const _addShexJField = useCallback(( shexJ: ShexJ, currentExpression: Expression, parent: ?Object) => {
        try {
            let newExpressions = shexJ.expression.expressions;

            for (let i = 0; i < newExpressions.length; i++) {
                if (
                    !parent &&
                    (newExpressions[i].predicate === currentExpression.predicate ||
                        newExpressions[i].predicate === currentExpression.id)
                ) {

                    newExpressions[i] = {
                        ...newExpressions[i],
                        _formValues: [
                            ...newExpressions[i]._formValues,
                            _createField(newExpressions[i]._formValueClone)
                        ]
                    };

                    break;
                }

                if (_isLink(newExpressions[i].valueExpr) || !newExpressions[i].predicate) {
                    for (let y = 0; y < newExpressions[i]._formValues.length; y++) {
                        if (currentExpression._formFocus &&
                            newExpressions[i]._formValues[y]._formFocus.value === currentExpression._formFocus.value) {

                            newExpressions[i] = {
                                ...newExpressions[i],
                                _formValues: [
                                    ...newExpressions[i]._formValues,
                                    _createField(newExpressions[i]._formValueClone)
                                ]
                            };
                            break;

                        } else if (
                            newExpressions[i]._formValues[y].expression &&
                            newExpressions[i]._formValues[y].expression.expressions
                        ) {

                            const expressions = _addShexJField(
                                newExpressions[i]._formValues[y],
                                currentExpression,
                                parent
                            );

                            newExpressions[i]._formValues[y].expression.expressions = expressions;
                        }
                    }
                }
            }
            return newExpressions;
        } catch (error) {
            onError(error);
        }
    });


    /*
     * Find into shexJ a _formValue (_formFocus) by name(unique id) then you can update _formFocus
     * or delete a _formValues
     * @params {Object} Shape
     * @params {String} action, could be delete or update
     * @params {Object} could be { key, data } where key is the _formFocus name( input name) and data
     * is the attributes that you want to update on _formFocus.
    */
    const _updateShexJ = useCallback((shape: Shape, action: String, options: Options) => {
        try {
            let newExpressions = shape.expression.expressions;

            for (let i = 0; i < newExpressions.length; i++) {
                for (let y = 0; y < newExpressions[i]._formValues.length; y++) {

                    if (newExpressions[i]._formValues[y]._formFocus.name === options.key) {
                        if (action === 'delete') {
                            const _formValues = newExpressions[i]._formValues;
                            const currentFieldName = newExpressions[i]._formValues[y]._formFocus.name;

                            newExpressions[i]._formValues = _formValues.filter(val => val._formFocus.name !== currentFieldName);

                        } else {
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
                        const expressions = _updateShexJ(newExpressions[i]._formValues[y], action, options);

                        newExpressions[i]._formValues[y].expression.expressions = expressions;
                    }
                }
            }
            return newExpressions;
        } catch (error) {
            onError(error);
        }
    });


    const _fillFormValues =  useCallback(async (shape: Shape, expression: Expression, value: String = '') => {
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
                    parentSubject: linkValue,
                    parentPredicate: expression.predicate,
                    annotations:
                    expression.annotations
                },
                value === '' ? '' : data[value]
            );
            const dropDownValues = _isDropDown( childExpression );

            const currentSubject = dropDownValues ? shape.linkValue || documentUri : shape.parentSubject;
            const _formValues = [
                ...expression._formValues,
                {
                    id: childExpression.id,
                    type: childExpression.type,
                    ...dropDownValues,
                    _formFocus: _getFormFocusObject(
                        currentSubject || documentUri,
                        expression.predicate,
                        linkValue,
                        expression.annotations, isNew),
                    expression: childExpression.expression
                }];

            return  {
                ...expression,
                _formValues: _formValues,
                _formValueClone: _formValues[0]
            };


        }
        const _formValues = [
            ...expression._formValues,
            {
                ...expression.valueExpr,
                _formFocus: _getFormFocusObject(
                    shape.linkValue ||
                    documentUri,
                    shape.parentPredicate,
                    value,
                    expression.annotations,
                    isNew
                )
            }
        ];

        return  {
            ...expression,
            _formValues: _formValues,
            _formValueClone: _formValues[0]
        };
    });


    const _fillFormData = useCallback(async (rootShape: Object, document: Object) => {
        const currentShape = shapes.find(shape => shape.id.includes(rootShape.id));
        let newExpressions = [];

        if (currentShape && currentShape.expression) {
            if (currentShape.expression.expressions) {
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
            } else if(currentShape.expression.type) {
                let newExpression = {...currentShape.expression};

                if (!newExpression._formValues) {
                    newExpression._formValues = [];
                }

                if (typeof document !== 'string' && documentUri) {
                    for await (let node of document[newExpression.predicate]) {
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
    });


    const toShexJForm = useCallback(async () => {
        try {
            const parser = shexParser.construct(window.location.href);
            const shexString = await fetchSchema(fileShex);
            const podDocument = await fetchLdflexDocument(documentUri);

            if (shexString.status && shexString.status !== 200) {
                throw shexString;
            }

            if (!podDocument.subject && podDocument.status !== 200) {
                throw podDocument;
            }

            const shexJ = shexCore.Util.AStoShExJ(parser.parse(shexString));

            shapes = shexJ.shapes;

            if (shapes.length > 0) {
                const formData = await _fillFormData(
                    {id: _findRootShape(shexJ)},
                    podDocument
                );
                setShexData({shexJ, formData});
            }
        } catch (error) {
            let solidError = error;

            if (!error.status && !error.code) {

                solidError = new SolidError(solidError.message, 'Ldflex Error', 500);
            }
            errorCallback(solidError);
            onError(solidError);
        }
    });

    const onChange = (e: Event) => {
        const { value, name } = e.target;
        const defaultValue = e.target.getAttribute('data-default');
        const action = defaultValue === '' ? 'create' : value === '' ? 'delete' : 'update';

        const dataObj = JSON.parse(e.target.getAttribute('data-obj'));

        const data = {
            [e.target.name]: {
                value,
                name,
                action,
                defaultValue,
                ...dataObj
            }
        };
        setFormValues({ ...formValues, ...data });
    };

    const _create = async field => {
        const { subject, predicate, value } = field;
        if (field.parentSubject) await _createLink(field);
        await ldflex[subject][predicate].add(value);
    };

    const _createLink = async field => {
        const { subject, parentPredicate, parentSubject } = field;
        const id = `#${subject.split("#").pop()}`;
        await ldflex[parentSubject][parentPredicate].add(namedNode(id));
    };

    const _setFieldValue = (value: String, prefix: ?String) =>
        prefix ? namedNode(`${prefix}${value}`) : value;

    const _deleteLink = async shexj => {
        const { parentSubject, value: subject, parentPredicate } = shexj._formFocus;
        const expressions = shexj.expression.expressions;
        const { _formFocus } = shexj;
        try {
            if (_formFocus && !_formFocus.isNew) {
                for (let expression of expressions) {
                    const value = await ldflex[subject][expression.predicate];
                    if (value) await ldflex[subject][expression.predicate].delete();
                }
                await ldflex[parentSubject][parentPredicate].delete(ldflex[subject]);
            }
        } catch (e) {
            throw e;
        }
    };

    const onDelete = async (shexj: ShexJ, parent: any = false) => {
        try {
            const { _formFocus } = shexj;
            const { parentSubject, name, value, isNew } = _formFocus;
            if (_formFocus && !isNew) {
                if (shexParentLinkOnDropDowns(parent, shexj)) {
                    await _deleteLink(shexj);
                } else {
                    const predicate = shexj.predicate || shexj._formFocus.parentPredicate;

                    await ldflex[parentSubject][predicate].delete(value);
                }
            }
            // Delete field from formValues object
            const { [name]: omit, ...res } = formValues;
            setFormValues(res);

            // Delete expression from ShexJ
            updateShexJ(name, "delete");

            return solidResponse(200,'Form submitted successfully');
        } catch (error) {
            let solidError = error;

            if (!error.status && !error.code ) {
                solidError = new SolidError(error.message, 'Ldflex Error', 500);
            }
            return solidError;
        }
    };

    const onReset = () => {
        setFormValues({});
    }

    const saveForm = async (key: String) => {
        try {
            let value = formValues[key].value;
            let defaultValue = formValues[key].defaultValue;

            // @TODO: find a better way to see if value is a predicate.
            if (value.includes('#')) {
                value = namedNode(value);
                defaultValue = namedNode(defaultValue);
            }

            const field = {
                ...formValues[key],
                value: _setFieldValue(
                    value,
                    formValues[key].prefix
                ),
                defaultValue: _setFieldValue(
                    defaultValue,
                    formValues[key].prefix
                )
            };
            switch (field.action) {
                case "update":
                    await ldflex[field.subject][field.predicate].replace(
                        field.defaultValue,
                        field.value
                    );
                    break;
                case "create":
                    await _create(field);
                    break;
                case "delete":
                    await ldflex[field.subject][field.predicate].delete(
                        field.defaultValue
                    );
                    break;
                default:
                    break;
            }

            // If save field was successful we update expression and parentExpression.
            updateExpression(key);

            return solidResponse(200, 'Form submitted successfully');

        } catch (error) {
            return error;
        }
    };


    const onSubmit = async (e: Event) => {
        try {
            if (!documentUri || documentUri === "") {
                throw Error("Document Uri is required");
            }
            e.preventDefault();
            const validator = new ShexFormValidator(formValues);
            const { isValid, updatedFields } = validator.validate();
            const keys = Object.keys(formValues);

            if (isValid && keys.length > 0) {

                for await (const key of keys) {
                    const result = await saveForm(key);

                    if (result.code !== 200) {
                        throw new SolidError(result.message, 'Error saving on Pod');
                    }
                }

                setFormValues({});

                return solidResponse(200, 'Form submitted successfully');

            } else {
                setFormValues({...updatedFields});

                if (keys.length !== 0) {
                    throw new SolidError('Please ensure all values are in a proper format.', 'ShexForm', 406);
                }
            }

        } catch (error) {
            let solidError = error;

            if (!error.status && !error.code ) {
                solidError = new SolidError(error.message, 'Ldflex Error', 500);
            }
            return solidError;
        }
    };

    const updateExpression = (key: String) => {
        const { name, parentName } = formValues[key];

        updateShexJ(name, "update", {
            isNew: false,
            value: formValues[key].value
        });

        updateShexJ(parentName, "update", {
            isNew: false
        });
    }

    useEffect(() => {
        toShexJForm();

    }, [fileShex, documentUri]);

    return {
        shexData,
        shexError,
        addNewShexField,
        updateShexJ,
        formValues,
        onSubmit,
        onDelete,
        onChange,
        saveForm,
        onReset
    };
};

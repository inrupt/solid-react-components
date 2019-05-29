import { useCallback, useState, useEffect } from "react";
import shexParser from "@shexjs/parser";
import shexCore from "@shexjs/core";
import unique from "unique-string";
import ldflex from "@solid/query-ldflex";
import { namedNode } from "@rdfjs/data-model";
import { Expression, ShexJ, Shape } from "@entities";
import {
  SolidError,
  fetchLdflexDocument,
  fetchSchema,
  solidResponse,
  ShexFormValidator,
  shexUtil
} from "@utils";

type Options = {
    key: String,
    data: ?Object
}

let ownerUpdate = false;

export const useShex = (fileShex: String, documentUri: String, rootShape: String, options: Object) => {
    const { errorCallback, timestamp } = options;
    const [shexData, setShexData] = useState({});
    const [shexError, setShexError] = useState(null);
    let shapes = [];
    let seed = 1;

    const addNewShexField = useCallback((expression: Expression, parentExpresion: Expression) => {
        const { formData, shexJ } = shexData;
        const newFormData =  shexUtil.mapFormValues(formData, (formValue, currentExpression) => {
            const {_formValues } = expression;

            if (_formValues[_formValues.length - 1]._formFocus.name === formValue._formFocus.name) {
                if (!parentExpresion && expression.predicate === currentExpression.predicate) {
                    return [formValue, _createField(expression._formValueClone)];
                }
            }
            return formValue;
        });

        setShexData({shexJ, formData: { ...formData, expression: {expressions: newFormData }}});
    });


    const updateShexJ = useCallback((options: Options, action: String) => {
        const { formData, shexJ, formValues } = shexData;
        const newFormData =  shexUtil.mapFormValues(formData, formValue => {
            if (options.parent && formValue._formFocus.name === options.parent.key) {

                return {
                    ...formValue,
                    _formFocus: {
                        ...formValue._formFocus,
                        ...options.parent.data
                    }
                };
            }

            if (formValue._formFocus.name === options.key) {
                if (action === 'delete') {
                    return null;
                } else {
                    return {
                        ...formValue,
                        _formFocus: {
                            ...formValue._formFocus,
                            ...options.data
                        }
                    };
                }
            }
            return formValue;
        });

        if (action === 'delete' || options.onSave) {
            if (formValues) {
                // Delete field from formValues object
                const { [options.key]: omit, ...res } = formValues;

                return setShexData({ shexJ, formValues: res, formData: {
                    ...formData, expression: {
                        expressions: newFormData
                    }
                }});
            }
        }

        return setShexData({ shexJ, formValues, formData: {
            ...formData, expression: {
                expressions: newFormData
            }
        }});
    });


    const onError = useCallback((error: Object) => {
        setShexError(error);
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
        isNew: boolean
    ) => {
        let value = valueEx;
        if (annotations) {
            value = shexUtil.renderFieldValue(annotations, valueEx);
        }

        return subject
            ? { value, parentSubject: subject, parentPredicate, name: unique(), isNew }
            : { value, name: unique(), isNew };
    });

    const _createField = useCallback((expression: Expression, isLink: boolean, parentSubject: Object) => {
        const id = isLink || shexUtil.createIdNode(documentUri, seed);
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

    const expressionChanged = (name: Object, value: any) => {
        const { formValues } = shexData;
        if (formValues && Object.keys(formValues).length > 0) {
            if (formValues[name]) {
                if (formValues[name].value.trim() !== value.trim()) {
                    formValues[name].defaultValue = value;
                    formValues[name].error = `Field value has been update to: ${shexUtil.cleanValue(value)}`;
                } else {
                    formValues[name].defaultValue = value;
                    formValues[name].value = value;
                    formValues[name].error = null;
                }
            }
        }

       return formValues;
    };

    const updatesListener = async () => {
        const { formData, shexJ } = shexData;
        let updatedFormValue = {};


            const updatedFormData = await shexUtil.mapExpFormValues(formData.expression, (_formValue, _formValues, value) => {
                updatedFormValue = expressionChanged(_formValue._formFocus.name, value);

                const expression = {
                    ..._formValue,
                    _formFocus: {
                        ..._formValue._formFocus,
                        value,
                        error: updatedFormValue.error || null
                    }
                }

                return expression;
            }, documentUri);

            setShexData({
                shexJ,
                formValues: updatedFormValue,
                formData: {...formData, expression: {
                    expressions: updatedFormData}
                }
            });

    }

    const _fillFormValues =  useCallback(async (shape: Shape, expression: Expression, value: String = '') => {
        let isNew = value === '';

        if (shexUtil.isExpressionLink(expression.valueExpr)) {

            let linkValue = value;

            if (value === '') {

                linkValue = shexUtil.createIdNode(documentUri, seed);
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
                value === '' ? '' : ldflex[value]
            );
            const dropDownValues = shexUtil.isExpressionDropDown( childExpression );

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

                setShexData({shexJ, formValues: {}, formData});
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
        const data = {
            [e.target.name]: {
                value,
                name,
                action,
                defaultValue,
                predicate: e.target.getAttribute('data-predicate'),
                subject: e.target.getAttribute('data-subject'),
                prefix: e.target.getAttribute('data-prefix'),
                parentPredicate: e.target.getAttribute('data-parent-predicate'),
                parentSubject: e.target.getAttribute('data-parent-subject'),
                valueExpr: JSON.parse(e.target.getAttribute('data-valuexpr')),
                parentName: e.target.getAttribute('data-parent-name')
            }
        };
        setShexData({...shexData, formValues: { ...shexData.formValues, ...data} })
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
            ownerUpdate = true;

            const { _formFocus } = shexj;
            const { parentSubject, name, value, isNew } = _formFocus;
            if (_formFocus && !isNew) {
                if (shexUtil.parentLinkOnDropDowns(parent, shexj)) {
                    await _deleteLink(shexj);
                } else {
                    const predicate = shexj.predicate || shexj._formFocus.parentPredicate;

                    await ldflex[parentSubject][predicate].delete(value);
                }
            }

            // ownerUpdate = false;

            // Delete expression from ShexJ
            updateShexJ({ key: name}, "delete");

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
        setShexData({...shexData, formValues: {}});
    }

    const saveForm = async (key: String, autoSave: ?boolean) => {
        try {
            ownerUpdate = true;
            const { formValues } = shexData;
            let value = formValues[key].value;
            let defaultValue = formValues[key].defaultValue;
            let originalValue = value;
            let validate;

            if (autoSave) {
                const validator = new ShexFormValidator(formValues);
                validate = validator.validate();
            }
            const keys = Object.keys(formValues);

            if ((validate.isValid && keys.length > 0) || !autoSave) {
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
                updateExpression(key, originalValue);

                return solidResponse(200, 'Form submitted successfully');
            } else {
                setShexData({...shexData, formValues: validate.updatedFields});

                if (keys.length !== 0) {
                    throw new SolidError('Please ensure all values are in a proper format.', 'ShexForm', 406);
                }
            }

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
            const validator = new ShexFormValidator(shexData.formValues);
            const { isValid, updatedFields } = validator.validate();
            const keys = Object.keys(shexData.formValues);

            if (isValid && keys.length > 0) {

                for await (const key of keys) {
                    const result = await saveForm(key);

                    if (result.code !== 200) {
                        throw new SolidError(result.message, 'Error saving on Pod');
                    }
                }

                return solidResponse(200, 'Form submitted successfully');

            } else {
                setShexData({...shexData, formValues: updatedFields});

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

    const updateExpression = (key: String, value: Any) => {
        const { parentName } = shexData.formValues[key];

        updateShexJ({ key, data: {
            isNew: false,
            value
        }, parent: {
            key: parentName, data: {
                isNew: false
            }
        }, onSave: true}, "update");
    }

    useEffect(() => {
       if (!timestamp) {
           toShexJForm();
       } else if (!ownerUpdate) {
           updatesListener();
       }

       ownerUpdate = false;
    }, [fileShex, documentUri, timestamp]);

    return {
        shexData,
        shexError,
        addNewShexField,
        updateShexJ,
        onSubmit,
        onDelete,
        onChange,
        saveForm,
        onReset
    };
};

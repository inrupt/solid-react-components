import { useCallback, useState, useEffect } from 'react';
import shexParser from '@shexjs/parser';
import shexCore from '@shexjs/core';
import unique from 'unique-string';
import ldflex from '@solid/query-ldflex';
import { namedNode } from '@rdfjs/data-model';
import { Expression, ShexJ, Shape, Annotation } from '@entities';
import {
  SolidError,
  fetchLdflexDocument,
  fetchSchema,
  solidResponse,
  ShexFormValidator,
  shexUtil
} from '@utils';

type Options = {
  key: String,
  data: ?Object
};

let ownerUpdate = false;

const useShex = (
  fileShex: String,
  documentUri: String,
  rootShape: String,
  options: Object
) => {
  const { errorCallback, timestamp, languageTheme } = options;
  const [shexData, setShexData] = useState({});
  let shapes = [];
  const seed = 1;

  /**
   * Add a new field into form using mapFormValues(recursive function) function from shex utils
   * @param { Expression } expression shexJ object
   * @param { Expression } parentExpression parent ShexJ object
   *
   */
  const addNewShexField = useCallback(
    (expression: Expression, parentExpresion: Expression) => {
      const { formData, shexJ } = shexData;
      const newFormData = shexUtil.mapFormValues(
        formData,
        (formValue, currentExpression, index) => {
          const { _formValues } = expression;
          if (_formValues.length - 1 === index) {
            if (
              !parentExpresion &&
              expression.predicate === currentExpression.predicate
            ) {
              return [
                formValue,
                shexUtil.createField(expression._formValueClone, documentUri, {
                  documentUri,
                  seed
                })
              ];
            }
          }
          return formValue;
        }
      );

      setShexData({
        shexJ,
        formData: { ...formData, expression: { expressions: newFormData } }
      });
    }
  );

  /**
   * Update, Delete a field into ShexJ object using mapFormValues(recursive function) function from shex utils
   * @param { Options } options custom options like key or name of the field
   * @param { String } action to delete or update
   *
   */
  const updateShexJ = useCallback((options: Options, action: String) => {
    const { formData, shexJ, formValues } = shexData;
    const newFormData = shexUtil.mapFormValues(formData, formValue => {
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
        }
        return {
          ...formValue,
          _formFocus: {
            ...formValue._formFocus,
            ...options.data
          }
        };
      }
      return formValue;
    });

    if (action === 'delete' || options.onSave) {
      if (formValues) {
        // Delete field from formValues object
        const { [options.key]: omit, ...res } = formValues;

        return setShexData({
          shexJ,
          formValues: res,
          formData: {
            ...formData,
            expression: {
              expressions: newFormData
            }
          }
        });
      }
    }

    return setShexData({
      shexJ,
      formValues,
      formData: {
        ...formData,
        expression: {
          expressions: newFormData
        }
      }
    });
  });

  /**
   * Find the root shape from shexJ object
   * @param {ShexJ} shexJ object
   */
  const _findRootShape = useCallback((shexJ: ShexJ) => {
    try {
      return rootShape || shexJ.start.split('#').pop();
    } catch (error) {
      return error;
    }
  });

  /**
   * Create new object (_formFocus) with unique name, value etc. This is using into _FormValues
   * @param {String} subject the Node of the subject
   * @param {String} parentPredicate the parent NamedNode of the predicate
   * @param {String} valueEx the type of the Node
   * @param {Array} annotations comments, notes, explanations, or other types of external
   * remarks that can be attached to a Web document or to a selected part of a document
   * @param {boolean} isNew flag to check if field is not saved on POD yet
   */
  const _createFormFocus = useCallback(
    (
      subject: String,
      parentPredicate,
      valueEx: String,
      annotations?: Array<Annotation>,
      isNew: boolean
    ) => {
      let value = valueEx;
      if (annotations) {
        value = shexUtil.renderFieldValue(annotations, valueEx);
      }

      return subject
        ? {
            value,
            parentSubject: subject,
            parentPredicate,
            name: unique(),
            isNew
          }
        : { value, name: unique(), isNew };
    }
  );

  /**
   * Check if a specific expression was updated or not, if was updated we add an warning message
   * to show user that field value was updated and also we update defaultValue to avoid 409 errors
   *
   * @param { String } name field name that we want to check if was udpated or not;
   * @param { any } value new field value from POD;
   */
  const expressionChanged = useCallback((name: String, value: any) => {
    const { formValues } = shexData;
    if (formValues && Object.keys(formValues).length > 0) {
      const warningResolution =
        languageTheme.warningResolution || 'Field value has been updated to:';

      if (formValues[name]) {
        if (formValues[name].value.trim() !== value.trim()) {
          formValues[name].defaultValue = value;
          formValues[
            name
          ].warning = `${warningResolution} ${shexUtil.cleanValue(value)}`;
        } else {
          formValues[name].defaultValue = value;
          formValues[name].value = value;
          formValues[name].warning = null;
        }
      }
    }

    return formValues;
  });

  /**
   * Listener updates from POD document, if updates come from POD(websockets)
   * will run shexJ object and updates new field values
   */
  const updatesListener = useCallback(async () => {
    const { formData, shexJ } = shexData;
    let updatedFormValue = {};

    if (!ownerUpdate) {
      const updatedFormData = await shexUtil.mapExpFormValues(
        formData.expression,
        (_formValue, _formValues, value, parentUri) => {
          updatedFormValue = expressionChanged(
            _formValue._formFocus.name,
            value
          );
          const expression = {
            ..._formValue,
            _formFocus: {
              ..._formValue._formFocus,
              isNew: false,
              parentSubject: parentUri,
              value,
              warning: (updatedFormValue && updatedFormValue.warning) || null
            }
          };

          return expression;
        },
        documentUri
      );

      setShexData({
        shexJ,
        formValues: updatedFormValue,
        formData: {
          ...formData,
          expression: {
            expressions: updatedFormData
          }
        }
      });
    } else {
      ownerUpdate = false;
    }
  });

  /**
   * Fill _formValues attribute from expression into shexJ object
   * @param {Shape} shape an shexJ object from shex.
   * @param {Expression} expression object that has predicate, subject and object
   */
  const _fillFormValues = useCallback(
    async (shape: Shape, expression: Expression, value: String = '') => {
      const isNew = value === '';

      if (shexUtil.isExpressionLink(expression.valueExpr)) {
        let linkValue = value;

        if (value === '') {
          linkValue = shexUtil.createIdNode(documentUri, seed);
        }

        // eslint-disable-next-line no-use-before-define
        const childExpression = await _fillFormData(
          {
            id: expression.valueExpr,
            linkValue,
            parentSubject: linkValue,
            parentPredicate: expression.predicate,
            annotations: expression.annotations
          },
          value === '' ? '' : ldflex[value]
        );
        const dropDownValues = shexUtil.isExpressionDropDown(childExpression);

        const currentSubject = dropDownValues
          ? shape.linkValue || documentUri
          : shape.parentSubject;
        const _formValues = [
          ...expression._formValues,
          {
            id: childExpression.id,
            type: childExpression.type,
            ...dropDownValues,
            _formFocus: _createFormFocus(
              currentSubject || documentUri,
              expression.predicate,
              linkValue,
              expression.annotations,
              isNew
            ),
            expression: childExpression.expression
          }
        ];

        return {
          ...expression,
          _formValues,
          _formValueClone: _formValues[0]
        };
      }
      const _formValues = [
        ...expression._formValues,
        {
          ...expression.valueExpr,
          _formFocus: _createFormFocus(
            shape.linkValue || documentUri,
            shape.parentPredicate,
            value,
            expression.annotations,
            isNew
          )
        }
      ];

      return {
        ...expression,
        _formValues,
        _formValueClone: _formValues[0]
      };
    }
  );

  /**
   * Add _formValues Array into each expressions from ShexJ object.
   * @param {Object} rootShape object that has the id of the shape that we want to render
   * @param {Object} ldflex function to save data into PODS
   */
  const _fillFormData = useCallback(
    async (rootShape: Object, document: Object) => {
      const currentShape = shapes.find(shape =>
        shape.id.includes(rootShape.id)
      );
      let newExpressions = [];

      if (currentShape && currentShape.expression) {
        if (currentShape.expression.expressions) {
          for await (const currentExpression of currentShape.expression
            .expressions) {
            let newExpression = { ...currentExpression };

            if (!newExpression._formValues) {
              newExpression._formValues = [];
            }

            if (typeof document !== 'string' && documentUri) {
              for await (const node of document[currentExpression.predicate]) {
                const { value } = node;
                newExpression = await _fillFormValues(
                  rootShape,
                  newExpression,
                  value
                );
              }
            }

            if (newExpression._formValues.length === 0) {
              newExpression = await _fillFormValues(rootShape, newExpression);
            }

            newExpressions = [...newExpressions, newExpression];
          }
        } else if (currentShape.expression.type) {
          let newExpression = { ...currentShape.expression };

          if (!newExpression._formValues) {
            newExpression._formValues = [];
          }

          if (typeof document !== 'string' && documentUri) {
            for await (const node of document[newExpression.predicate]) {
              const { value } = node;
              newExpression = await _fillFormValues(
                rootShape,
                newExpression,
                value
              );
            }
          }

          if (newExpression._formValues.length === 0) {
            newExpression = await _fillFormValues(rootShape, newExpression);
          }

          newExpressions = [...newExpressions, newExpression];
        }
      }
      const newShape = {
        ...currentShape,
        expression: { expressions: newExpressions }
      };
      return newShape;
    }
  );

  /**
   * init function to convert ShexJ object to ShexJForm (with _formValues and _formFocus objects)
   */
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

      // eslint-disable-next-line prefer-destructuring
      shapes = shexJ.shapes;

      if (shapes.length > 0) {
        const formData = await _fillFormData(
          { id: _findRootShape(shexJ) },
          podDocument
        );

        setShexData({ shexJ, formValues: {}, formData });
      }
    } catch (error) {
      let solidError = error;

      if (!error.status && !error.code) {
        solidError = new SolidError(solidError.message, 'Ldflex Error', 500);
      }
      errorCallback(solidError);
    }
  });
  /**
   * Update formValues object with new user field data
   * @param { Event } e event input
   */
  const onChange = useCallback((e: Event) => {
    const { value, name } = e.target;
    const defaultValue = e.target.getAttribute('data-default');
    const action =
      // eslint-disable-next-line no-nested-ternary
      defaultValue === '' ? 'create' : value === '' ? 'delete' : 'update';
    const data = {
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
    };
    const currentValue =
      shexData.formValues && shexData.formValues[e.target.name];

    /** keep warning message after onBlur */
    const mergedData = {
      [e.target.name]: {
        warning: currentValue && currentValue.warning,
        ...data
      }
    };

    setShexData({
      ...shexData,
      formValues: {
        ...shexData.formValues,
        ...mergedData
      }
    });
  });

  /**
   * Create a new Link Node on POD
   * @param { Object } field _formFocus expression
   */
  const _createLink = useCallback(async (field: Object) => {
    const { subject, parentPredicate, parentSubject } = field;
    const id = `#${subject.split('#').pop()}`;
    await ldflex[parentSubject][parentPredicate].add(namedNode(id));
  });

  /**
   * Create new Node into POD
   */
  const _create = useCallback(async field => {
    const { subject, predicate, value } = field;
    if (field.parentSubject) await _createLink(field);
    await ldflex[subject][predicate].add(value);
  });

  /**
   * Delete a new Line Node on POD
   * @param { ShexJ } shexJ object from Shex
   */
  const _deleteLink = useCallback(async (shexj: ShexJ) => {
    const { parentSubject, value: subject, parentPredicate } = shexj._formFocus;
    const { expressions } = shexj.expression;
    const { _formFocus } = shexj;
    try {
      if (_formFocus && !_formFocus.isNew) {
        for await (const expression of expressions) {
          const value = await ldflex[subject][expression.predicate];
          if (value) await ldflex[subject][expression.predicate].delete();
        }
        await ldflex[parentSubject][parentPredicate].delete(ldflex[subject]);
      }
    } catch (e) {
      throw e;
    }
  });

  /**
   *
   * Delete Nodes(fields) on POD
   * @param { ShexJ } shexJ object from Shex
   */
  const onDelete = useCallback(async (shexj: ShexJ, parent: any = false) => {
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

      // Delete expression from ShexJ
      updateShexJ({ key: name }, 'delete');

      return solidResponse(200, 'Form submitted successfully');
    } catch (error) {
      let solidError = error;

      if (!error.status && !error.code) {
        solidError = new SolidError(error.message, 'Ldflex Error', 500);
      }
      return solidError;
    }
  });

  /**
   *
   * Reset formValues object
   */
  const onReset = useCallback(() => {
    setShexData({ ...shexData, formValues: {} });
  });

  /**
   *
   * Update shexJ expressions when user save field on POD
   * @param {String} key or name of the field(expression)
   * @param { any } value for expression
   */
  const updateExpression = useCallback((key: String, value: Any) => {
    const { parentName } = shexData.formValues[key];

    updateShexJ(
      {
        key,
        data: {
          isNew: false,
          value
        },
        parent: {
          key: parentName,
          data: {
            isNew: false
          }
        },
        onSave: true
      },
      'update'
    );
  });

  /**
   *
   * Save fields on POD
   * @param {String} key or name of the field that will be save it on POD
   * @param {boolean} autoSave flag to validate field or not before save it on POD
   */
  const saveForm = useCallback(async (key: String, autoSave: ?boolean) => {
    try {
      ownerUpdate = true;

      const { formValues } = shexData;
      let { value } = formValues[key];
      let { defaultValue } = formValues[key];
      const originalValue = value;
      let validate;

      if (autoSave) {
        const validator = new ShexFormValidator(
          formValues,
          languageTheme.formValidate
        );
        validate = validator.validate();
      }
      const keys = Object.keys(formValues);

      if ((validate && validate.isValid && keys.length > 0) || !autoSave) {
        // @TODO: find a better way to see if value is a predicate.
        if (value.includes('#')) {
          value = namedNode(value);
          defaultValue = namedNode(defaultValue);
        }

        const field = {
          ...formValues[key],
          value: shexUtil.setFieldValue(value, formValues[key].prefix),
          defaultValue: shexUtil.setFieldValue(
            defaultValue,
            formValues[key].prefix
          )
        };
        switch (field.action) {
          case 'update':
            await ldflex[field.subject][field.predicate].replace(
              field.defaultValue,
              field.value
            );
            break;
          case 'create':
            await _create(field);
            break;
          case 'delete':
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
      }
      setShexData({ ...shexData, formValues: validate.updatedFields });

      if (keys.length !== 0) {
        throw new SolidError(
          'Please ensure all values are in a proper format.',
          'ShexForm',
          406
        );
      }
    } catch (error) {
      return error;
    }
  });

  /**
   *
   * Save all fields on submit(no autoSave)
   * @param {Event} e
   */
  const onSubmit = useCallback(async (e: Event) => {
    try {
      if (!documentUri || documentUri === '') {
        throw Error('Document Uri is required');
      }
      e.preventDefault();
      const validator = new ShexFormValidator(
        shexData.formValues,
        languageTheme.formValidate
      );
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
      }
      setShexData({ ...shexData, formValues: updatedFields });

      if (keys.length !== 0) {
        throw new SolidError(
          'Please ensure all values are in a proper format.',
          'ShexForm',
          406
        );
      }
    } catch (error) {
      let solidError = error;

      if (!error.status && !error.code) {
        solidError = new SolidError(error.message, 'Ldflex Error', 500);
      }
      return solidError;
    }
  });

  /**
   * check if field value was updated
   * @param value
   * @param defaultValue
   * @returns {boolean}
   */
  const isValueChanged = (value, defaultValue, key) => {
    /**
     * if current value is equals to defaultValue remove warning message.
     * */
    if (
      shexData &&
      shexData.formValues &&
      shexData.formValues[key] &&
      shexData.formValues[key].warning
    ) {
      if (value === defaultValue) {
        const { formValues } = shexData;
        formValues[key] = {
          ...formValues[key],
          value,
          warning: null
        };

        setShexData({ ...shexData, formValues });
      }
    }

    return value !== defaultValue;
  };

  useEffect(() => {
    if (!timestamp) {
      toShexJForm();
    } else {
      updatesListener();
    }
  }, [fileShex, documentUri, timestamp]);

  return {
    shexData,
    addNewShexField,
    isValueChanged,
    updateShexJ,
    onSubmit,
    onDelete,
    onChange,
    saveForm,
    onReset
  };
};

export default useShex;

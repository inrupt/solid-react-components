import { useState } from "react";
import ldflex from "@solid/query-ldflex";
import { namedNode } from "@rdfjs/data-model";
import { shexParentLinkOnDropDowns, SolidError } from "@utils";
import { ShexJ } from "@entities";


export const useForm = (documentUri: String) => {
  const [formValues, setFormValues] = useState({});

  const onChange = e => {
    const { value, name } = e.target;
    const defaultValue = e.target.getAttribute('data-default');
    const action =
      defaultValue === '' ? 'create' : value === '' ? 'delete' : 'update';
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

      return { status: 200, message: 'Form submitted successfully', fieldName: name};
    } catch (error) {
      let solidError = error;

      if (!error.status && !error.code ) {
        solidError = new SolidError(error.message, 'Ldflex Error', 522);
      }
      return solidError;
    }
  };

  const onReset = () => {
    setFormValues({});
  }

  const errorFieldFactory = (field: Object, error: String) => {
    return {
      ...field,
      error
    };
  }

  const _formStringValidation = (fieldValue: Object) => {
    const { valueExpr } = fieldValue;

    if (valueExpr.pattern) {
      const regex = new RegExp(valueExpr.pattern);

      if (!regex.test(fieldValue.value)) {
        const message = 'Error: Field value has wrong format';

        return errorFieldFactory(fieldValue, message);
      }
    }

    if (valueExpr.minlength || valueExpr.maxlength) {
      if ((valueExpr.minlength && valueExpr.minlength > fieldValue.value.length) ||
          ( valueExpr.maxlength && valueExpr.maxlength < fieldValue.value.length)) {
        const message = `Error: Value should be more than ${valueExpr.minlength} or less than ${valueExpr.maxlength}`;

        return errorFieldFactory(fieldValue, message);
      }
    }

    if (valueExpr.length && valueExpr.length === fieldValue.value.length) {
      const message = `Error: Characters length should be equal than ${valueExpr.length}`;

      return errorFieldFactory(fieldValue, message);
    }

    return {...fieldValue};
  }

  const _formNumberValidation = (fieldValue: Object) => {
    const { valueExpr } = fieldValue;

    if (valueExpr) {
      if (valueExpr.mininclusive || valueExpr.maxinclusive) {
        if ((valueExpr.mininclusive && valueExpr.mininclusive > fieldValue.value) ||
            (valueExpr.maxinclusive && valueExpr.maxinclusive < fieldValue.value)) {
          const message = `Error: Min and max number should be  ${valueExpr.mininclusive}, ${valueExpr.maxinclusive}`;

          return errorFieldFactory(fieldValue, message);
        }
      }

      if (valueExpr.mininclusive || valueExpr.maxinclusive) {
        if ((valueExpr.minexclusive && valueExpr.minexclusive >= fieldValue.value) ||
            (valueExpr.maxexclusive && valueExpr.maxexclusive <= fieldValue.value)) {
          const message = `Error: Min and max value should be  ${valueExpr.minexclusive}, ${valueExpr.maxexclusive}`;

          return errorFieldFactory(fieldValue, message);
        }
      }
    }
    return {...fieldValue};
  }


  const _formValidation = (formValues: Object) => {
    const formValuesKeys = Object.keys(formValues);
    let isValid = true;

    const updatedFields = formValuesKeys.reduce((acc, field) => {
      const currentField = formValues[field];

      if (currentField.valueExpr && currentField.valueExpr.datatype.includes('string')) {
        const updatedField = _formStringValidation(currentField);

        if (updatedField.error) isValid = false;

        return {...acc, [ field]: updatedField };
      }

      const updatedField =  _formNumberValidation(currentField);

      if (updatedField.error) isValid = false;

      return {...acc, [field]: updatedField };
    }, []);


    return { isValid, updatedFields };
  }


  const onSubmit = async (e: Event) => {
    try {
      if (!documentUri || documentUri === "") {
        throw Error("Document Uri is required");
      }
      e.preventDefault();

      const { isValid, updatedFields } = _formValidation(formValues);
      const keys = Object.keys(formValues);
      if (isValid && keys.length > 0) {
        for await (const key of keys) {
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
        }
        setFormValues({});

        return { status: 200, message: 'Form submitted successfully'};
      } else {
        setFormValues({...updatedFields});
        if (keys.length !== 0) {
          throw new SolidError('Please ensure all values are in a proper format.', 'ShexForm', 422);
        }
      }
    } catch (error) {
      let solidError = error;

      if (!error.status && !error.code ) {
        solidError = new SolidError(error.message, 'Ldflex Error', 521);
      }
      return solidError;
    }
  };

  return { formValues, onChange, onSubmit, onReset, onDelete };
};

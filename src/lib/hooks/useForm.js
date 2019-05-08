import { useState } from "react";
import ldflex from "@solid/query-ldflex";
import { namedNode } from "@rdfjs/data-model";
import { shexParentLinkOnDropDowns } from "@utils";
import { ShexJ } from "@entities";


export const useForm = (documentUri: String) => {
  const [formValues, setFormValues] = useState({});
  const [formError, setFormError] = useState(null);

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
        valueExpr: JSON.parse(e.target.getAttribute('data-valuexpr'))
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

  const onDelete = async (shexj: ShexJ, parent: any = false, cb: () => void) => {
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
      cb(name, 'delete');
    } catch (error) {
      onError(error);
    }
  };

  const onReset = () => setFormValues({});

  const onError = error => {
    setFormError(error);
  };

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

      if (valueExpr.minlength || valueExpr.maxlength) {
        if ((valueExpr.minlength && valueExpr.minlength > fieldValue.value.length) ||
            ( valueExpr.maxlength && valueExpr.maxlength > fieldValue.value.length)) {
          const message = `Error: Value should be more than ${valueExpr.minlength} or less than ${valueExpr.maxlength}`;

          return errorFieldFactory(fieldValue, message);
        }
      }

      if (valueExpr.length && valueExpr.length === fieldValue.value.length) {
        const message = `Error: Characters length should be equal than ${valueExpr.length}`;

        return errorFieldFactory(fieldValue, message);
      }
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

      if (isValid) {
        for await (const key of Object.keys(formValues)) {

          const field = {
            ...formValues[key],
            value: _setFieldValue(
                formValues[key].value,
                formValues[key].prefix
            ),
            defaultValue: _setFieldValue(
                formValues[key].defaultValue,
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
      } else {
        setFormValues({...updatedFields});
      }
    } catch (error) {
      throw Error(error);
    }
  };

  return { formValues, onChange, onSubmit, onReset, onDelete, formError };
};

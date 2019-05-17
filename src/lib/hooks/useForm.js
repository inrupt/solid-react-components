import { useState } from "react";
import ldflex from "@solid/query-ldflex";
import { namedNode } from "@rdfjs/data-model";
import { shexParentLinkOnDropDowns, SolidError,solidResponse, ShexFormValidator } from "@utils";
import { ShexJ } from "@entities";


export const useForm = (documentUri: String) => {
  const [formValues, setFormValues] = useState({});

  const onChange = e => {
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

  return { formValues, onChange, onSubmit, onReset, onDelete, saveForm };
};

import { useState } from "react";
import ldflex from "@solid/query-ldflex";
import { namedNode } from "@rdfjs/data-model";
import { shexParentLinkOnDropDowns } from "@utils";
import { ShexJ } from "@entities";

export const useForm = (documentUri: String) => {
  const [formValues, setFormValues] = useState({});
  const [formError, setFormError] = useState({});

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
        parentSubject: e.target.getAttribute('data-parent-subject')
      }
    };

    setFormValues({ ...formValues, ...data });
  };

  const _create = async field => {
    const { subject, predicate, value } = field;
    if (field.parentPredicate) await _createLink(field);
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
          const { predicate } = shexj;
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

  const onSubmit = async (e: Event) => {
    try {
      if (!documentUri || documentUri === '') {
        throw Error('Document Uri is required');
      }
      e.preventDefault();

      for await (const key of Object.keys(formValues)) {
        const field = {
          ...formValues[key],
          value: _setFieldValue(formValues[key].value, formValues[key].prefix),
          defaultValue: _setFieldValue(
            formValues[key].defaultValue,
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
      }
    } catch (error) {
      throw Error(error);
    }
  };

  return { formValues, onChange, onSubmit, onReset, onDelete, formError };
};

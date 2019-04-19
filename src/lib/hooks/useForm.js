import { useState } from "react";
import ldflex from "@solid/query-ldflex";
import { namedNode } from "@rdfjs/data-model";
import { shexParentLinkOnDropDowns } from "@utils";

export const useForm = (
  documentUri: String,
  fileShex: String,
  shapeName: String
) => {
  const [formValues, setFormValues] = useState({});

  const onChange = e => {
    const { value, name } = e.target;
    const defaultValue = e.target.getAttribute("data-default");
    const action =
      defaultValue === "" ? "create" : value === "" ? "delete" : "update";
    const data = {
      [e.target.name]: {
        value,
        name,
        action,
        defaultValue,
        predicate: e.target.getAttribute("data-predicate"),
        subject: e.target.getAttribute("data-subject"),
        prefix: e.target.getAttribute("data-prefix"),
        parentPredicate: e.target.getAttribute("data-parent-predicate")
      }
    };

    setFormValues({ ...formValues, ...data });
  };

  const create = async field => {
    const { subject, predicate, value } = field;
    if (field.parentPredicate) await createLink(field);
    await ldflex[subject][predicate].add(value);
  };

  const createLink = async field => {
    const { subject, parentPredicate } = field;

    let isNew = true;
    for await (let item of ldflex[documentUri][parentPredicate])
      if (item.value === subject) isNew = false;
    if (isNew) {
      let id = subject.split("#").pop();
      id = `#${id}`;
      await ldflex[documentUri][parentPredicate].add(namedNode(id));
    }
  };

  const setFieldValue = (value: String, prefix: ?String) =>
    prefix ? namedNode(`${prefix}${value}`) : value;

  const deleteLink = async (shexj, parent,cb) => {
    const subject = shexj._formFocus.value;
    const { predicate: parentPredicate } = parent;
    const expressions = shexj.expression.expressions;

    try{
      for (let expression of expressions){
        const value = await ldflex[subject][expression.predicate];
        if(value)
         await ldflex[subject][expression.predicate].delete();
      }
      await ldflex[documentUri][parentPredicate].delete(ldflex[subject]);

      cb(shexj._formFocus.name, 'filter');
    }catch(e){
      throw e;
    }
  };

  const onDelete = async (expression, parent = false, cb) => {
    try {
      if (shexParentLinkOnDropDowns(parent, expression)) {
        await deleteLink(expression, parent,cb);
      } else {
        const { subject, predicate, defaultValue, key } = expression;
        /*
        * We check if parent is a link shape and not link data id
        * @TODO: we need to find a better way to do this
         */
        const newPredicate = (parent && parent.predicate) || predicate;
        const newSubject = (expression._formFocus && expression._formFocus.parentSubject) || subject;
        const newValue = (expression._formFocus && expression._formFocus.value) || defaultValue;

        await ldflex[newSubject][newPredicate].delete(newValue);

        const keyTodelete = key || expression._formFocus.name;

        cb(keyTodelete, 'filter');
      }
      console.log("Succesfully deleted");
    } catch (e) {
      console.error(e);
    }
  };

  const onReset = () => setFormValues({});

  const onSubmit = async (e, successCallback, errorCallback) => {
    try {
      e.preventDefault();

      for await (const key of Object.keys(formValues)) {
        const field = {
          ...formValues[key],
          value: setFieldValue(formValues[key].value, formValues[key].prefix),
          defaultValue: setFieldValue(
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
            await create(field);
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
      successCallback();
    } catch (error) {
      errorCallback(error);
    }
  };

  return { formValues, onChange, onSubmit, onReset, onDelete };
};

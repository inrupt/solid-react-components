import { useState } from "react";
import ldflex from "@solid/query-ldflex";
import { namedNode } from "@rdfjs/data-model";
import solid from "solid-auth-client";

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
      const id = subject.split("#").pop();
      await ldflex[documentUri][parentPredicate].add(namedNode(id));
    }
  };

  const onReset = () => setFormValues({});

  const onSubmit = async (e, successCallback, errorCallback) => {
    try {
      e.preventDefault();

      for await (const key of Object.keys(formValues)) {
        const field = formValues[key];

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

  return { formValues, onChange, onSubmit, onReset };
};

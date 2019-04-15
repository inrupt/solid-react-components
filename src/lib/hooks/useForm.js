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
    const defaultValue = e.target.getAttribute("data-default");
    const value = e.target.value;
    const action =
      defaultValue === "" ? "create" : value === "" ? "delete" : "update";
    const data = {
      [e.target.name]: {
        value: e.target.value,
        name: e.target.name,
        predicate: e.target.getAttribute("data-predicate"),
        subject: e.target.getAttribute("data-subject"),
        defaultValue: e.target.getAttribute("data-default"),
        parentPredicate: e.target.getAttribute("data-parent-predicate"),

        action
      }
    };
    setFormValues({ ...formValues, ...data });
  };

  const isNew = async documentUri => {
    const exists = await solid.fetch(documentUri);
    console.log("Exists", exists);
    return exists === undefined;
  };

  const create = async field => {
    console.log("Field", field);
    if (field.parentPredicate) await createLink(field);
    await ldflex[field.subject][field.predicate].add(field.value);
  };

  const createLink = async field => {
    const { subject, parentPredicate } = field;
    let isNew = true;
    console.log("Parent Predicate", parentPredicate, "Uri", documentUri);
    for await (let item of ldflex[documentUri][parentPredicate]) {
      console.log("Item",item.value);
      if (item.value === subject) isNew = false;
    }
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

import { useState } from "react";
import ldflex from "@solid/query-ldflex";

export const useForm = (
  fileShex: String,
  documentUri: String,
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
        action
      }
    };
    setFormValues({ ...formValues, ...data });
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
            await ldflex[field.subject][field.predicate].add(field.value);
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

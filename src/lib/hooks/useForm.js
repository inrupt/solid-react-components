import { useCallback, useState, useEffect } from "react";
import data from "@solid/query-ldflex";

export const useForm = (
  fileShex: String,
  documentUri: String,
  shapeName: String
) => {
  const [formValues, setFormValues] = useState({});

  const onChange = e => {
    const defaultValue = e.target.getAttribute("data-default");
    const value = e.target.value;
    const action = defaultValue === '' ? 'create' : value === '' ? 'delete' : 'update';
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

  const onSubmit = e => {
    e.preventDefault();
    console.log("Submit form", formValues);
  };

  return { formValues, onChange, onSubmit };
};

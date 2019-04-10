import { useCallback, useState, useEffect } from "react";
import data from "@solid/query-ldflex";

export const useForm = (
  fileShex: String,
  documentUri: String,
  shapeName: String
) => {
  const [ formValues, setFormValues ] = useState({});

  const onChange = e => {
    const data = {
      [e.target.name]: {
        value: e.target.value,
        name: e.target.name,
        predicate: e.target.getAttribute('data-predicate'),
        subject: e.target.getAttribute('data-subject'),
        defaultValue: e.target.getAttribute('data-default')
      }
    };

    setFormValues({ ...formValues, ...data });
    console.log("Formvalues", formValues)

  };

  const onSubmit = () => {console.log("Submit form")};

  return { formValues, onChange, onSubmit };
};

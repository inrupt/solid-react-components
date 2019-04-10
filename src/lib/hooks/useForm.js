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
        id: e.target.name,
        predicate: e.target,
        subject: e.target,
        defaultValue: e.target.data.defaultValue
      }
    };

    setFormValues({ ...formValues, data });
  };

  const onSubmit = () => {console.log("Submit form")};

  return { formValues, onChange, onSubmit };
};

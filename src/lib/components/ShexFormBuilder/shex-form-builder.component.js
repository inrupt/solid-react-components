import React from "react";
import { FormComponent } from "./styled.component";
import { ShexForm } from "@components";
import { useForm, useShex } from "@hooks";

type Props = {
  errorCallback : () => void,
  successCallback: () => void,
  documentUri: String,
  shexUri: String,
  rootShape: String
};

const ShexFormBuilder = ({
  successCallback,
  errorCallback,
  documentUri,
  shexUri,
  rootShape
}: Props) => {
  const { shexData, addNewShexField, updateShexJ } = useShex(
    shexUri,
    documentUri,
    rootShape
  );
  const { onSubmit: submit, onChange, onDelete, onReset, formValues } = useForm(
    documentUri
  );

  const update = async () => {
    for await (const key of Object.keys(formValues)) {
      updateShexJ(formValues[key].name, "update", {
        isNew: false,
        value: formValues[key].value
      });
    }
  };

  const onSubmit = e => {
    try {
      submit(e);
      update();
      successCallback();
    } catch (e) {
      errorCallback(e);
    }
  };

  return (
    <FormComponent onSubmit={onSubmit}>
      {shexData.formData && (
        <ShexForm
          {...{
            formValues,
            onChange,
            onDelete,
            addNewShexField,
            updateShexJ,
            shexj: shexData.formData
          }}
        />
      )}
      <button type="submit">Save</button>
      <button type="button" onClick={onReset}>
        Reset
      </button>
    </FormComponent>
  );
};

ShexFormBuilder.defaultProps = {
  successCallback: () => console.log("Form submitted successfully"),
  errorCallback: e => console.log("Error submitting form", e)
};

export default ShexFormBuilder;

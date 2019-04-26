import React from "react";
import { FormComponent } from "./styled.component";
import { ShexForm } from "@components";
import { useForm, useShex } from "@hooks";

const ShexFormBuilder = ({
  successCallback,
  errorCallback,
  documentUri,
  shexUri
}) => {
  const { shexData, addNewShexField, updateShexJ } = useShex(
    shexUri,
    documentUri
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

import React, {useCallback} from "react";
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
  const { shexData, addNewShexField, updateShexJ, shexError } = useShex(
    shexUri,
    documentUri,
    rootShape
  );

  const { onSubmit: submit, onChange, onDelete, onReset, formValues, formError } = useForm(
    documentUri
  );

  if (shexError || formError) {
    if (errorCallback) errorCallback(shexError || formError);
  }

  const update = useCallback(async () => {
    for await (const key of Object.keys(formValues)) {
      updateShexJ(formValues[key].name, "update", {
        isNew: false,
        value: formValues[key].value
      });
    }
  });

  const onSubmit = useCallback(e => {
    try {
      submit(e);
      update();
      successCallback();
    } catch (e) {
      errorCallback(e);
    }
  });

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
  errorCallback: e => console.log("Error: ", e)
};

export default ShexFormBuilder;

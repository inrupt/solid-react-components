import React, {useCallback} from "react";
import { FormComponent } from "./styled.component";
import { ShexForm } from "@components";
import { useForm, useShex } from "@hooks";
import { ThemeShex, Language } from "@context";

type Props = {
  errorCallback : () => void,
  successCallback: () => void,
  messageValidation: { error: Array<String>},
  documentUri: String,
  shexUri: String,
  rootShape: String,
  theme: Object,
  language: String
};

const ShexFormBuilder = ({
  successCallback,
  errorCallback,
  documentUri,
  shexUri,
  rootShape,
  theme,
  language
}: Props) => {
  const { shexData, addNewShexField, updateShexJ, shexError } = useShex(
    shexUri,
    documentUri,
    rootShape
  );

  const {
    onSubmit: submit,
    onChange,
    onDelete,
    onReset,
    formValues,
    formError
  } = useForm(documentUri);

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
    <ThemeShex.Provider value={theme}>
      <Language.Provider value={language}>
        <FormComponent onSubmit={onSubmit} className={theme && theme.form}>
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
      </Language.Provider>
    </ThemeShex.Provider>
  );
};

ShexFormBuilder.defaultProps = {
  successCallback: () => console.log("Form submitted successfully"),
  errorCallback: e => console.log("Error: ", e),
  theme: {
      input : 'solid-input-shex',
      select: 'solid-input-shex solid-select-shex',
      deleteButton: 'solid-button-shex',
      form: 'solid-shex-form'
  }
};

export default ShexFormBuilder;

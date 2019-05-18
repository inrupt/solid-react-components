import React, { useCallback } from "react";
import { FormComponent } from "./styled.component";
import { ShexForm } from "@components";
import {  useShex } from "@hooks";
import { ThemeShex, Language } from "@context";

type Props = {
  errorCallback: () => void,
  successCallback: () => void,
  messageValidation: { error: Array<String> },
  documentUri: String,
  shexUri: String,
  rootShape: String,
  theme: Object,
  languageTheme: Object
};

const ShexFormBuilder = ({
  successCallback,
  errorCallback,
  documentUri,
  shexUri,
  rootShape,
  theme,
  languageTheme
}: Props) => {

  const {
    shexData,
    addNewShexField,
    updateShexJ,
    onSubmit: submit,
    onDelete: deleteFn,
    onChange,
    onReset,
    formValues
  } = useShex(shexUri, documentUri, rootShape, errorCallback);

  const onDelete = useCallback(async (shexj: ShexJ, parent: any = false) => {
    try {
      const deleted = await deleteFn(shexj, parent);

      if ((deleted.code && deleted.code === 200) || (deleted.status && deleted.status === 200)) {
        return successCallback(deleted.message);
      }

      throw deleted;
    } catch (e) {
      errorCallback(e);
    }
  });

  const onSubmit = useCallback(async e => {
    try {
      const result = await submit(e);

      if ((result.status && result.status === 200)  || (result.code && result.code === 200)) {
        return successCallback(result);
      }

      throw result;
    } catch (e) {
      errorCallback(e);
    }
  });

  return (
    <ThemeShex.Provider value={theme}>
      <Language.Provider value={languageTheme}>
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
          <button type="submit">{languageTheme.saveBtn}</button>
          <button type="button" onClick={onReset}>
            {languageTheme.resetBtn}
          </button>
        </FormComponent>
      </Language.Provider>
    </ThemeShex.Provider>
  );
};

ShexFormBuilder.defaultProps = {
  successCallback: () => console.log("Submitted successfully"),
  errorCallback: e => console.log("Status: ", e.status || e.code),
  theme: {
    input: "solid-input-shex",
    select: "solid-input-shex solid-select-shex",
    deleteButton: "solid-button-shex",
    form: "solid-shex-form"
  },
  languageTheme: {
    language: "en",
    saveBtn: "Save",
    resetBtn: "Reset",
    addButtonText: "+ Add new ",
    deleteButton: "Delete",
    dropdownDefaultText: "- Select -"
  }
};

export default ShexFormBuilder;

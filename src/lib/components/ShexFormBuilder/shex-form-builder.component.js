import React, { useCallback } from "react";
import { FormComponent } from "./styled.component";
import { ShexForm } from "@components";
import {  useShex } from "@hooks";
import { ShexConfig } from "@context";


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
  languageTheme,
  autoSaveMode
}: Props) => {
  const {
    shexData,
    addNewShexField,
    updateShexJ,
    onSubmit,
    onDelete: deleteFn,
    onChange,
    onReset,
    formValues,
    saveForm
  } = useShex(shexUri, documentUri, rootShape, errorCallback, successCallback);

  const onDelete = useCallback(async (shexj: ShexJ, parent: any = false) => {
    try {
      const deleted = await deleteFn(shexj, parent);

      if (
        (deleted.code && deleted.code === 200) ||
        (deleted.status && deleted.status === 200)
      ) {
        return successCallback(deleted.message);
      }

      throw deleted;
    } catch (e) {
      errorCallback(e);
    }
  });

  const onSubmitSave = useCallback(async (e, type: ?String) => {
    try {
      let result;

      if (type) {
        result = await saveForm(e);
      } else {
        result = await onSubmit(e);
      }

      if (
        (result.status && result.status === 200) ||
        (result.code && result.code === 200)
      ) {
        return successCallback(result);
      }

      throw result;
    } catch (e) {
      errorCallback(e);
    }
  });

  const config = {
    theme,
    languageTheme,
    config: {
      onDelete,
      onChange,
      updateShexJ,
      addNewShexField,
      onSubmitSave,
      autoSaveMode
    }
  };
  return (
    <ShexConfig.Provider value={config}>
      <FormComponent onSubmit={onSubmitSave} className={theme && theme.form}>
        {shexData.formData && (
          <ShexForm
            {...{
              formValues,
              onChange,
              onDelete,
              addNewShexField,
              shexj: shexData.formData
            }}
          />
        )}
        { !autoSaveMode && (
          <React.Fragment>
            <button type="submit">{languageTheme.saveBtn}</button>
            <button type="button" onClick={onReset}>
              {languageTheme.resetBtn}
            </button>
          </React.Fragment>
        )}
      </FormComponent>
    </ShexConfig.Provider>
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

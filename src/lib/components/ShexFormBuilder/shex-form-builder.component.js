import React, { useCallback } from "react";
import { FormComponent } from "./styled.component";
import { ShexForm } from "@components";
import { useForm, useShex } from "@hooks";
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
  languageTheme
}: Props) => {
  const { shexData, addNewShexField, updateShexJ } = useShex(
    shexUri,
    documentUri,
    rootShape,
    errorCallback
  );

  const {
    onSubmit: submit,
    onDelete: deleteFn,
    onChange,
    onReset,
    formValues
  } = useForm(documentUri);

  const update = useCallback(async (shexj: ShexJ, parent: any = false) => {
    let parents = [];
    for await (const key of Object.keys(formValues)) {
      const { name, parentName } = formValues[key];
      parents =
        parentName && !parents.includes(parentName)
          ? [...parents, formValues[key].parentName]
          : parents;
      updateShexJ(name, "update", {
        isNew: false,
        value: formValues[key].value
      });
    }

    for await (parent of parents) {
      updateShexJ(parent, "update", {
        isNew: false
      });
    }
  });

  const onDelete = useCallback(async (shexj: ShexJ, parent: any = false) => {
    try {
      const deleted = await deleteFn(shexj, parent);

      if (
        (deleted.code && deleted.code === 200) ||
        (deleted.status && deleted.status === 200)
      ) {
        updateShexJ(deleted.fieldName, "delete");
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

      if (
        (result.status && result.status === 200) ||
        (result.code && result.code === 200)
      ) {
        update();
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
      addNewShexField
    }
  };
  return (
    <ShexConfig.Provider value={config}>
      <FormComponent onSubmit={onSubmit} className={theme && theme.form}>
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
        <button type="submit">{languageTheme.saveBtn}</button>
        <button type="button" onClick={onReset}>
          {languageTheme.resetBtn}
        </button>
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

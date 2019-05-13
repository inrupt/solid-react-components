import React, { useCallback } from "react";
import { FormComponent } from "./styled.component";
import { ShexForm } from "@components";
import { useForm, useShex } from "@hooks";
import { ThemeShex, Language } from "@context";

type Props = {
  errorCallback: () => void,
  successCallback: () => void,
  messageValidation: { error: Array<String> },
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
  languageTheme
}: Props) => {
  const { shexData, addNewShexField, updateShexJ, shexError } = useShex(
    shexUri,
    documentUri,
    rootShape
  );

  const {
    onSubmit: submit,
    onDelete: deleteFn,
    onChange,
    onReset,
    formValues,
    formError
  } = useForm(documentUri);

  if (shexError || formError) {
    if (errorCallback) errorCallback(shexError || formError);
  }

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
      if (!formError) {
        updateShexJ(deleted, "delete");
        successCallback();
      }
    } catch (e) {
      errorCallback(e);
    }
  });

  const onSubmit = useCallback(async e => {
    try {
      if (await submit(e)) {
        update();
        successCallback();
      }
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
  successCallback: () => console.log("Submitted successfully"),
  errorCallback: e => console.log("Error: ", e),
  theme: {
    input: "solid-input-shex",
    select: "solid-input-shex solid-select-shex",
    deleteButton: "solid-button-shex",
    form: "solid-shex-form"
  }
};

export default ShexFormBuilder;

import React, { useState, useCallback, useEffect, memo } from 'react';
import { FormModelConfig } from '@context';
// eslint-disable-next-line import/no-extraneous-dependencies
import { solidResponse, SolidError } from '@utils';
import { FormActions, formUi } from 'solid-forms';
import Form from './children/Form';
import Viewer from './children/Viewer';

type Props = {
  modelPath: String,
  podPath: String,
  title: String,
  autoSave: boolean,
  onInit: () => void,
  onLoaded: () => void,
  settings: {
    theme: object,
    languageTheme: object,
    config: object
  }
};

const FormModel = memo(
  ({ modelPath, podPath, autoSave, settings = {}, title, viewer, onInit, onLoaded }: Props) => {
    const [formModel, setFormModel] = useState({});
    const [formObject, setFormObject] = useState({});
    const formActions = new FormActions(formModel, formObject);
    const { languageTheme } = settings;

    const init = useCallback(async () => {
      try {
        if (onInit) onInit();
        const model = await formUi.convertFormModel(modelPath, podPath);

        setFormModel(model);
        if (onLoaded) onLoaded();
        return solidResponse(200, 'Init Render Success', { type: 'init' });
      } catch (error) {
        return SolidError(error, 'Error on render', 500);
      }
    });

    const addNewField = useCallback(id => {
      const updatedFormModelObject = formActions.addNewField(id);

      setFormModel(updatedFormModelObject);
    });

    const deleteField = useCallback(async id => {
      const updatedFormModelObject = await formActions.deleteField(id);

      setFormModel(updatedFormModelObject);
    });

    const modifyFormObject = useCallback((id, obj) => {
      const formObject = formActions.retrieveNewFormObject(id, obj);
      setFormObject(formObject);
    });

    const onSave = useCallback(async e => {
      if (e) {
        e.preventDefault();
      }
      const updatedFormModel = await formActions.saveData();
      setFormModel(updatedFormModel);
    });

    useEffect(() => {
      init();
    }, []);

    return !viewer ? (
      <FormModelConfig.Provider value={settings}>
        <form onSubmit={onSave}>
          {title && <h1>Form Model</h1>}
          <Form
            {...{
              formModel,
              formObject,
              modifyFormObject,
              deleteField,
              addNewField,
              onSave,
              autoSave,
              settings
            }}
          />
          {autoSave && (
            <button type="submit">{(languageTheme && languageTheme.save) || 'Save'}</button>
          )}
        </form>
      </FormModelConfig.Provider>
    ) : (
      <FormModelConfig.Provider value={settings}>
        <Viewer {...{ formModel }} />
      </FormModelConfig.Provider>
    );
  }
);

export default FormModel;

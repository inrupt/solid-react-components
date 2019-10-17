import React, { useState, useCallback, useEffect, memo } from 'react';
import { useLiveUpdate } from '@solid/react';
import { FormActions, formUi } from 'solid-forms';
import { FormModelConfig } from '@context';
// eslint-disable-next-line import/no-extraneous-dependencies
import { solidResponse, SolidError } from '@utils';
import Form from './children/Form';
import Viewer from './children/Viewer';

type Props = {
  modelPath: String,
  podPath: String,
  title: String,
  autoSave: boolean,
  onInit: () => void,
  onLoaded: () => void,
  onError: () => void,
  onSuccess: () => void,
  onSave: () => void,
  onAddNewField: () => void,
  onDelete: () => void,
  settings: {
    theme: object,
    languageTheme: object,
    config: object
  }
};

const FormModel = memo(
  ({
    modelPath,
    podPath,
    autoSave,
    settings = {},
    title,
    viewer,
    onInit,
    onLoaded,
    onError,
    onSuccess,
    onAddNewField,
    onDelete
  }: Props) => {
    const [formModel, setFormModel] = useState({});
    const [formObject, setFormObject] = useState({});
    const [newUpdated, setNewUpdate] = useState(false);
    const formActions = new FormActions(formModel, formObject);
    const { timestamp } = useLiveUpdate();
    const { languageTheme } = settings;

    const init = useCallback(async () => {
      try {
        if (onInit) onInit();
        const model = await formUi.convertFormModel(modelPath, podPath);
        setFormModel(model);
        if (onLoaded) onLoaded();
        onSuccess(solidResponse(200, 'Init Render Success', { type: 'init' }));
      } catch (error) {
        onError(new SolidError(error, 'Error on render', 500));
      }
    });

    const onUpdate = useCallback(async () => {
      if (Object.keys(formObject).length !== 0) setNewUpdate(true);
      else {
        const newData = await formUi.mapFormModelWithData(formModel, podPath);
        console.log(newData);
        setFormModel(newData);
      }
    }, [formModel, formObject, podPath]);

    const addNewField = useCallback(id => {
      try {
        const updatedFormModelObject = formActions.addNewField(id);
        setFormModel(updatedFormModelObject);
        onAddNewField(solidResponse(200, 'New field successfully added'));
      } catch (error) {
        onError(new SolidError(error, 'Error adding new field', 500));
      }
    });

    const deleteField = useCallback(async id => {
      try {
        const updatedFormModelObject = await formActions.deleteField(id);
        setFormModel(updatedFormModelObject);
        onDelete(solidResponse(200, 'Field successfully deleted'));
      } catch (error) {
        onError(new SolidError(error, 'Error deleting field', 500));
      }
    });

    const modifyFormObject = useCallback((id, obj) => {
      const formObject = formActions.retrieveNewFormObject(id, obj);
      setFormObject(formObject);
    });

    const onSave = useCallback(async e => {
      if (e) {
        e.preventDefault();
      }
      try {
        const updatedFormModel = await formActions.saveData();
        setFormModel(updatedFormModel);
        onSave();
      } catch (error) {
        onError(new SolidError(error, 'Error saving form', 500));
      }
    });

    useEffect(() => {
      init();
    }, []);

    useEffect(() => {
      if (timestamp) onUpdate();
    }, [timestamp]);

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

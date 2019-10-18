import React, { useState, useCallback, useEffect, memo, Fragment } from 'react';
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
    onCancel,
    onSuccess,
    onAddNewField,
    onDelete,
    onSave
  }: Props) => {
    const [formModel, setFormModel] = useState({});
    const [formObject, setFormObject] = useState({});
    const [newUpdate, setNewUpdate] = useState(false);
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
      // checking if formObject is an empty object (if something has been updated in the form)
      if (Object.keys(formObject).length !== 0) setNewUpdate(true);
      else {
        const newData = await formUi.mapFormModelWithData(formModel, podPath);
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

    const onCancelOrReset = useCallback(() => {
      if (onCancel) onCancel(formModel, formObject);
      else setFormObject({});
    });

    const save = useCallback(async e => {
      if (e) {
        e.preventDefault();
      }
      try {
        let updatedFormObject = null;

        /*
        Checks if an update happened in the podPath document while the form was being updated   
        */

        if (newUpdate) {
          // If the podPath document was updated, the inputed values are checked against the new values
          updatedFormObject = await formUi.mapFormObjectWithData(formObject, podPath);
        }

        const updatedFormModel = await formActions.saveData(updatedFormObject);

        setNewUpdate(false);
        setFormModel(updatedFormModel);
        onSave(solidResponse(200, 'New field successfully saved'));
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
              onSave: save,
              autoSave,
              settings
            }}
          />
          {!autoSave && (
            <Fragment>
              <button type="submit">{(languageTheme && languageTheme.save) || 'Save'}</button>
              <button type="button" onClick={onCancelOrReset}>
                {(languageTheme && languageTheme.cancel) || 'Cancel'}
              </button>
            </Fragment>
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

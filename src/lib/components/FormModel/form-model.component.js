import React, { useState, useEffect } from 'react';

import { FormActions, formUi } from '@inrupt/solid-sdk-forms';
import { useLiveUpdate } from '@solid/react';

import { ThemeContext } from '@context';
import { UI } from '@constants';
import { SolidError, solidResponse } from '@utils';

import { Mapping } from './children/Form/UI/component-mapping';
import { Group } from './children/Group';
import Viewer from './children/Viewer';

type FormProps = {
  modelSource: string,
  dataSource: string,
  customComponents: {},
  options: {
    autosave: boolean,
    theme: object,
    autosaveIndicator: React.Component,
    viewer: boolean
  },
  onInit: () => void,
  onLoaded: () => void,
  onError: () => void,
  onSuccess: () => void,
  onSave: () => void,
  onAddNewField: () => void,
  onDelete: () => void
};

/**
 *
 * @param props
 *    @prop {string} modelSource route to the form definition
 *    @prop {string?} dataSource route to the form data
 *    @prop {object} customComponents key-value pairs of field names-react component. Can be used to override
 *                                    standard components or to add new ones
 *    @prop {object} options different options controlling the form behaviour
 *      {boolean} autosave if true save as soon as any change is detected, if false will display a set of buttons
 *                         to allow manual initiation of the save process
 *      {object} theme object with the value for the classes of the different components
 *      {React.Component} spinner component indicating whether the saving process has been completed or nor
 */
export const FormModel = (props: FormProps) => {
  const {
    modelSource,
    dataSource,
    customComponents,
    options,
    onAddNewField,
    onDelete,
    onError,
    onSave,
    onInit,
    onLoaded,
    onSuccess
  } = props;

  const { autosave, theme, autosaveIndicator, viewer } = options;

  const [formModel, setFormModel] = useState({});
  const [pendingChanges, setPendingChanges] = useState({});

  /**
   * {boolean} errored: is the current form out of sync with stored data (errored when saving)
   * {boolean} running: is the saving process running at this time
   */
  const [savingState, setSavingState] = useState({ errored: false, running: false });

  /* actions keep a copy of the model and updated parts */
  const actions = new FormActions(formModel, {});
  const timestamp = useLiveUpdate();

  const init = async () => {
    if (onInit) onInit();
  };

  /**
   * Updates the list of values changed by the user and that are yet to update in the pod
   * @param {string} name unique identifier for this part ('ui:name')
   * @param {string} self the part as it has been updated
   * //TODO: Check if it would be possible for a component to modify its own restrictions,
   *         e.g.: changes it's minValue property
   */
  const updateData = (name, self) => {
    setPendingChanges({ ...pendingChanges, [name]: self });
  };

  /**
   * Create a new set of fields, for when a user wants to add a new set of fields in a Multiple, e.g. Address fields
   * @param id
   */
  const addNewField = id => {
    try {
      const updatedFormModelObject = actions.addNewField(id);
      setFormModel(updatedFormModelObject);
      onAddNewField(solidResponse(200, 'New field successfully added'));
    } catch (error) {
      onError(new SolidError(error, 'Error adding new field', 500));
    }
  };

  /**
   * Delete an existing set of fields, such as an Address. This currently only supports deleting Groups
   * @param id
   */
  const deleteField = async id => {
    try {
      const updatedFormModelObject = await actions.deleteField(id);
      setFormModel(updatedFormModelObject);
      onDelete(solidResponse(200, 'Field successfully deleted'));
    } catch (error) {
      onError(new SolidError(error, 'Error deleting field', 500));
    }
  };

  /**
   * Builds a 'formObject' (list of parts with updated values) for 'actions' to use as an input for
   * saving the data back into the pod
   */
  const saveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) return;

    for (const [name, self] of Object.entries(pendingChanges)) {
      /* besides retrieving the updated parts ('formObject') also adds the new part to the formObject */
      actions.retrieveNewFormObject(name, self);
    }

    try {
      setSavingState({ errored: false, running: true });
      const updatedModel = await actions.saveData();
      setFormModel(updatedModel);
      setPendingChanges({});
      setSavingState({ errored: false, running: false });
      onSave();
    } catch (e) {
      setSavingState({ errored: true, running: false });
      onError(new SolidError(e, 'Error saving form', 500));
    }
  };

  /**
   * Initialize the form, and execute the onInit callback
   */
  useEffect(() => {
    init();
  }, []);

  /* Create a new model if any of the sources changes */
  useEffect(() => {
    formUi.convertFormModel(modelSource, dataSource).then(model => {
      setFormModel(model);
      if (onLoaded) onLoaded();
    });
  }, [modelSource, dataSource]);

  useEffect(() => {
    if (autosave) saveChanges();
  }, [pendingChanges]);

  /**
   * //TODO: handle conflict resolution when the data is changed externally,
   * for now it discards the current model and places the one updated externally
   */
  useEffect(() => {
    formUi
      .mapFormModelWithData(modelSource, dataSource)
      .then(model => {
        setFormModel(model);
      })
      .catch(e => new SolidError('Error while saving data', e, 500));
  }, [timestamp]);

  const mapper = { ...Mapping, ...customComponents };

  // Not finished loading/parsing
  if (!formModel[UI.PARTS]) return null;

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div className={theme && theme.form}>
        {!viewer && (
          <Group
            {...{
              data: formModel[UI.PARTS],
              updateData,
              addNewField,
              deleteField,
              mapper,
              savingData: {
                autosaveIndicator,
                running: savingState.running,
                error: savingState.errored,
                names: Object.keys(pendingChanges)
              }
            }}
          />
        )}
        {viewer && (
          <Viewer formModel={formModel} data={formModel[UI.PARTS] || formModel[UI.PART]} />
        )}
      </div>
    </ThemeContext.Provider>
  );
};

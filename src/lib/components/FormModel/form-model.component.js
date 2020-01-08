import React, { useState, useEffect } from 'react';

import { FormActions, formUi } from '@inrupt/solid-sdk-forms';
import { useLiveUpdate } from '@solid/react';

import { ThemeContext } from '@context';
import { UI, RDF } from '@constants';
import { SolidError } from '@utils';

import { Mapping } from './children/Form/UI/component-mapping';

type FormProps = {
  modelSource: string,
  dataSource: string,
  customComponents: {},
  options: {
    autosave: boolean,
    theme: object
  }
};

/**
 *
 * @param props
 *    @prop {string} modelSource route to the form definition
 *    @prop {string?} dataSource route to the form date
 *    @prop {object} customComponents key-value pairs of field names-react component. Can be used to override
 *                                    standard components or to add new ones
 *    @prop {object} options different options controlling the form behaviour
 *      {boolean} autosave if true save as soon as any change is detected, if false will display a set of buttons
 *                         to allow manual initiation of the save process
 */
export const FormModel = (props: FormProps) => {
  const { modelSource, dataSource, customComponents, options } = props;

  const { autosave, theme } = options;

  const [formModel, setFormModel] = useState({});
  const [pendingChanges, setPendingChanges] = useState({});

  /* actions keep a copy of the model and updated parts */
  const actions = new FormActions(formModel, {});
  const timestamp = useLiveUpdate();

  /**
   * Updates the list of values changed by the user and that are yet to update in the pod
   * @param {string} id unique identifier for this part ('ui:name')
   * @param {string} value the new 'ui:value' for this part
   */
  const updateData = (id, value) => {
    setPendingChanges({ ...pendingChanges, [id]: value });
  };

  /**
   * Builds a 'formObject' (list of parts with updated values) for 'actions' to use as an input for
   * saving the data back into the pod
   */
  const saveChanges = () => {
    if (Object.keys(pendingChanges).length === 0) return;

    for (const [id, value] of Object.entries(pendingChanges)) {
      const name = formModel[UI.PARTS][id][UI.NAME];
      const updatedPart = { ...formModel[UI.PARTS][id] };
      updatedPart.value = value;

      /* besides retrieving the updated parts ('formObject') also adds the new part to the formObject */
      actions.retrieveNewFormObject(name, updatedPart);
    }

    actions
      .saveData()
      .then(updatedModel => {
        setFormModel(updatedModel);
        setPendingChanges({});
      })
      .catch(e => new SolidError('Error while saving data', e, 500));
  };

  /* Create a new model if any of the sources changes */
  useEffect(() => {
    formUi.convertFormModel(modelSource, dataSource).then(model => setFormModel(model));
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
      .mapFormModelWithData(formModel, modelSource)
      .then(model => setFormModel(model))
      .catch(e => new SolidError('Error while saving data', e, 500));
  }, [timestamp]);

  const mapper = { ...Mapping, ...customComponents };

  return (
    <React.Fragment>
      {formModel[UI.PARTS] &&
        Object.entries(formModel[UI.PARTS]).map(([id, data]) => {
          const Component = mapper[data[RDF.TYPE]];

          if (!Component) return;

          return (
            <ThemeContext.Provider key={id} value={{ theme }}>
              <Component
                {...{
                  key: id,
                  id,
                  data,
                  updateData
                }}
              />
            </ThemeContext.Provider>
          );
        })}
    </React.Fragment>
  );
};

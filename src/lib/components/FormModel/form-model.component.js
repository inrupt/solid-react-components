import React, { useState, useCallback, useEffect, memo } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { FormActions, formUi } from 'solid-forms';

import Form from './children/Form';
// import formModelObjectData from './form-model-example.json';

type Props = {
  modelPath: string,
  podPath: string,
  autoSave: boolean
};

const FormModel = memo(({ modelPath, podPath, autoSave }: Props) => {
  const [formModel, setFormModel] = useState({});
  const [formObject, setFormObject] = useState({});
  const formActions = new FormActions(formModel, formObject);

  const init = useCallback(async () => {
    const model = await formUi.convertFormModel(modelPath, podPath);

    setFormModel(model);
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
    e.preventDefault();
    const updatedFormModel = await formActions.saveData();
    setFormModel(updatedFormModel);
  });

  useEffect(() => {
    init();
  }, []);
  console.log(formModel);
  return (
    <form onSubmit={onSave}>
      <h1>Form Model</h1>
      <Form
        {...{ formModel, formObject, modifyFormObject, deleteField, addNewField, onSave, autoSave }}
      />
      {autoSave && <button type="submit">Save</button>}
    </form>
  );
});

export default FormModel;

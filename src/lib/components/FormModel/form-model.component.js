import React, { useState, useCallback, useEffect, memo } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { FormActions, formUi } from 'solid-forms';

import Form from './children/Form';
// import formModelObjectData from './form-model-example.json';

const FormModel = memo(() => {
  const [formModel, setFormModel] = useState({});
  const [formObject, setFormObject] = useState({});
  const formActions = new FormActions(formModel, formObject);

  const init = useCallback(async () => {
    const model = await formUi.convertFormModel(
      'https://jairocr.inrupt.net/public/form.ttl#form1',
      'https://jcampos.inrupt.net/profile/card#me'
    );

    setFormModel(model);
  });

  const addNewField = useCallback(id => {
    const updatedFormModelObject = formActions.addNewField(id);

    setFormModel(updatedFormModelObject);
  });

  const deleteField = useCallback(async id => {
    // console.log(id, formObject)
    const updatedFormModelObject = await formActions.deleteField(id);

    setFormModel(updatedFormModelObject);
  });

  const modifyFormObject = useCallback((id, obj) => {
    const formObject = formActions.retrieveNewFormObject(id, obj);
    setFormObject(formObject);
  });

  const onSubmit = useCallback(async e => {
    e.preventDefault();
    await formActions.saveData();
  });

  useEffect(() => {
    init();
  }, []);
  console.log(formModel);
  return (
    <form onSubmit={onSubmit}>
      <h1>Form Model</h1>
      <Form {...{ formModel, formObject, modifyFormObject, deleteField, addNewField }} />
      <button type="submit">Save</button>
    </form>
  );
});

export default FormModel;

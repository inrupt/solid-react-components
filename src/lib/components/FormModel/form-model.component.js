import React, { useState, useCallback, useEffect, memo } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { FormActions, formUi } from 'solid-forms';

import Form from './children/Form';
// import formModelObjectData from './form-model-example.json';

const FormModel = memo(() => {
  const [formObject, setFormObject] = useState({});
  const [formModelObject, setFormModel] = useState({});
  const formActions = new FormActions(formModelObject, formObject);

  const loadFormModel = useCallback(async () => {
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

  const deleteField = useCallback(id => {
    const updatedFormModelObject = formActions.deleteField(id);

    setFormModel(updatedFormModelObject);
  });

  useEffect(() => {
    loadFormModel();
  }, []);

  return (
    <form>
      <h1>Form Model</h1>
      <Form
        formModel={formModelObject}
        {...{ formActions, formObject, setFormObject, addNewField, deleteField }}
      />
    </form>
  );
});

export default FormModel;

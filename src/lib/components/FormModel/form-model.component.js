import React, { useState, useCallback, useEffect, memo } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { FormActions, formUi } from 'solid-forms';

import Form from './children/Form';
import formModelObject from './form-model-example.json';

const FormModel = memo(props => {
  const [formModel, setFormModel] = useState({});
  const [formObject, setFormObject] = useState({});
  const formActions = new FormActions(formModelObject, formObject);

  const init = async () => {
    const model = await formUi.convertFormModel(
      'https://jairocr.inrupt.net/public/form.ttl#form1',
      'https://jprod.inrupt.net/profile/card#me'
    );
    console.log('Form model', model);
    setFormModel(model);
  };
  const modifyFormObject = (id, obj) => {
    const formObject = formActions.retrieveNewFormObject(id, obj);
    setFormObject(formObject);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <form>
      <h1>Form Model</h1>
      <Form {...{ formModel, formObject, modifyFormObject }} />
    </form>
  );
});

export default FormModel;

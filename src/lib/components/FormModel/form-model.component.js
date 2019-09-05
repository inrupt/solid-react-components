import React, { useState, useCallback, useEffect, memo } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { FormActions } from 'solid-forms';

import Form from './children/Form';
import formModelObject from './form-model-example.json';

const FormModel = memo(props => {
  const [formObject, setFormObject] = useState({});
  const formActions = new FormActions(formModelObject, formObject);
  return (
    <form>
      <h1>Form Model</h1>
      <Form formModel={formModelObject} {...{ formActions, formObject, setFormObject }} />
    </form>
  );
});

export default FormModel;

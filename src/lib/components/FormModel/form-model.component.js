import React, { useState } from 'react';
import INPUTS from './input-mapping';
import Form from './form.component';
import { CheckBox, RadioButton } from './InputControls';

const FormModel = () => {
  const [text, setText] = useState('');
  const [fields, setFields] = useState([]);

  const onControlSelect = () => {
    const control = INPUTS[text];
    if (control) {
      setFields([...fields, { component: control, props: {} }]);
    }
  };

  return (
    <div>
      <input type="text" onChange={e => setText(e.target.value)} value={text} />
      <button type="button" onClick={onControlSelect}>
        Change control
      </button>

      <Form fields={fields} />
      <RadioButton label="Test" />
    </div>
  );
};

export default FormModel;

import React, { useState } from 'react';
import INPUTS from './input-mapping';
import Form from './form.component';

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
    </div>
  );
};

export default FormModel;

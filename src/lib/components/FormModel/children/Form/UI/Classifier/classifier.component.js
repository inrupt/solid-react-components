import React, { useState, useEffect, useCallback } from 'react';
import { n3Helper } from 'solid-forms';
import unique from 'unique';

type Props = {
  id: string,
  value: string,
  retrieveNewFormObject: Function,
  modifyFormObject: Function,
  onSave: Function,
  autoSave: boolean,
  formObject: object
};

const Classifier = ({
  value,
  id,
  modifyFormObject,
  formObject,
  onSave,
  autoSave,
  ...rest
}: Props) => {
  const [options, setOptions] = useState([]);
  const from = rest['ui:from'] || null;

  const init = async () => {
    const docOptions = await n3Helper.getClassifierOptions(from);
    setOptions(docOptions);
  };

  const getValueFromObject = useCallback(value => {
    return typeof value === 'object' ? value.value : value;
  });

  const getDropDownLabel = useCallback((value: string) => {
    return value && value.includes('#') ? value.split('#')[1] : value;
  });

  const onChange = ({ target }) => {
    const obj = { value: target.value, ...rest };
    modifyFormObject(id, obj);
  };
  const actualValue =
    formObject[id] || formObject[id] === '' ? getValueFromObject(formObject[id].value) : value;

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <select name={id} onBlur={autoSave && onSave} onChange={onChange} value={actualValue}>
        {options.map(option => (
          <option key={unique()} value={option}>
            {getDropDownLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Classifier;

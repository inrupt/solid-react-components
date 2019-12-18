import React, { useState, useEffect, useCallback } from 'react';
import { n3Helper } from '@inrupt/solid-sdk-forms';
import unique from 'unique';
import { SelectWrapper } from './classifier.style';
import { FormModelConfig } from '@context';

type Props = {
  id: string,
  value: string,
  retrieveNewFormObject: Function,
  modifyFormObject: Function,
  onSave: Function,
  onBlur: Function,
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
  onBlur,
  ...rest
}: Props) => {
  const [options, setOptions] = useState([]);
  const from = rest['ui:from'] || null;
  const label = rest['ui:label'] || '';

  const init = async () => {
    const values = rest['ui:values'];
    let docOptions = [];
    if (from) {
      docOptions = await n3Helper.getClassifierOptions(from);
    } else {
      docOptions = values ? [...values] : [];
    }
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
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <SelectWrapper className={theme && theme.inputText}>
          <label htmlFor={id}>{label}</label>
          <select name={id} onBlur={onBlur} onChange={onChange} value={actualValue}>
            {options.map(option => (
              <option key={unique()} value={option}>
                {getDropDownLabel(option)}
              </option>
            ))}
          </select>
        </SelectWrapper>
      )}
    </FormModelConfig.Consumer>
  );
};

export default Classifier;

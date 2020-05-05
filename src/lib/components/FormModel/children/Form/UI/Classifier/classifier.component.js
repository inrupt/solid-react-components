import React, { useState, useEffect, useCallback, useContext } from 'react';
import { n3Helper } from '@inrupt/solid-sdk-forms';
import unique from 'unique';
import { UI } from '@inrupt/lit-generated-vocab-common';
import { ThemeContext } from '@context';
import { SelectWrapper } from './classifier.style';

export const Classifier = props => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const {
    [UI.label.value]: label,
    [UI.value.value]: initialValue,
    [UI.category.value]: category,
    [UI.values.value]: values
  } = data;

  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(initialValue);

  /**
   * Init function to make use of async
   * This function fetches the classifier option list from a helper, or returns the list of hardcoded values
   * if such a list exists as a prop
   * @returns {Promise<void>}
   */
  const init = async () => {
    let optionsList = [];
    if (category) {
      optionsList = await n3Helper.getClassifierOptions(category);
    } else {
      optionsList = values ? [...values] : [];
    }
    setOptions(optionsList);
  };

  /**
   * Initialize data for the dropdown
   */
  useEffect(() => {
    init();
  }, []);

  /**
   * Fetch a user-friendly label for the option. If the option is a link, this returns the predicate name
   * @type {function(string): string}
   */
  const getDropDownLabel = useCallback((value: string) => {
    return value && value.includes('#') ? value.split('#')[1] : value;
  });

  const onChange = async event => {
    await setValue(event.target.value);
  };

  useEffect(() => {
    if (value !== initialValue) {
      const updatedPart = { ...data, value };
      updateData(id, updatedPart);
    }
  }, [value]);

  return (
    <SelectWrapper className={theme && theme.inputText}>
      <label htmlFor={id}>{label}</label>
      <select name={id} onChange={onChange} value={value}>
        {options.map(option => (
          <option key={unique()} value={option}>
            {getDropDownLabel(option)}
          </option>
        ))}
      </select>
    </SelectWrapper>
  );
};

export default Classifier;

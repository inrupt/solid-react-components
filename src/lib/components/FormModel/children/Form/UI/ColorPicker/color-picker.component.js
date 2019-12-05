import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

import { FormModelUI } from '@constants';
import { FormModelConfig } from '@context';

import { PickerGroup, ColorSwatch, Cover, Popover } from './color-picker.styles';

const ColorPicker = ({
  id,
  modifyFormObject,
  formObject,
  value,
  onSave,
  autoSave,
  onBlur,
  ...rest
}) => {
  let actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;

  /* default value for the color */
  if (!actualValue) actualValue = '#3498ef';

  const [pickerVisible, setPickerVisible] = useState(false);
  const [color, setColor] = useState(actualValue);

  const label = rest[FormModelUI.UI_LABEL] || '';
  const handleChange = color => {
    setColor(color.hex);
  };

  const handleChangeComplete = color => {
    const obj = { ...rest, value: color.hex };
    modifyFormObject(id, obj);
    setColor(color.hex);
  };

  const handleClick = () => {
    setPickerVisible(!pickerVisible);
  };

  const handleClose = () => {
    setPickerVisible(false);

    console.log('autosave: ', autoSave);
    if (autoSave) onSave();
  };

  return (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <PickerGroup className={theme && theme.colorPicker}>
          <label htmlFor={id}>{label}</label>
          <div>{color}</div>
          <ColorSwatch color={color} onClick={handleClick} />
          {pickerVisible ? (
            <Popover>
              <Cover onClick={handleClose} />
              <ChromePicker
                id
                color={color}
                onChangeComplete={handleChangeComplete}
                onChange={handleChange}
              />
            </Popover>
          ) : null}
        </PickerGroup>
      )}
    </FormModelConfig.Consumer>
  );
};

export default ColorPicker;

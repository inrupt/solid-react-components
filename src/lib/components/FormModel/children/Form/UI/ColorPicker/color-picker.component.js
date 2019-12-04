import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

import { FormModelUI } from '@constants';
import { PickerGroup, ColorSwatch, Cover, Popover } from './color-picker.styles';

const ColorPicker = ({
  id,
  modifyFormObject,
  formObject,
  value,
  onSave,
  autosave,
  onBlur,
  ...rest
}) => {
  let actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;

  /* default value for the color */
  if (!actualValue) actualValue = '#3498ef';

  const [pickerVisible, setPickerVisible] = useState(false);
  const [color, setColor] = useState(actualValue);

  const label = rest[FormModelUI.UI_LABEL] || '';
  const handleChange = (color, event) => {
    event.preventDefault();
    setColor(color.hex);
  };

  const handleChangeComplete = (color, event) => {
    event.preventDefault();
    const obj = { ...rest, value: color.hex };
    modifyFormObject(id, obj);
    onSave();
    setColor(color.hex);
  };

  const handleClick = () => {
    setPickerVisible(!pickerVisible);
  };

  const handleClose = () => {
    setPickerVisible(false);
  };

  return (
    <PickerGroup>
      <label htmlFor={id}>{label}</label>
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
  );
};

export default ColorPicker;

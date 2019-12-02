import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ id, modifyFormObject, formObject, ...rest }) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [color, setColor] = useState(formObject.value || null);

  const handleChange = color => {
    setColor(color.hex);
  };

  const handleChangeComplete = color => {
    setColor(color.hex);
    const obj = { value: color.hex, ...rest };
    modifyFormObject(id, obj);
  };

  const handleClick = () => {
    setPickerVisible(!pickerVisible);
  };

  const handleClose = () => {
    setPickerVisible(false);
  };

  const popover = {
    position: 'absolute',
    zIndex: '2'
  };
  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px'
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        {color ? JSON.stringify(color) : 'Pick Color'}
      </button>
      {pickerVisible ? (
        <div style={popover}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div style={cover} onClick={handleClose} />
          <ChromePicker
            color={color}
            onChangeComplete={handleChangeComplete}
            onChange={handleChange}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;

/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ id, modifyFormObject, formObject, ...rest }) => {
  const [show, setShow] = useState(false);

  const handleChange = (color, event) => {
    const obj = { value: color, ...rest };
    modifyFormObject(id, obj);
  };

  const handleClick = () => {
    setShow(!show);
  };

  const handleClose = () => {
    setShow(false);
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
        Pick Color
      </button>
      {show ? (
        <div style={popover}>
          <button type="button" style={cover} onClick={handleClose} />
          <ChromePicker onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;

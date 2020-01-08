import React, { useEffect, useContext, useState } from 'react';
import { ChromePicker } from 'react-color';

import { UI } from '@constants';
import { ThemeContext } from '@context';

import { PickerGroup, ColorSwatch, Cover, Popover } from './color-picker.styles';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void
};

const ColorPicker = (props: Props) => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.LABEL]: label, [UI.VALUE]: initialValue } = data;

  const [pickerVisible, setPickerVisible] = useState(false);
  const [color, setColor] = useState(initialValue);

  const handleChange = color => setColor(color.hex);

  const handleChangeComplete = color => {
    setColor(color.hex);
    updateData(id, color.hex);
  };

  const handleClick = () => {
    setPickerVisible(!pickerVisible);
  };

  const handleClose = () => {
    setPickerVisible(false);
  };

  return (
    <PickerGroup className={theme.colorField}>
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
  );
};

export default ColorPicker;

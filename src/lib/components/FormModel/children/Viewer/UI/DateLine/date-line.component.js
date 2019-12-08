import React from 'react';
import { format } from 'date-fns';

import { FormModelConfig } from '@context';
import { UITypes, FormModelUI } from '@constants';

import { Wrapper, Label, Value } from './date-line.style';

const { RDF_TYPE, UI_VALUE, UI_LABEL } = FormModelUI;

const DateLine = props => {
  const { [RDF_TYPE]: type, [UI_VALUE]: value, [UI_LABEL]: label } = props;

  let renderValue;
  if (value) {
    if (type === UITypes.DateTimeField) {
      renderValue = format(new Date(value), 'Pp');
    } else {
      renderValue = value;
    }
  } else {
    renderValue = '';
  }

  return (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <Wrapper className={theme && theme.dateLineViewerClass}>
          <Label className="label">{label}</Label>
          <Value className="value">{renderValue}</Value>
        </Wrapper>
      )}
    </FormModelConfig.Consumer>
  );
};

export default DateLine;

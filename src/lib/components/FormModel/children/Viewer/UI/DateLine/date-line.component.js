import React from 'react';
import { format } from 'date-fns';

import { FormModelConfig } from '@context';
import { UITypes, FormModelUI } from '@constants';

import { Wrapper, Label, Value } from './date-line.style';

const DateLine = ({ value, ...rest }: { value: String }) => {
  const type = rest[FormModelUI.RDF_TYPE];

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
          <Label className="label">{rest[FormModelUI.UI_LABEL]}</Label>
          <Value className="value">{renderValue}</Value>
        </Wrapper>
      )}
    </FormModelConfig.Consumer>
  );
};

export default DateLine;

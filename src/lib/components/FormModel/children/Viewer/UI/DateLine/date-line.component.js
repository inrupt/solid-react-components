import React from 'react';
import { format } from 'date-fns';

import { FormModelConfig } from '@context';
import { UITypes, FormModelUI } from '@constants';
import { getClosestLocale } from '@utils';

import { Wrapper, Label, Value } from './date-line.style';

const DateLine = ({ value, ...rest }: { value: String }) => {
  const type = rest[FormModelUI.RDF_TYPE];
  const locale = getClosestLocale();

  let renderValue;
  try {
    if (type === UITypes.DateTimeField) {
      renderValue = format(new Date(value), 'Pp', { locale });
    }

    if (type === UITypes.DateField) {
      const [year, month, day] = value.split('-').map(n => Number(n));
      renderValue = format(new Date(year, month - 1, day), 'P', { locale });
    }

    if (type === UITypes.TimeField) {
      const [hours, minutes, seconds] = value.split(':').map(n => Number(n));
      renderValue = format(new Date(2000, 0, 1, hours, minutes, seconds), 'p', { locale });
    }
  } catch {
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

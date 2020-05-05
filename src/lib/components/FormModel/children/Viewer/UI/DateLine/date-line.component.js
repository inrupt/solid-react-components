import React from 'react';
import { format } from 'date-fns';

import { RDF, UI } from '@inrupt/lit-generated-vocab-common';
import { FormModelConfig } from '@context';
import { getClosestLocale } from '@utils';

import { Wrapper, Label, Value } from './date-line.style';

type Props = {
  data: object,
  formModel: object,
  parent: object,
  name: String
};

const DateLine = (props: Props) => {
  const { data, formModel, parent, name } = props;
  const type = data[RDF.type.value];
  const locale = getClosestLocale();
  const value = data[UI.value.value];

  let renderValue;
  try {
    if (type === UI.DateTimeField.value) {
      renderValue = format(new Date(value), 'Pp', { locale });
    }

    if (type === UI.DateField.value) {
      const [year, month, day] = value.split('-').map(n => Number(n));
      renderValue = format(new Date(year, month - 1, day), 'P', { locale });
    }

    if (type === UI.TimeField.value) {
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
          <Label className="label">{data[UI.label.value]}</Label>
          <Value className="value">{renderValue}</Value>
        </Wrapper>
      )}
    </FormModelConfig.Consumer>
  );
};

export default DateLine;

import React from 'react';
import moment from 'moment';
import { FormModelConfig } from '@context';
import { Wrapper, Label, Value } from './date-line.style';

const DateLine = ({ value, format = 'D, MMM YYYY', ...rest }) => {
  return value ? (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <Wrapper className={theme && theme.dateLineViewerClass}>
          <Label className="label">{rest['ui:label']}</Label>
          <Value className="value">{moment(value).format(format)}</Value>
        </Wrapper>
      )}
    </FormModelConfig.Consumer>
  ) : null;
};

export default DateLine;

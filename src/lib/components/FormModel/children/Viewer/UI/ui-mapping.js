import React from 'react';
import { UITypes } from '@constants';

import SingleLine from './SingleLine';
import MultiLine from './MultiLine';
import DateLine from './DateLine';
import BoolLine from './BoolLine';
import ColorLine from './ColorLine';
import Heading from '../../Form/UI/Heading';
import Comment from '../../Form/UI/Comment';

const UIMapping = type => {
  let component;
  switch (type) {
    case UITypes.SingleLineTextField:
      component = SingleLine;
      break;
    case UITypes.MultiLineTextField:
      component = MultiLine;
      break;
    case UITypes.DecimalField:
      component = SingleLine;
      break;
    case UITypes.FloatField:
      component = SingleLine;
      break;
    case UITypes.IntegerField:
      component = SingleLine;
      break;
    case UITypes.EmailField:
      component = SingleLine;
      break;
    case UITypes.PhoneField:
      component = SingleLine;
      break;
    case UITypes.TriStateField:
      component = SingleLine;
      break;
    case UITypes.BooleanField:
      component = BoolLine;
      break;
    case UITypes.ColorField:
      component = ColorLine;
      break;
    case UITypes.DateField:
      component = props => <DateLine {...props} />;
      break;
    case UITypes.DateTimeField:
      component = props => <DateLine {...props} />;
      break;
    case UITypes.TimeField:
      component = props => <DateLine {...props} />;
      break;
    case UITypes.Classifier:
      component = SingleLine;
      break;
    case UITypes.Heading:
      component = Heading;
      break;
    case UITypes.Comment:
      component = Comment;
      break;
    default:
      component = null;
  }
  return component;
};

export default UIMapping;

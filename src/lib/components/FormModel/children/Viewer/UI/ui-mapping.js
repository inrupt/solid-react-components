import React from 'react';

import { SingleLine } from './SingleLine';
import MultiLine from './MultiLine';
import DateLine from './DateLine';
import { BoolLine } from './BoolLine';
import ColorLine from './ColorLine';
import { Heading } from '../../Form/UI/Heading';
import { Comment } from '../../Form/UI/Comment';
import { UI } from '@inrupt/lit-generated-vocab-common';

const UIMapping = type => {
  let component;
  switch (type) {
    case UI.SingleLineTextField.value:
      component = SingleLine;
      break;
    case UI.MultiLineTextField.value:
      component = MultiLine;
      break;
    case UI.DecimalField.value:
      component = SingleLine;
      break;
    case UI.FloatField.value:
      component = SingleLine;
      break;
    case UI.IntegerField.value:
      component = SingleLine;
      break;
    case UI.EmailField.value:
      component = SingleLine;
      break;
    case UI.PhoneField.value:
      component = SingleLine;
      break;
    case UI.TriStateField.value:
      component = SingleLine;
      break;
    case UI.BooleanField.value:
      component = BoolLine;
      break;
    case UI.ColorField.value:
      component = ColorLine;
      break;
    case UI.DateField.value:
      component = props => <DateLine {...props} />;
      break;
    case UI.DateTimeField.value:
      component = props => <DateLine {...props} />;
      break;
    case UI.TimeField.value:
      component = props => <DateLine {...props} />;
      break;
    case UI.Classifier.value:
      component = SingleLine;
      break;
    case UI.Heading.value:
      component = Heading;
      break;
    case UI.Comment.value:
      component = Comment;
      break;
    default:
      component = null;
  }
  return component;
};

export default UIMapping;

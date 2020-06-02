import React from 'react';

import { UI } from '@inrupt/lit-generated-vocab-common';
import { SingleLine } from './SingleLine';
import MultiLine from './MultiLine';
import DateLine from './DateLine';
import { BoolLine } from './BoolLine';
import ColorLine from './ColorLine';
import { Heading } from '../../Form/UI/Heading';
import { Comment } from '../../Form/UI/Comment';

const UIMapping = type => {
  let component;
  switch (type) {
    case UI.SingleLineTextField.iriAsString:
      component = SingleLine;
      break;
    case UI.MultiLineTextField.iriAsString:
      component = MultiLine;
      break;
    case UI.DecimalField.iriAsString:
      component = SingleLine;
      break;
    case UI.FloatField.iriAsString:
      component = SingleLine;
      break;
    case UI.IntegerField.iriAsString:
      component = SingleLine;
      break;
    case UI.EmailField.iriAsString:
      component = SingleLine;
      break;
    case UI.PhoneField.iriAsString:
      component = SingleLine;
      break;
    case UI.TriStateField.iriAsString:
      component = SingleLine;
      break;
    case UI.BooleanField.iriAsString:
      component = BoolLine;
      break;
    case UI.ColorField.iriAsString:
      component = ColorLine;
      break;
    case UI.DateField.iriAsString:
      component = props => <DateLine {...props} />;
      break;
    case UI.DateTimeField.iriAsString:
      component = props => <DateLine {...props} />;
      break;
    case UI.TimeField.iriAsString:
      component = props => <DateLine {...props} />;
      break;
    case UI.Classifier.iriAsString:
      component = SingleLine;
      break;
    case UI.Heading.iriAsString:
      component = Heading;
      break;
    case UI.Comment.iriAsString:
      component = Comment;
      break;
    default:
      component = null;
  }
  return component;
};

export default UIMapping;

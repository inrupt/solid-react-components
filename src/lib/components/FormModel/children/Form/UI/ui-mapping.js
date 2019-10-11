import Input from './Input';
import Classifier from './Classifier';
import Comment from './Comment';
import Heading from './Heading';
import TextArea from './TextArea';
import RadioButton from './RadioButton';
import CheckBox from './CheckBox';

import { UITypes } from '@constants';

const UIMapping = type => {
  let component;
  switch (type) {
    case UITypes.MultiLineTextField:
      component = TextArea;
      break;
    case UITypes.TriStateField:
      component = RadioButton;
      break;
    case UITypes.BooleanField:
      component = CheckBox;
      break;
    case UITypes.Classifier:
      component = Classifier;
      break;
    case UITypes.Heading:
      component = Heading;
      break;
    case UITypes.Comment:
      component = Comment;
      break;
    default:
      component = Input;
  }
  return component;
};

export default UIMapping;

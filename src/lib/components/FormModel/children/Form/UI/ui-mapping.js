import Input from './Input';
import Classifier from './Classifier';
import Comment from './Comment';
import Heading from './Heading';
import TextArea from './TextArea';
import RadioButton from './RadioButton';
import CheckBox from './CheckBox';
import DateTimePicker from './DateTimePicker';
import Decimal from './Decimal';
import Integer from './Integer';
import Float from './Float';

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
    case UITypes.DateTimeField:
    case UITypes.TimeField:
    case UITypes.DateField:
      component = DateTimePicker;
      break;
    case UITypes.DecimalField:
      component = Decimal;
      break;
    case UITypes.IntegerField:
      component = Integer;
      break;
    case UITypes.FloatField:
      component = Float;
      break;
    default:
      component = Input;
  }
  return component;
};

export default UIMapping;

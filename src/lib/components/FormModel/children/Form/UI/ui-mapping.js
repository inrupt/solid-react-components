import Input from './Input';
import Classifier from './Classifier';
import Comment from './Comment';
import Heading from './Heading';
import TextArea from './TextArea';
// import RadioButtonList from './RadioButtonList';
import RadioButton from './RadioButton';
// import CheckBoxList from './CheckBoxList';
import CheckBox from './CheckBox';

import { UITypes } from '@constants';

const UIMapping = type => {
  let component;
  switch (type) {
    case UITypes.SingleLineTextField:
      component = Input;
      break;
    case UITypes.MultiLineTextField:
      component = TextArea;
      break;
    case UITypes.DecimalField:
      component = Input;
      break;
    case UITypes.FloatField:
      component = Input;
      break;
    case UITypes.IntegerField:
      component = Input;
      break;
    case UITypes.EmailField:
      component = Input;
      break;
    case UITypes.PhoneField:
      component = Input;
      break;
    case UITypes.TriStateField:
      component = RadioButton;
      break;
    case UITypes.BooleanField:
      component = CheckBox;
      break;
    case UITypes.ColorField:
      component = Input;
      break;
    case UITypes.DateField:
      component = Input;
      break;
    case UITypes.DateTimeField:
      component = Input;
      break;
    case UITypes.TimeField:
      component = Input;
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

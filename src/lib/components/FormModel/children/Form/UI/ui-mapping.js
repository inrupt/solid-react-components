import Input from './Input';
import Classifier from './Classifier';
import { UITypes } from '@constants';

const UIMapping = type => {
  let component;
  switch (type) {
    case UITypes.SingleLineTextField:
      component = Input;
      break;
    case UITypes.MultiLineTextField:
      component = 'textarea';
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
    case UITypes.BooleanField:
      component = Input;
      break;
    case UITypes.TriStateField:
      component = Input;
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
      component = 'label';
      break;
    case UITypes.Comment:
      component = 'span';
      break;
    default:
      component = Input;
  }
  return component;
};

export default UIMapping;

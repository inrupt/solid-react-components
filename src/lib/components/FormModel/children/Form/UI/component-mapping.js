import { UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

import { Heading } from './Heading';
import { Comment } from './Comment';
import { Input } from './Input';
import { DateTimePicker } from './DateTimePicker';
import { CheckBox } from './CheckBox';
import { Decimal } from './Decimal';
import { TextArea } from './TextArea';
import { Float } from './Float';
import { Email } from './Email';
import { Phone } from './Phone';
import { Integer } from './Integer';
import { ColorPicker } from './ColorPicker';
import { Multiple } from '../../Multiple';
import { Group } from '../../Group';
import Classifier from './Classifier';

export const Mapping = {
  [UI.Heading.value]: Heading,
  [UI.Comment.value]: Comment,
  [UI.SingleLineTextField.value]: Input,
  [UI.IntegerField.value]: Integer,
  [UI.DateField.value]: DateTimePicker,
  [UI.DateTimeField.value]: DateTimePicker,
  [UI.TimeField.value]: DateTimePicker,
  [UI.BooleanField.value]: CheckBox,
  [UI.DecimalField.value]: Decimal,
  [UI.MultiLineTextField.value]: TextArea,
  [UI.FloatField.value]: Float,
  [UI.EmailField.value]: Email,
  [UI.PhoneField.value]: Phone,
  [UI.ColorField.value]: ColorPicker,
  [UI.Multiple.value]: Multiple,
  [UI.Group.value]: Group,
  [UI.Classifier.value]: Classifier
};

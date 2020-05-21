import { UI } from '@inrupt/lit-generated-vocab-common';

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
  [UI.Heading]: Heading,
  [UI.Comment]: Comment,
  [UI.SingleLineTextField]: Input,
  [UI.IntegerField]: Integer,
  [UI.DateField]: DateTimePicker,
  [UI.DateTimeField]: DateTimePicker,
  [UI.TimeField]: DateTimePicker,
  [UI.BooleanField]: CheckBox,
  [UI.DecimalField]: Decimal,
  [UI.MultiLineTextField]: TextArea,
  [UI.FloatField]: Float,
  [UI.EmailField]: Email,
  [UI.PhoneField]: Phone,
  [UI.ColorField]: ColorPicker,
  [UI.Multiple]: Multiple,
  [UI.Group]: Group,
  [UI.Classifier]: Classifier
};

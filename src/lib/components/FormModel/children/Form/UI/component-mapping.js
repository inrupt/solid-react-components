import { VOCAB } from '@constants';

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
import { RadioButton } from './RadioButton';
import { Integer } from './Integer';
import { ColorPicker } from './ColorPicker';


export const Mapping = {
  [VOCAB.UI.Heading]: Heading,
  [VOCAB.UI.Comment]: Comment,
  [VOCAB.UI.SingleLineTextField]: Input,
  [VOCAB.UI.IntegerField]: Integer,
  [VOCAB.UI.DateField]: DateTimePicker,
  [VOCAB.UI.DateTimeField]: DateTimePicker,
  [VOCAB.UI.TimeField]: DateTimePicker,
  [VOCAB.UI.BooleanField]: CheckBox,
  [VOCAB.UI.DecimalField]: Decimal,
  [VOCAB.UI.MultiLineTextField]: TextArea,
  [VOCAB.UI.FloatField]: Float,
  [VOCAB.UI.EmailField]: Email,
  [VOCAB.UI.PhoneField]: Phone,
  [VOCAB.UI.TriStateField]: RadioButton,
  [VOCAB.UI.ColorField]: ColorPicker
};

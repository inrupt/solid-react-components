import React from 'react';
import { shallow } from 'enzyme';
import Example from './Example';

import '../../utils/enzymeSetup';

it('Example renders without crashing', () => {
  const wrapper = shallow(<Example />);
  expect(wrapper).toBeTruthy();
});

import React from 'react';
import { shallow } from 'enzyme';
import Example from './Example';

import '@testSetup';

it('Example renders without crashing', () => {
  const wrapper = shallow(<Example />);
  expect(wrapper).toBeTruthy();
});

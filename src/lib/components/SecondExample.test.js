import React from 'react';
import { shallow } from 'enzyme';
import SecondExample from './SecondExample';

import '../../utils/enzymeSetup';

it('SecondExample renders without crashing', () => {
  const wrapper = shallow(<SecondExample />);
  expect(wrapper).toBeTruthy();
});

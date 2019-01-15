import React from 'react';
import { shallow, mount } from 'enzyme';
import ProviderLogin from './provider-login.container';
import { SolidLinkButton } from '../../styled-components';

import '../../../utils/enzymeSetup';

const setup = () => shallow(<ProviderLogin />);
describe('Provider Login Container', () => {
  it('renders without crashing', () => {
    const wrapper = setup();
    expect(wrapper).toBeTruthy();
  });

  it('initial error state should be null', () => {
    const wrapper = setup();
    const initialState = wrapper.state('error');
    expect(initialState).toBe(null);
  });

  it('clicking link button should update to true withWebId state', () => {
    const wrapper = mount(<ProviderLogin />);
    const initialState = wrapper.state('withWebId');
    const button = wrapper.find(SolidLinkButton);

    expect(initialState).toBeFalsy();

    button.simulate('click');
    wrapper.update();

    expect(!initialState).toBeTruthy();

  });
});

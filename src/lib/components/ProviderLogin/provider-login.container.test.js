import React from "react";
import { shallow, mount } from "enzyme";
import auth from 'solid-auth-client';
import ProviderLogin from "./provider-login.container";
import { ProviderSelect } from "@components";
import {
  SolidLinkButton,
  SolidButton,
  ErrorMessage,
  SolidInput
} from "@styled-components";

import "@testSetup";

const setup = () => shallow(<ProviderLogin />);
const setupMount = () => mount(<ProviderLogin />);

describe("Provider Login Container", () => {
  it("renders without crashing", () => {
    const wrapper = setup();
    expect(wrapper).toBeTruthy();
  });

  it("initial error state should be null", () => {
    const wrapper = setup();
    const initialState = wrapper.state("error");
    expect(initialState).toBe(null);
  });

  it("clicking link button should update to true withWebId state", () => {
    const wrapper = setupMount();
    const initialState = wrapper.state("withWebId");
    const button = wrapper.find(SolidLinkButton);

    expect(initialState).toBeFalsy();

    button.simulate("click");
    wrapper.update();

    expect(!initialState).toBeTruthy();
  });

  it('logs the user in when submit', async () => {
    const wrapper = setupMount();
    const button = wrapper.find(SolidButton);
    expect(auth.login).not.toBeCalled();

    wrapper.setState({ idp: 'https://inrupt.net/auth' });
    wrapper.setProps({ callback: () => {} });

    await button.simulate('submit');
    expect(auth.login).toBeCalledTimes(1);
  });

  it("clicking submit login form should render error message component", () => {
    const wrapper = setupMount();
    const button = wrapper.find(SolidButton);

    button.simulate("submit");
    wrapper.update();

    const errorMessage = wrapper.find(ErrorMessage).length;

    expect(errorMessage).toEqual(1);
  });

  it("clicking to change select to input webId should render solid text input", () => {
    const wrapper = setupMount();
    const button = wrapper.find(SolidLinkButton);

    button.simulate("click");
    wrapper.update();

    const errorMessage = wrapper.find(SolidInput).length;

    expect(errorMessage).toEqual(1);
  });

  it("initial withWebId state should render select provider component", () => {
    const wrapper = setupMount();
    const errorMessage = wrapper.find(ProviderSelect).length;

    expect(errorMessage).toEqual(1);
  });
});

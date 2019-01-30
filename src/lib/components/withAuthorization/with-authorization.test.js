import React from "react";
import auth from 'solid-auth-client';
import { Redirect, MemoryRouter } from "react-router-dom";

import { mount } from "enzyme";
import { withAuthorization } from "@components";

import "@testSetup";


const ComponentExample = () => <div>Component Example</div>;
const ComponentLoader = () => <div>Loader Example</div>;

describe('A withWebId wrapper', () => {
  const defaultWeb = "https://example.org/#me";
  const Wrapper = withAuthorization(ComponentExample, <ComponentLoader />);
  let wrapper;

  beforeAll(() => (wrapper = mount(<MemoryRouter><Wrapper /></MemoryRouter>)));
  beforeEach(() => wrapper.update());
  afterAll(() => wrapper.unmount());

  describe('before a session is received', () => {
    it('renders the loader component', () => {
      expect(wrapper.find(ComponentLoader).length).toEqual(1);
    });
  });

  describe('when the user is not logged in', () => {
    beforeAll(() => auth.mockWebId(null));

    it('redirect user', () => {
      expect(wrapper.find(Redirect).length).toEqual(1);
    });
  });

  describe('when the user is logged in', () => {
    beforeAll(() => auth.mockWebId(defaultWeb));

    it('renders the wrapped component', () => {
      expect(wrapper.find(ComponentExample).length).toEqual(1);
    });
  });
});

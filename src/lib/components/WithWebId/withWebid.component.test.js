import React from "react";
import auth from 'solid-auth-client';
import { mount } from "enzyme";
import { withWebId } from "@components";

import "@testSetup";

const Component = () => <div>Child Component</div>;
const wrapperContent = '<div>Child Component</div>';
const defaultWebId = 'https://example.org/#me';

describe("withWebID Component", () => {
  const WrapperComponent = withWebId(Component);
  let wrapper;

  beforeAll(() => (wrapper = mount(<WrapperComponent />)));
  beforeEach(() => wrapper.update());
  afterAll(() => wrapper.unmount());

  describe('before a session is received', () => {
      it('renders the wrapped component', () => {
        expect(wrapper.html()).toBe(wrapperContent);
      });

      it('passes a webID of null to the wrapped component', () => {
        expect(wrapper.childAt(0).props()).toHaveProperty('webId', null);
      });
  });

  describe('when the user is not logged in', () => {
    beforeAll(() => auth.mockWebId(null));

    it('renders the wrapped component', () => {
      expect(wrapper.html()).toBe(wrapperContent);
    });

    it('passes a webID of null to the wrapped component', () => {
      expect(wrapper.childAt(0).props()).toHaveProperty('webId', null);
    });
  });

  describe('when the user is logged in', () => {
    beforeAll(() => auth.mockWebId(defaultWebId));

    it('renders the wrapped component', () => {
      expect(wrapper.html()).toBe(wrapperContent);
    });

    it("passes the user's webID to the wrapped component", () => {
      expect(wrapper.childAt(0).props()).toHaveProperty('webId', defaultWebId);
    });
  });
});

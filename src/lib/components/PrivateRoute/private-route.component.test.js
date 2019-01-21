import React from "react";
import { Route, Redirect, MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { PrivateRoute } from "@components";

import "@testSetup";

const shallowErrors = codeRun => {
  const error = console.error;

  console.error = () => {};

  codeRun();

  console.error = error;
};

describe("Private Route", () => {
  const defaultWeb = "https://example.org/#me";
  shallowErrors(() => {
    const setup = webId =>
      mount(
        <MemoryRouter>
          <PrivateRoute webId={webId} redirect="/test" />
        </MemoryRouter>
      );

    describe("before user login", () => {
      const wrapper = setup(null);
      const wrapperChild = wrapper.find(PrivateRoute);

      it("should render redirect", () => {
        expect(wrapperChild.props().webId).toEqual(null);
        expect(wrapper.find(Redirect).length).toEqual(1);
      });
    });

    describe("before user login", () => {
      const wrapper = setup(defaultWeb);
      const wrapperChild = wrapper.find(PrivateRoute);

      it("should render route", () => {
        expect(wrapperChild.props().webId).toEqual(defaultWeb);
        expect(wrapper.find(Route).length).toEqual(1);
      });
    });
  });
});

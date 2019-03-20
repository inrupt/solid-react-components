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

    describe("before check session", () => {
      const wrapper = setup();

      it("should render loading", () => {
        expect(wrapper.text()).toEqual("We are validating your data...");
      });
    });

    describe("invalid session", () => {
      const wrapper = setup(null);
      const childWrapper = wrapper.find(PrivateRoute);

      it("should render redirect", () => {
        expect(childWrapper.find(Redirect).length).toEqual(1);
      });
    });

    describe("when user is logged", () => {
      const wrapper = setup(defaultWeb);
      const childWrapper = wrapper.find(PrivateRoute);

      it("should render route", () => {
        expect(childWrapper.props().webId).toEqual(defaultWeb);
        expect(childWrapper.find(Route).length).toEqual(1);
      });
    });
  });
});

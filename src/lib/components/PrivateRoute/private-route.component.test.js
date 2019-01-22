import React from "react";
import { Route, Redirect } from "react-router-dom";
import { shallow } from "enzyme";
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
    const setup = () => shallow(<PrivateRoute redirect="/test" />);

    describe("before check session", () => {
      const wrapper = setup();

      it("should render loading", () => {
        wrapper.setState({ webId: null, checked: false });
        expect(wrapper.text()).toEqual('We are validating your data...');
      });
    });

    describe("after check invalid session", () => {
      const wrapper = setup();

      it("should render redirect", () => {
        wrapper.setState({ webId: null, checked: true });
        expect(wrapper.find(Redirect).length).toEqual(1);
      });
    });

    describe("before user logged", () => {
      const wrapper = setup();

      it("should render route", () => {
        wrapper.setState({ webId: defaultWeb, checked: true });
        wrapper.update();

        expect(wrapper.state().webId).toEqual(defaultWeb);
        expect(wrapper.find(Route).length).toEqual(1);
      });
    });
  });
});

import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, cleanup } from 'react-testing-library';
import { PrivateRoute } from "@components";

import 'jest-dom/extend-expect';

const shallowErrors = codeRun => {
  const error = console.error;

  console.error = () => {};

  codeRun();

  console.error = error;
};

afterAll(cleanup);

describe("Private Route", () => {
  const defaultWeb = "https://example.org/#me";
  shallowErrors(() => {
    const { container, rerender } = render(<MemoryRouter>
      <PrivateRoute webId={undefined}/>
    </MemoryRouter>);

    it("should render loading when user is not logged", () => {
      expect(container).toHaveTextContent("We are validating your data...");
    });


    it("should not render loader when user is logged", () => {
      rerender(<MemoryRouter>
        <PrivateRoute webId={defaultWeb} />
      </MemoryRouter>);
      expect(container).not.toHaveTextContent("We are validating your data...");
    });
  });
});

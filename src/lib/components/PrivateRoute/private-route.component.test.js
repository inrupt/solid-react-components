import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, cleanup } from 'react-testing-library';
import { PrivateRoute } from "./private-route.component";

import 'jest-dom/extend-expect';


afterAll(cleanup);

describe("Private Route", () => {

  const defaultWeb = "https://example.org/#me";
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

import React from "react";
import { render, cleanup } from 'react-testing-library';
import { ProviderSelect } from "@components";


describe("ProviderSelect", () => {
  const { container } = render(<ProviderSelect />);
  it("should render without crashing", () => {
    expect(container).toBeTruthy();
  });
});

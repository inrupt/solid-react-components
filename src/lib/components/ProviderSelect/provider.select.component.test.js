import React from "react";
import { shallow } from "enzyme";
import { ProviderSelect } from "@components";

import "../../../utils/enzymeSetup";

const setup = () => shallow(<ProviderSelect />);

describe("ProviderSelect", () => {
  it("renders without crashing", () => {
    const wrapper = setup();
    expect(wrapper).toBeTruthy();
  });
});

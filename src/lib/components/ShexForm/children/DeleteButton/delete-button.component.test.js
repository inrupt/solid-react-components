import React from "react";
import { ShexConfig } from "@context";
import { cleanup, render } from "react-testing-library";
import { DeleteButton } from "./delete-button.component";
import "jest-dom/extend-expect";

afterAll(cleanup);

const languageTheme = {
  language: "en",
  addButtonText: "+ Add new "
};


const defaultExpression = {
  annotations: []
};

const setup = (props, config) => {
  return (
    <ShexConfig.Provider value={config}>
      <DeleteButton {...props} />
    </ShexConfig.Provider>
  );
};

describe("Shex ShapeForm Component", () => {
    const config = { theme: {}, languageTheme: {
        language: "en",
        addButtonText: "+ Add new "
      }, config: {} };

  const component = setup(
    { canDelete: true, defaultExpression },
    config
  );
  const { container, rerender } = render(component);

  it("should renders without crashing", () => {
    expect(container).toBeTruthy();
  });

  it("should renders language version", () => {
    const config = {
      theme: {},
      config: {},
      languageTheme: {
        language: "es",
        deleteButton: "Eliminar"
      }
    };
    const component = setup(
      { canDelete: true, defaultExpression },
      config
    );

    rerender(component);
    expect(container).toHaveTextContent("Eliminar");
  });

  it("should not renders if canDelete is false", () => {
    const component = setup(
      { canDelete: false, defaultExpression },
      config
    );
    rerender(component);

    expect(container).toHaveTextContent("");
  });
});

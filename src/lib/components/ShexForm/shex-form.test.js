import React from "react";
import { render, cleanup } from "react-testing-library";
import ShexForm from "./shex-form.component";
import "jest-dom/extend-expect";

afterAll(cleanup);

const shexj = {
  type: "Shape",
  expression: {
    expressions: [
      {
        type: "TripleConstraint",
        predicate: "http://www.w3.org/2006/vcard/ns#fn",
        valueExpr: {
          type: "NodeConstraint",
          datatype: "http://www.w3.org/2001/XMLSchema#string"
        },
        annotations: [],
        _formValues: [
          {
            type: "NodeConstraint",
            datatype: "http://www.w3.org/2001/XMLSchema#string",
            _formFocus: {
              value: "Jane",
              parentSubject: "https://webid/profile/card#me",
              name: "7bb3baa7ecef1191a73e55a118b5b01a",
              isNew: false
            }
          }
        ]
      }
    ]
  },
  id: "http://localhost:3000/#UserProfile"
};
describe("Shex ShapeForm Component", () => {
  const onDeleteMock = jest.fn();
  const onChangeMock = jest.fn();
  const addNewExpressionMock = jest.fn();
  const updateShexjMock = jest.fn();
  const { container  } = render(
    <ShexForm
      shexj={shexj}
      onChange={onChangeMock}
      onDelete={onDeleteMock}
      addNewExpression={addNewExpressionMock}
      updateShexj={updateShexjMock}
      formValues={{}}
    />
  );

  it("should renders without crashing", () => {
    expect(container).toBeTruthy();
  });
  
});

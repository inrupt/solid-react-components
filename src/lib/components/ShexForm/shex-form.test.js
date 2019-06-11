import React from 'react';
import { render, cleanup } from 'react-testing-library';
import ShexForm from './shex-form.component';
import { ShexConfig } from '@context';
import 'jest-dom/extend-expect';

const shexj = {
  type: 'Shape',
  expression: {
    expressions: [
      {
        type: 'TripleConstraint',
        predicate: 'http://www.w3.org/2006/vcard/ns#fn',
        valueExpr: {
          type: 'NodeConstraint',
          datatype: 'http://www.w3.org/2001/XMLSchema#string'
        },
        annotations: [],
        _formValues: [
          {
            type: 'NodeConstraint',
            datatype: 'http://www.w3.org/2001/XMLSchema#string',
            _formFocus: {
              value: 'Jane',
              parentSubject: 'https://webid/profile/card#me',
              name: '7bb3baa7ecef1191a73e55a118b5b01a',
              isNew: false
            }
          }
        ]
      }
    ]
  },
  id: 'http://localhost:3000/#UserProfile'
};

afterAll(cleanup);

const setup = () => {
  const config = {
    theme: {},
    languageTheme: {},
    config: {
      onChange: jest.fn()
    }
  };

  return (
    <ShexConfig.Provider value={config}>
      <ShexForm shexj={shexj} formValues={{}} />
    </ShexConfig.Provider>
  );
};

describe('Shex ShapeForm Component', () => {
  const component = setup(shexj, null, {});
  const { container, getByText, getByValue, getAllByText } = render(component);

  it('should renders without crashing', () => {
    expect(container).toBeTruthy();
  });

  // eslint-disable-next-line prettier/prettier
  it("it should have 'fn' as label", () => {
    const deleteButtons = getByText('fn');
    expect(deleteButtons).toBeTruthy();
  });

  it('it should have an input', () => {
    const input = getByValue('Jane');
    expect(input).toBeTruthy();
  });

  // eslint-disable-next-line prettier/prettier
  it("it should have a '+ Add' button", () => {
    const input = getAllByText('+ Add new fn');
    expect(input).toBeTruthy();
  });
});

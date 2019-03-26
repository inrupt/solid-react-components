import React from "react";
import auth from 'solid-auth-client';
import { MemoryRouter } from "react-router-dom";
import { render, cleanup } from 'react-testing-library';
import { withAuthorization } from "@components";
import 'jest-dom/extend-expect';

const ComponentExample = () => <div>Component Example</div>;
const ComponentLoader = () => <div>Loader Component</div>;

describe('A withWebId wrapper', () => {
  const defaultWeb = "https://example.org/#me";
  const Wrapper = withAuthorization(ComponentExample, <ComponentLoader />);
  const { container } = render(<MemoryRouter><Wrapper/></MemoryRouter>);

  /**
   *  This is a workaround to avoid console warning message on react-dom.
   *  If you want to know more about please go to:
   *  https://github.com/facebook/react/issues/14769#issuecomment-470097212
   */

  const originalError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    cleanup();
  });


  describe('before a session is received', () => {
    it('renders the loader component', () => {
      expect(container).toHaveTextContent('Loader Component');
    });
  });

  describe('when the user is not logged in', () => {
    beforeAll(() => auth.mockWebId(null));

    it('redirect user', () => {
      expect(container).not.toHaveTextContent('Component');
      expect(container).not.toHaveTextContent('Loader Component');
    });
  });

  describe('when the user is logged in', () => {
    beforeAll(() => auth.mockWebId(defaultWeb));

    it('renders the wrapped component', () => {
      expect(container).toHaveTextContent('Component Example');
    });
  });
});

import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import auth from 'solid-auth-client';
import ProviderLogin from './provider-login.container';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container, getByTestId } = render(<ProviderLogin />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });

  it('should render WebId by default', () => {
    const selectEl = document.querySelector('[data-testid="input-webid"]');

    expect(selectEl).toBeInTheDocument();
  });

  it('clicking link button should render Provider Select', () => {
    const button = getByTestId('change-mode-button');

    fireEvent.click(button);

    expect(container).toHaveTextContent('Select ID Provider');
  });

  it('should not call login without webId or provider', async () => {
    const formButtonEl = document.querySelector('[data-testid="provider-form-button"]');

    fireEvent.click(formButtonEl);

    expect(auth.login).toBeCalledTimes(0);
  });
});

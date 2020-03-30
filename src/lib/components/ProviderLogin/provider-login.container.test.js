import React from 'react';
import { render, cleanup, fireEvent, getByTestId } from '@testing-library/react';
import auth from 'solid-auth-client';
import ProviderLogin from './provider-login.container';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  it('shoud renders without crashing', () => {
    const { container } = render(<ProviderLogin />);
    expect(container).toBeTruthy();
  });

  it('should render WebId by default', () => {
    const { getByTestId } = render(<ProviderLogin />);
    const selectEl = getByTestId('input-webid');

    expect(selectEl).toBeInTheDocument();
  });

  it('clicking link button should render Provider Select', () => {
    const { container, getByTestId } = render(<ProviderLogin />);
    const button = getByTestId('change-mode-button');

    fireEvent.click(button);

    expect(container).toHaveTextContent('Select ID Provider');
  });

  it('should not call login without webId or provider', async () => {
    const { getByTestId } = render(<ProviderLogin />);
    const formButtonEl = getByTestId('provider-form-button');

    fireEvent.click(formButtonEl);

    expect(auth.login).toBeCalledTimes(0);
  });
});

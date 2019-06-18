import React from 'react';
import styled from 'styled-components';
import { ProviderSelect } from '@components';
import { SolidInput, SolidLinkButton, SolidButton, ErrorMessage } from '@styled-components';

const LoginFormWrapper = styled.div`
  button {
    margin: 20px auto;
    display: block;
  }
`;

const LoginForm = props => {
  const {
    className,
    onSubmit,
    error,
    withWebId,
    selectPlaceholder,
    onSelectChange,
    providers,
    onChangeInput,
    inputPlaholder,
    optionToggle,
    btnTxtProvider,
    btnTxtWebId,
    formButtonText
  } = props;
  return (
    <LoginFormWrapper className={`solid-provider-login-component ${className} ${error && 'error'}`}>
      <form onSubmit={onSubmit}>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
        {!withWebId ? (
          <ProviderSelect
            {...{
              placeholder: selectPlaceholder,
              onChange: onSelectChange,
              options: providers,
              components: true,
              name: 'provider'
            }}
          />
        ) : (
          <SolidInput
            type="text"
            name="idp"
            onChange={onChangeInput}
            placeholder={inputPlaholder}
            data-testid="input-webid"
          />
        )}
        <SolidLinkButton
          type="button"
          className="link"
          onClick={optionToggle}
          data-testid="change-mode-button"
        >
          {withWebId ? btnTxtProvider : btnTxtWebId}
        </SolidLinkButton>
        <SolidButton type="submit" data-testid="provider-form-button">
          {formButtonText}
        </SolidButton>
      </form>
    </LoginFormWrapper>
  );
};

export default LoginForm;

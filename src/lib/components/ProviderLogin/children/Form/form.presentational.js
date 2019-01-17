import React from "react";
import styled from "styled-components";
import { ProviderSelect } from "@components";
import {
  SolidInput,
  SolidLinkButton,
  SolidButton,
  ErrorMessage
} from "@styled-components";

const LoginFormWrapper = styled.div`
  button {
    margin: 20px auto;
    display: block;
  }
`;

const LoginForm = props => {
  return (
    <LoginFormWrapper
      className={`solid-provider-login-component ${
        props.className
      } ${props.error && "error"}`}
    >
      <form onSubmit={props.onSubmit}>
        {props.error && <ErrorMessage>{props.error.message}</ErrorMessage>}
        {!props.withWebId ? (
          <ProviderSelect
            {...{
              placeholder: props.selectPlaceholder,
              onChange: props.onSelectChange,
              options: props.providers,
              components: true,
              name: "provider"
            }}
          />
        ) : (
          <SolidInput
            type="text"
            name="idp"
            onChange={props.onChangeInput}
            placeholder={props.inputPlaholder}
          />
        )}
        <SolidLinkButton type="button" onClick={props.optionToggle}>
          {props.withWebId ? props.btnTxtProvider : props.btnTxtWebId}
        </SolidLinkButton>
        <SolidButton type="submit">{props.formButtonText}</SolidButton>
      </form>
    </LoginFormWrapper>
  );
};

export default LoginForm;

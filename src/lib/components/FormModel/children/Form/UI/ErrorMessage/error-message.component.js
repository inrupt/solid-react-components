import React from 'react';
import { ErrorWrapper } from './error-message.styled';

export const ErrorMessage = ({ valid, errorMessage }) =>
  !valid && <ErrorWrapper>{errorMessage}</ErrorWrapper>;

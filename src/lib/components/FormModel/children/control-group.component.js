import React from 'react';
import ErrorMessage from './Form/UI/ErrorMessage';

const ControlGroup = ({ component: Component, fieldData, ...rest }) => {
  const valid = fieldData['ui:valid'];
  const errorMessage = fieldData['ui:defaultError'] || 'Field is invalid!';

  return (
    <>
      <Component {...{ ...fieldData, ...rest }} />
      <ErrorMessage {...{ valid, errorMessage }} />
    </>
  );
};

export default ControlGroup;

import React from 'react';

const ControlGroup = ({ component: Component, fieldData, ...rest }) => (
  <Component {...{ ...fieldData, ...rest }} />
);

export default ControlGroup;

import React from 'react';
import unique from 'unique';

const Form = ({ fields }: { fields: [] }) => (
  <form>
    {fields.map(field => {
      const { component: Component, props } = field;
      return <Component {...props} key={unique()} />;
    })}
  </form>
);

export default Form;

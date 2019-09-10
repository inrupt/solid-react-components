import React from 'react';

export const Multiple = ({ field, addNewField }) =>
  field['rdf:type'].includes('Multiple') && (
    <button type="button" onClick={() => addNewField(field['ui:name'])}>
      Add new field
    </button>
  );

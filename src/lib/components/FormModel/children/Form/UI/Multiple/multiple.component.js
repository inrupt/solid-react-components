import React from 'react';

export const Multiple = ({ field, addNewField, className }) =>
  field['rdf:type'].includes('Multiple') && (
    <button type="button" onClick={() => addNewField(field['ui:name'])} className={className}>
      Add new field
    </button>
  );

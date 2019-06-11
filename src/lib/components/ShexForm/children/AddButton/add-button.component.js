import React from 'react';
import { shexUtil } from '@utils';
import { ShexConfig } from '@context';

const AddButton = ({ expression, defaultExpression, allowNewFields, text = '+ Add new' }) => {
  return (allowNewFields && (
    <ShexConfig.Consumer>
      {({ theme, languageTheme: { language, addButtonText }, config: { addNewShexField } }) => (
        <button
          onClick={() => addNewShexField(defaultExpression, expression)}
          type="button"
          className={theme && theme.addButtonStyle}
        >
          {`${addButtonText || text} ${shexUtil.formLabel(defaultExpression, language)}`}
        </button>
      )}
    </ShexConfig.Consumer>
  ): null);
};

export default AddButton;

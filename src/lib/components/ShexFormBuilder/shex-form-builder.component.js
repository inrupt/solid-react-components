import React from 'react';
import { LiveUpdate } from '@solid/react';
import ShexFormLive from './children/ShexFormLive';

type Props = {
  errorCallback: () => void,
  successCallback: () => void,
  messageValidation: { error: Array<String> },
  documentUri: String,
  shexUri: String,
  rootShape: String,
  theme: Object,
  languageTheme: Object
};

const ShexFormBuilder = ({
  successCallback,
  errorCallback,
  documentUri,
  shexUri,
  rootShape,
  theme,
  languageTheme,
  autoSaveMode
}: Props) => {
  const subscribeUri = documentUri && documentUri !== '' ? documentUri.replace(/#.*/, '') : '';

  return (
    subscribeUri && (
      <LiveUpdate subscribe={subscribeUri}>
        <ShexFormLive
          {...{
            successCallback,
            errorCallback,
            documentUri,
            shexUri,
            rootShape,
            theme,
            languageTheme,
            autoSaveMode
          }}
        />
      </LiveUpdate>
    )
  );
};

ShexFormBuilder.defaultProps = {
  // eslint-disable-next-line no-console
  successCallback: () => console.log('Submitted successfully'),
  // eslint-disable-next-line no-console
  errorCallback: e => console.log('Status: ', e.status || e.code, e),
  theme: {
    input: 'solid-input-shex',
    select: 'solid-input-shex solid-select-shex',
    deleteButton: 'solid-button-shex',
    form: 'solid-shex-form'
  },
  languageTheme: {
    language: 'en',
    saveBtn: 'Save',
    resetBtn: 'Reset',
    addButtonText: '+ Add new ',
    deleteButton: 'Delete',
    dropdownDefaultText: '- Select -'
  }
};

export default ShexFormBuilder;

import React from 'react';
import styled from 'styled-components';
import { FormModelConfig } from '@context';

import { ProviderLogin, FormModel, AutoSaveDefaultSpinner } from '@lib';

const DemoWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const context = {
  theme: {
    inputText: 'sdk-input',
    inputCheckbox: 'sdk-checkbox checkbox',
    inputTextArea: 'sdk-textarea'
  },
  savingComponent: AutoSaveDefaultSpinner
};

const App = () => {
  return (
    <FormModelConfig.Provider value={context}>
      <DemoWrapper>
        <ProviderLogin callbackUri={`${window.location.origin}/`} />
        <FormModel
          {...{
            modelPath: 'https://khoward.dev.inrupt.net/public/FormModel/datetime.ttl#formRoot',
            podPath: 'https://jmartin.inrupt.net/profile/card#me',
            viewer: false,
            onError: error => {
              // eslint-disable-next-line no-console
              console.log(error, 'error');
            },
            onSuccess: success => {
              // eslint-disable-next-line no-console
              console.log(success);
            },
            onSave: response => {
              // eslint-disable-next-line no-console
              console.log(response);
            },
            onAddNewField: response => {
              // eslint-disable-next-line no-console
              console.log(response);
            },
            onDelete: response => {
              // eslint-disable-next-line no-console
              console.log(response);
            }
          }}
          autoSave
          liveUpdate
        />
      </DemoWrapper>
    </FormModelConfig.Provider>
  );
};

export default App;

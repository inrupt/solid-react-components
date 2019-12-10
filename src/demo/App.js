import React, { useState } from 'react';
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
  languageTheme: {},
  savingComponent: AutoSaveDefaultSpinner
};

const MODE = {
  VIEW: 'view',
  EDIT: 'edit'
};

const App = () => {
  const [mode, setMode] = useState(MODE.EDIT);

  return (
    <FormModelConfig.Provider value={context}>
      <button type="submit" onClick={() => setMode(mode === MODE.VIEW ? MODE.EDIT : MODE.VIEW)}>
        {mode} mode
      </button>
      <DemoWrapper>
        <ProviderLogin callbackUri={`${window.location.origin}/`} />
        <FormModel
          {...{
            modelPath: 'https://khoward.dev.inrupt.net/public/FormModel/datetime.ttl#formRoot',
            podPath: 'https://angelaraya.inrupt.net/profile/card#me',
            viewer: mode === MODE.VIEW,
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

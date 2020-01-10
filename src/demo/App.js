import React from 'react';
import styled from 'styled-components';
import { ProviderLogin, FormModel, Spinner } from '@lib';

const DemoWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const App = () => {
  return (
    <DemoWrapper>
      <FormModel
        {...{
          // modelSource: 'https://angelaraya.inrupt.net/public/forms/simple.ttl#formRoot',
          modelSource:
            'https://solidsdk.inrupt.net/public/FormLanguage/examples/FormModel/Multiple.ttl#formRoot',
          dataSource: 'https://angelaraya.inrupt.net/public/sources/assorted.ttl#data',
          options: {
            autosave: true,
            theme: {},
            autosaveIndicator: Spinner
          }
        }}
      />
      <hr />
      <ProviderLogin callbackUri={`${window.location.origin}/`} />
    </DemoWrapper>
  );
};

export default App;

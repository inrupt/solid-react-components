import React from 'react';
import styled from 'styled-components';
import { ProviderLogin, FormModel } from '@lib';

const DemoWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const App = () => {
  return (
    <DemoWrapper>
      <FormModel
        {...{
          modelSource: 'https://angelaraya.inrupt.net/public/forms/simple.ttl#formRoot',
          dataSource: 'https://angelaraya.inrupt.net/public/sources/assorted.ttl#data',
          options: {
            autosave: true,
            theme: {}
          }
        }}
      />
      <hr />
      <ProviderLogin callbackUri={`${window.location.origin}/`} />
    </DemoWrapper>
  );
};

export default App;

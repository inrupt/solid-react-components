import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import { ProviderLogin } from '@solid-react-components';
import ProviderLoginReadme from './README.md';

storiesOf('Provider Login', module)
  .addDecorator(withKnobs)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: ProviderLoginReadme
    },
    jest: ['provider-login.container.test.js']
  })
  .add('default', () => (
    <ProviderLogin
      selectPlaceholder={text('selectPlaceholder', 'Provider')}
      inputPlaceholder={text('inputPlaceholder', 'WebId')}
      formButtonText={text('formButtonText', 'Login')}
      btnTxtWebId={text('btnTxtWebId', 'Enter WebId')}
      btnTxtProvider={text('btnTxtProvider', 'Select provider')}
      errorsText={object('errorsText', {
        unknown: 'Unknown',
        webIdNotValid: 'WebId Not Valid',
        emptyProvider: 'Empty Provider',
        emptyWebId: 'Empty WebId'
      })}
    />
  ));

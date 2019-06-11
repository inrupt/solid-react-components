import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import { PrivateRoute } from '@solid-react-components/components/PrivateRoute/private-route.component';

import Readme from './README.md';

const LoggedIn = () => (
  <section>
    <h2>You're logged in</h2>
  </section>
);
storiesOf('Private Route', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme
    },
    jest: ['private-route.component.test.js']
  })
  .addDecorator(withKnobs)
  .add('WebId', () => <PrivateRoute webId={text('webId', undefined)} component={LoggedIn} />);

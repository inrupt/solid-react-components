import React from 'react';
import { storiesOf } from '@storybook/react';
import {
    LogoutButton
} from "@solid-react-components";

import LogoutButtonReadme from './README.md';

storiesOf('Logout button', module).addParameters({
    readme: {
        // Show readme at the addons panel
        sidebar: LogoutButtonReadme,
    },
}).add('default', () => <LogoutButton />);

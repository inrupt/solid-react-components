import React from 'react';
import { storiesOf } from '@storybook/react';
import {
    PrivateRoute
} from "@solid-react-components";
import Readme from "./README.md";

storiesOf('Private Route', module).addParameters({
    readme: {
        // Show readme at the addons panel
        sidebar: Readme,
    },
}).add('default', () => <h1> Private Route</h1>);

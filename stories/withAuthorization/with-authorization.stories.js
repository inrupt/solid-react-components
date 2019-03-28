import React from 'react';
import { storiesOf } from '@storybook/react';
import {
    withWebId
} from "@solid-react-components";
import withAuthorizationReadme from "./README.md";

const Component = props => <span>Component Props: <strong>{JSON.stringify(props)}</strong></span>;

const ComponentWebId =  withWebId(Component);

storiesOf('withAuthorization', module).addParameters({
    readme: {
        // Show readme at the addons panel
        content: withAuthorizationReadme,
    },jest: ['with-authorization.test.js']
}).add('default', () => <ComponentWebId  />);

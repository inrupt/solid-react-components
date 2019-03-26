import React from 'react';
import { storiesOf } from '@storybook/react';
import {
    withWebId
} from "@solid-react-components";
import withAuthorizationReadme from "./README.md";

const Component = props => <span>WebId: <strong>{JSON.stringify(props.webId)}</strong></span>;

const ComponentWebId =  withWebId(Component);

storiesOf('withAuthorization', module).addParameters({
    readme: {
        // Show readme at the addons panel
        sidebar: withAuthorizationReadme,
    },
}).add('default', () => <ComponentWebId  />);

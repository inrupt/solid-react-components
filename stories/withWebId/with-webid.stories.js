import React from 'react';
import { storiesOf } from '@storybook/react';
import {
    withWebId
} from "@solid-react-components";
import withWebIdReadme from "./README.md";

const Component = props => <span>WebId: <strong>{JSON.stringify(props.webId)}</strong></span>;

const ComponentWebId =  withWebId(Component);

storiesOf('withWebId', module).addParameters({
    readme: {
        // Show readme at the addons panel
        sidebar: withWebIdReadme,
    },
}).add('default', () => <ComponentWebId  />);

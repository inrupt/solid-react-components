import React from 'react';
import { storiesOf } from '@storybook/react';
import {
    withWebId
} from "@solid-react-components";
import withWebIdReadme from "./README.md";

const Component = props => <span>Props: <strong>{JSON.stringify(props)}</strong></span>;

const ComponentWebId =  withWebId(Component);

storiesOf('withWebId', module).addParameters({
    readme: {
        // Show readme at the addons panel
        content: withWebIdReadme,
    },
}).add('default', () => <ComponentWebId  />);

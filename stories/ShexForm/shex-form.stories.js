import React from 'react';
import { storiesOf } from '@storybook/react';
import {withKnobs, text, object} from "@storybook/addon-knobs";
import {
    ShexForm
} from "@solid-react-components";
import ProviderLoginReadme from "./README.md";
import shexj from '../../src/assets/shexj.json';

storiesOf('Shex ShapeForm', module).addDecorator(withKnobs).addParameters({
    readme: {
        // Show readme at the addons panel
        sidebar: ProviderLoginReadme,
    },jest: ['shex-form.test.js']
}).add('default', () => <ShexForm shexj={shexj} />);

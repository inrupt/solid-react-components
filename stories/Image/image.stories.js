import React from 'react';
import { storiesOf } from '@storybook/react';
import {
    Image
} from "@solid-react-components";
import Readme from "./README.md";

storiesOf('Image', module).addParameters({
    readme: {
        // Show readme at the addons panel
        sidebar: Readme,
    },
}).add('default', () => <Image src="/test-image" />);

import React from 'react';
import { storiesOf } from '@storybook/react';
import {
    Image
} from "@solid-react-components";

storiesOf('Image', module).add('default', () => <Image src="/test-image" />);

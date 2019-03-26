import React from 'react';
import { storiesOf } from '@storybook/react';
import {
    ProfileUploader
} from "@solid-react-components";
import ProfileUploaderReadme from "./README.md";

storiesOf('Profile Uploader', module).addParameters({
    readme: {
        // Show readme at the addons panel
        sidebar: ProfileUploaderReadme,
    },
}).add('default', () => <ProfileUploader />);

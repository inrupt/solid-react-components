import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Uploader, ProfileUploader } from '@solid-react-components';
import UploaderReadme from './README.md';

storiesOf('Uploader', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: UploaderReadme
    },
    jest: ['uploader.test.js']
  })
  .add('default', () => (
    <Uploader
      {...{
        render: props => <ProfileUploader {...{ ...props }} />,
        limitFiles: 1,
        limitSize: 2100000,
        accept: 'png,jpg,jpeg',
        errorsText: {
          sizeLimit: 'Size limit',
          unsupported: 'Unsupported',
          maximumFiles: 'Max files'
        },
        onError: action('onError'),
        onComplete: action('onComplete'),
        onDrop: action('onDrop'),
        onStart: action('onStart')
      }}
    />
  ));

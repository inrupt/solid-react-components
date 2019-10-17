import React, { memo } from 'react';
import { LiveUpdate } from '@solid/react';
import FormModel from './form-model.component';

type Props = {
  modelPath: String,
  podPath: String,
  title: String,
  autoSave: boolean,
  onInit: () => void,
  onLoaded: () => void,
  onError: () => void,
  onSuccess: () => void,
  onSave: () => void,
  onAddNewField: () => void,
  onDelete: () => void,
  settings: {
    theme: object,
    languageTheme: object,
    config: object
  }
};

const LiveFormModel = memo(({ liveUpdate = false, podPath, ...props }: Props) => {
  return liveUpdate ? (
    <LiveUpdate subscribe={podPath}>
      <FormModel {...{ ...props, podPath }} />
    </LiveUpdate>
  ) : (
    <FormModel {...{ ...props, podPath }} />
  );
});

export default LiveFormModel;

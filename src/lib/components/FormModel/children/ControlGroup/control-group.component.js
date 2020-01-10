import React, { useState } from 'react';
import ErrorMessage from '../Form/UI/ErrorMessage';

type Props = {
  id: string,
  data: object,
  updateData: Function,
  mapper: object,
  status: object
};

export const ControlGroup = ({
  component: Component,
  fieldData,
  savingComponent: SavingComponent,
  ...rest
}) => {
  const { onSave, autoSave, formObject } = rest;
  const valid = fieldData['ui:valid'];
  const errorMessage = fieldData['ui:defaultError'] || 'Field is invalid!';
  const [savingProcess, setSavingProcess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState(null);

  const onBlur = async () => {
    if (autoSave && Object.keys(formObject).length > 0) {
      setSavingProcess(true);
      setIsSaving(true);
      const submitResult = await onSave();
      const saved = submitResult && submitResult.code === 200 ? 'success' : 'error';
      setIsSaving(false);
      setResult(saved);
    }
  };

  return (
    <React.Fragment>
      <Component {...{ ...fieldData, onBlur, ...rest }} />
      {SavingComponent && savingProcess && (
        <SavingComponent
          inProgress={isSaving}
          result={result}
          setResult={setResult}
          setSavingProcess={setSavingProcess}
        />
      )}
      <ErrorMessage {...{ valid, errorMessage }} />
    </React.Fragment>
  );
};
export default ControlGroup;

import React, { useState } from 'react';
import styled from 'styled-components';
import ErrorMessage from './Form/UI/ErrorMessage';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ControlGroup = ({
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
    <>
      <Wrapper>
        <Component {...{ ...fieldData, onBlur, ...rest }} />
        {SavingComponent && savingProcess && (
          <SavingComponent
            inProgress={isSaving}
            result={result}
            setResult={setResult}
            setSavingProcess={setSavingProcess}
          />
        )}
      </Wrapper>
      <ErrorMessage {...{ valid, errorMessage }} />
    </>
  );
};
export default ControlGroup;

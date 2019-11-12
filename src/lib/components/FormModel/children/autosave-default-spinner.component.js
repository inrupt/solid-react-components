import React, { useState, useEffect, memo } from 'react';

const AutosaveDefaultSpinner = memo(({ inProgress, result, setResult, setSavingProcess }) => {
  const [timer, setTimer] = useState(null);
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    if (result) {
      if (timer) clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          setResult(null);
          setSavingProcess(false);
        }, 2000)
      );
    }
  }, [result]);

  return (
    <div className="autosave-spinner">
      {inProgress ? <div>Saving...</div> : null}
      {result && !inProgress ? <span>{result}</span> : null}
    </div>
  );
});

export default AutosaveDefaultSpinner;

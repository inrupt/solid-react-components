/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react';

import { FormModelConfig } from '@context';
import { FormModelUI, CoreElements } from '@constants';
import UIMapping from './../Viewer/UI/ui-mapping';

type ViewerProps = {
  formModel: Object
};

const { TITLE } = CoreElements;
const { RDF_TYPE, UI_PARTS, UI_VALUE } = FormModelUI;

export const FormViewer = (props: ViewerProps) => {
  const { formModel } = props;
  console.log(formModel);

  let { theme } = useContext(FormModelConfig);
  const [formParts, setFormParts] = useState([]);
  const [controls, setControls] = useState([]);

  /* if the form is updated on the pod we want to keep our version fresh */
  useEffect(() => {
    if (formModel[UI_PARTS]) setFormParts(Object.keys(formModel[UI_PARTS]));
  }, [formModel]);

  useEffect(() => {
    setControls(formParts.map(partName => createControl(partName)));
  }, [formParts]);

  const FormHeader = () => (formModel[TITLE] ? <h2>{formModel[TITLE]}</h2> : null);

  const createControl = partName => {
    const partData = formModel[UI_PARTS][partName];
    const partType = partData[RDF_TYPE];
    const Component = UIMapping(partType);

    return <Component key={partName} {...partData} />;
  };

  return (
    <>
      <FormHeader className={theme.formHeader} />
      {controls.map(control => control)}
    </>
  );
};

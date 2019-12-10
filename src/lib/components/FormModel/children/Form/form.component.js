import React, { useState, useEffect, useContext } from 'react';

import { FormModelUI, CORE_ELEMENTS } from '@constants';
import { FormModelConfig } from '@context';

import { Group } from './form.style';
import ControlGroup from '../control-group.component';
import UIMapping from './UI/ui-mapping';
import Multiple from './UI/Multiple';
import DeleteButton from './UI/DeleteButton';

const { UI_PARTS, RDF_TYPE, UI_LABEL, UI_NAME, UI_MULTIPLE } = FormModelUI;
const { TITLE } = CORE_ELEMENTS;

type Props = {
  formModel: Object,
  formObject: Object,
  parent?: any,
  modifyFormObject: () => void,
  onSave: () => void,
  deleteField: id => Object,
  addNewField: id => Object,
  children: Node,
  autoSave: boolean
};

const Form = ({
  formModel,
  modifyFormObject,
  formObject,
  parent,
  deleteField,
  addNewField,
  autoSave,
  children,
  onSave
}: Props) => {
  const [formFields, setFormFields] = useState([]);
  const { theme, savingComponent } = useContext(FormModelConfig);
  const parts = formModel[UI_PARTS];

  /* keep our data in sync with the form model */
  useEffect(() => {
    if (parts) setFormFields(Object.keys(parts));
  }, [formModel]);

  /* all ui:forms have to have a parts predicate/object */
  if (!parts) return null;

  let classes = theme.form || '';
  if (parent) classes += theme.childGroup || '';

  const FormTitle = () => <h2>{formModel[TITLE] || ''}</h2>;
  const ParentLabel = () =>
    formModel[RDF_TYPE] === UI_MULTIPLE ? <p>{formModel[UI_LABEL]}</p> : null;

  const renderItem = item => {
    const field = parts[item];

    if (!field) return null;

    /* there is a inner form/group */
    if (field[UI_PARTS]) {
      const { [UI_PARTS]: deleted, ...updatedField } = field;
      return (
        <Form
          key={item}
          formModel={field}
          formObject
          modifyFormObject
          parent={updatedField}
          deleteField
          onSave
          autoSave
        >
          <Multiple field addNewField={addNewField} className={theme.multiple} />
          <DeleteButton
            type={field[RDF_TYPE]}
            action={deleteField}
            id={field[UI_NAME]}
            className={theme.deleteButton}
          />
        </Form>
      );
    }

    const component = UIMapping(field[RDF_TYPE]);
    const id = field[UI_NAME] || item;

    return (
      <ControlGroup
        key={item}
        component={component}
        value={field['ui:value']}
        fieldData={{ id, ...field, parent }}
        modifyFormObject={modifyFormObject}
        formObject={formObject}
        autoSave={autoSave}
        onSave={onSave}
        savingComponent={savingComponent}
      />
    );
  };

  return (
    <Group className={classes} parent={parent}>
      <FormTitle />
      <ParentLabel />
      {formFields.map(item => renderItem(item))}
      {children}
    </Group>
  );
};

Form.defaultProps = {
  parent: null
};

export default Form;

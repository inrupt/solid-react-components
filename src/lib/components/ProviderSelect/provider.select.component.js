// @flow
import React from 'react';
import Select, { components } from 'react-select';
import { SelectOptions } from '@entities';

import { Item, Icon, ItemText } from './styled.components';

type Props = {
  className: String,
  placeholder: string,
  options: Array<SelectOptions>,
  onChange: () => void,
  components: Array<React.Node>
};

const Option = ({ innerProps, isDisabled, innerRef, data }): React.Component =>
  !isDisabled ? (
    <Item ref={innerRef} {...innerProps} className="option">
      <Icon src={data.image} className="icon" alt="provider" />
      <ItemText>{data.label}</ItemText>
    </Item>
  ) : null;

const SingleValue = ({ data, ...props }): React.Component => {
  return (
    <components.SingleValue {...props} className="selected">
      <Icon src={data.image} className="icon" alt="single_provider" />
      <ItemText>{data.label}</ItemText>
    </components.SingleValue>
  );
};

const ProviderSelect = (props: Props) => {
  const { className, placeholder, options, components, onChange } = props;
  return (
    <Select
      {...{
        placeholder,
        className: `solid-provider-select ${className || ''}`,
        options,
        isSearchable: false,
        components: components && { Option, SingleValue },
        onChange
      }}
    />
  );
};

export default ProviderSelect;

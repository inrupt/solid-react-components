import React, { Component } from "react";
import Select, { components } from "react-select";
import { SelectOptions } from "@entities";

import { Item, Icon, ItemText } from './styled.components';

type Props = {
  className: String,
  placeholder: String,
  options: Array<SelectOptions>,
  onChange: () => void,
  components?: any
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

class ProviderSelect extends Component<Props> {
  render() {
    const {
      className,
      placeholder,
      options,
      components,
      onChange
    } = this.props;
    return (
      <Select
        {...{
          placeholder,
          className: `solid-provider-select ${className ? className : ""}`,
          options,
          components: components ? { Option, SingleValue } : null,
          onChange
        }}
      />
    );
  }
}

export default ProviderSelect;

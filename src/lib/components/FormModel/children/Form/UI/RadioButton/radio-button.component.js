import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  cursor: pointer;
  & > input[type='radio'] {
    display: none;
    appearance: none;
    & + .label-text {
      display: flex;
      height: 1em;
      width: fit-content;
      align-items: center;
      position: relative;
      &::before,
      &::after {
        content: '';
        border-radius: 50%;
        box-sizing: border-box;
      }

      &::before {
        left: 0;
        width: 1em;
        height: 1em;
        margin: 0 8px 0 0;
        background: #f7f7f7;
        box-shadow: 0 0 1px grey;
        display: inline-block;
      }
      &::after {
        left: 2px;
        width: 0.7em;
        height: 0.7em;
        opacity: 0;
        background: #37b2b2;
        transform: translate3d(-20px, 0, 0) scale(0.2);
        transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
        position: absolute;
      }
    }

    &:checked + .label-text {
      &::after {
        transform: translate3d(0, 0, 0);
        opacity: 1;
      }
    }
  }
`;

const RadioButton = ({ label, name, checked, value }) => {
  return (
    <Label htmlFor={name}>
      <input type="radio" name={name} checked={checked || false} value={value} />
      <span className="label-text">{label || 'Label'}</span>
    </Label>
  );
};

export default RadioButton;

import React from "react";
import { shallow } from "enzyme";
import { ProfileUploader } from './profile-uploader.component';
import {
  ImgStyle,
  ButtonStyle
} from "./profile-uploader.style";

import "@testSetup";

describe('should render without crashing', () => {
  const wrapper = shallow(<ProfileUploader />);

  it('should render component', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should render image if was uploaded', () => {
    wrapper.setProps({ uploadedFiles: [{ uri: 'img.png' }] });

    expect(wrapper.find(ImgStyle).length).toEqual(1);
  });

  it('should render image if was uploaded', () => {
    expect(wrapper.find(ButtonStyle).length).toEqual(1);
  });
});

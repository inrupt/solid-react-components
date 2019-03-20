import React from "react";
import { shallow } from "enzyme";
import Uploader from './uploader.component';
import "@testSetup";

const BasicComponent = () => <div>Basic Component</div>;

describe('Solid Uploader', () => {
  const wrapper = shallow(<Uploader render={() => <BasicComponent />} />);

  describe('render without crashing', () => {

    it('renders uploader component', () => {
      expect(wrapper).toBeTruthy();
    });

    it('renders prop component', () => {
      expect(wrapper.find(BasicComponent).length).toEqual(1);
    });
  });

  describe('on input file change', () => {
    let mockUploadFn = jest.fn();
    let mockOnCompleteFn = jest.fn();

    wrapper.instance().upload = mockUploadFn;
    it('should call upload function after input file change', () => {

      wrapper.setState({ files: [{ name: 'Test' }] });
      wrapper.update();
      expect(mockUploadFn).toHaveBeenCalledTimes(1);
    });

    wrapper.instance().onComplete = mockOnCompleteFn;
    it('should call onComplete function after files uploaded', () => {
      const files = [{ name: 'Test' }];

      wrapper.setState({ files: [files], uploadedFiles: [files]});
      wrapper.update();
      expect(mockOnCompleteFn).toHaveBeenCalledTimes(1);
    });
  });
});

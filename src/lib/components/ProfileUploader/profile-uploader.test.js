import React from 'react';
import { render, cleanup, getByTestId } from '@testing-library/react';
import ProfileUploader from './profile-uploader.component';
import 'jest-dom/extend-expect';

describe('should render without crashing', () => {
  afterAll(cleanup);

  it('should render component', () => {
    const { container } = render(<ProfileUploader />);
    expect(container).toBeTruthy();
  });

  it('should render No image without upload file', () => {
    const { container } = render(<ProfileUploader />);
    expect(container).toHaveTextContent('Upload File');
  });

  it('should render image if was uploaded', () => {
    const { getByTestId } = render(<ProfileUploader uploadedFiles={[{ uri: 'img.png' }]} />);
    const ImageEl = getByTestId('image-style');

    expect(ImageEl).toBeInTheDocument();
  });

  it('should render upload button', () => {
    const { getByTestId } = render(<ProfileUploader />);
    const ImageEl = getByTestId('button-style');

    expect(ImageEl).toBeInTheDocument();
  });
});

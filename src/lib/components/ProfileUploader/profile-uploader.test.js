import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ProfileUploader from './profile-uploader.component';
import 'jest-dom/extend-expect';

describe('should render without crashing', () => {
  const { container, rerender } = render(<ProfileUploader />);

  afterAll(cleanup);

  it('should render component', () => {
    expect(container).toBeTruthy();
  });

  it('should render No image without upload file', () => {
    expect(container).toHaveTextContent('Upload File');
  });

  it('should render image if was uploaded', () => {
    rerender(<ProfileUploader uploadedFiles={[{ uri: 'img.png' }]} />);

    const ImageEl = document.querySelector('[data-testid="image-style"]');

    expect(ImageEl).toBeInTheDocument();
  });

  it('should render upload button', () => {
    const ImageEl = document.querySelector('[data-testid="button-style"]');

    expect(ImageEl).toBeInTheDocument();
  });
});

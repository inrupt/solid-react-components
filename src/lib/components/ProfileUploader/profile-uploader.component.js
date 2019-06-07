import React from 'react';
import { UploadedFiles } from '@entities';
import {
  ProfileWrapper,
  ImgStyle,
  ButtonStyle
} from './profile-uploader.style';

/**
 * Basic Uploader UI Component Example
 */

type Props = {
  onDrag: () => void,
  onDrop: () => void,
  onDragLeave: () => void,
  onClickFile: () => void,
  overrideEventDefaults: () => void,
  uploadedFiles: Array<Object>,
  uploadedFiles: Array<UploadedFiles>,
  className: String
};

const ProfileUploader = (props: Props) => {
  const {
    overrideEventDefaults,
    onDragLeave,
    onDragEnter,
    onDrop,
    className,
    uploadedFiles,
    onClickFile
  } = props;
  return (
    <ProfileWrapper
      {...{
        onDragStart: overrideEventDefaults,
        onDragOver: overrideEventDefaults,
        onDragEnd: overrideEventDefaults,
        onDrag: overrideEventDefaults,
        onDragLeave,
        onDragEnter,
        onDrop,
        className
      }}
    >
      {uploadedFiles && uploadedFiles.length > 0 && (
        <ImgStyle
          src={uploadedFiles[uploadedFiles.length - 1].uri}
          alt="profile"
          data-testid="image-style"
        />
      )}
      <ButtonStyle
        type="button"
        onClick={onClickFile}
        data-testid="button-style"
      >
        Upload File
      </ButtonStyle>
    </ProfileWrapper>
  );
};

export default ProfileUploader;

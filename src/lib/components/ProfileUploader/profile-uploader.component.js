import React from "react";
import {
  ProfileWrapper,
  ImgStyle,
  ButtonStyle
} from "./profile-uploader.style";

type Props = {
  onDragStart: () => void,
  onDragOver: () => void,
  onDragEnd: () => void,
  onDrag: () => void,
  onDrop: () => void,
  onDragLeave: () => void,
  onDragEnter: () => void,
  onClickFile: () => void,
  className: String,
  uploadedFiles: Array<Object>,
};

export const ProfileUploader = (props: Props) => {
  return (
    <ProfileWrapper
      {...{
        onDragStart: props.overrideEventDefaults,
        onDragOver: props.overrideEventDefaults,
        onDragEnd: props.overrideEventDefaults,
        onDrag: props.overrideEventDefaults,
        onDragLeave: props.onDragLeave,
        onDragEnter: props.onDragEnter,
        onDrop: props.onDrop,
        className: props.className
      }}
    >
      {props.uploadedFiles && props.uploadedFiles.length > 0 && (
        <ImgStyle src={props.uploadedFiles[props.uploadedFiles.length - 1].uri} alt="profile" />
      )}
      <ButtonStyle type="button" onClick={props.onClickFile}>
        Upload File
      </ButtonStyle>
    </ProfileWrapper>
  );
};

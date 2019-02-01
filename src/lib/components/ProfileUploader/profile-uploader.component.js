import React from "react";
import { UploadedFiles } from "@entities";
import {
  ProfileWrapper,
  ImgStyle,
  ButtonStyle
} from "./profile-uploader.style";

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
  className: String,
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
